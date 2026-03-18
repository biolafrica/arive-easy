import Anvil from '@anvilco/anvil';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { buildAnvilPayload } from './anvilFieldResolver';
import { generateApplicationRefNo } from '@/utils/common/generateApplicationRef';
import { PartnerDocumentBase, TemplateBase, TransactionDocumentBase } from '@/type/pages/dashboard/documents';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { PropertyBase } from '@/type/pages/property';
import { PreApprovalBase } from '@/type/pages/dashboard/approval';
import { humanizeSnakeCase } from '../common/humanizeSnakeCase';

export interface DocumentGenerationParams {
  applicationId: string;
  documentType: string;
}

export interface DocumentGenerationResult {
  success: boolean;
  etchPacketEid?: string;
  transactionDocument?: TransactionDocumentBase;
  error?: string;
  details?: string;
}

export class DocumentGeneratorService {
  private anvilClient: Anvil;
  private applicationQB: SupabaseQueryBuilder<ApplicationBase>;
  private partnerDocQB: SupabaseQueryBuilder<PartnerDocumentBase>;
  private propertyQB: SupabaseQueryBuilder<PropertyBase>;
  private preApprovalQB: SupabaseQueryBuilder<PreApprovalBase>;
  private transactionDocQB: SupabaseQueryBuilder<TransactionDocumentBase>;
  private templateQB: SupabaseQueryBuilder<TemplateBase>;

  constructor() {
    this.anvilClient = new Anvil({ apiKey: process.env.ANVIL_API_KEY! });
    this.applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');
    this.partnerDocQB = new SupabaseQueryBuilder<PartnerDocumentBase>('partner_documents');
    this.propertyQB = new SupabaseQueryBuilder<PropertyBase>('properties');
    this.preApprovalQB = new SupabaseQueryBuilder<PreApprovalBase>('pre_approvals');
    this.transactionDocQB = new SupabaseQueryBuilder<TransactionDocumentBase>('document_transactions');
    this.templateQB = new SupabaseQueryBuilder<TemplateBase>('document_templates');
  }

  async generateDocument(params: DocumentGenerationParams): Promise<DocumentGenerationResult> {
    const { applicationId, documentType} = params;

    try {
      const masterTemplate = await this.validateMasterTemplate(documentType);
      if (!masterTemplate.success) {
        return masterTemplate;
      }

      const application = await this.applicationQB.findById(applicationId);
      if (!application) {
        return {
          success: false,
          error: 'Application not found',
        };
      }

      const partnerDocument = await this.validatePartnerDocument(
        application.developer_id,
        documentType
      );

      if (!partnerDocument.success) {
        return partnerDocument;
      }

      const duplicateCheck = await this.checkDuplicateDocument(applicationId, documentType);
      if (!duplicateCheck.success) {
        return duplicateCheck;
      }

      const [buyer, property] = await Promise.all([
        this.preApprovalQB.findById(application.pre_approval_id),
        this.propertyQB.findById(application.property_id),
      ]);

      if (!buyer || !property) {
        return {
          success: false,
          error: 'Buyer or property data not found',
        };
      }

      const anvilData = buildAnvilPayload(masterTemplate.data!.template_fields, {
        partnerDocument: partnerDocument.data!,
        buyerInfo: buyer.personal_info,
        property,
        application,
        applicationId,
      });

      const etchResult = await this.createEtchPacket({
        documentType,
        applicationId,
        masterTemplate: masterTemplate.data!,
        anvilData,
        buyer,
        partnerDocument: partnerDocument.data!,
      });

      if (!etchResult.success) {
        return etchResult;
      }

      const transactionDoc = await this.transactionDocQB.create({
        application_id: applicationId,
        partner_document_id: partnerDocument.data!.id,
        template_id: partnerDocument.data!.template_id,
        transaction_document_number: generateApplicationRefNo('TRD'),
        document_type: documentType,
        buyer_id: application.user_id,
        seller_id: application.developer_id,
        property_id: application.property_id,
        populated_data: anvilData,
        esign_provider: 'anvil',
        esign_document_id: etchResult.etchPacketEid!,
        esign_envelope_id: etchResult.envelopeEid!,
        status: 'sent',
        sent_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      await this.updateApplicationStage(application, documentType, 'sent');

      return {
        success: true,
        etchPacketEid: etchResult.etchPacketEid,
        transactionDocument: transactionDoc,
      };

    } catch (error) {
      console.error('Document generation error:', error);
      return {
        success: false,
        error: 'Failed to generate document',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async validateMasterTemplate(documentType: string): Promise<{
    success: boolean;
    error?: string;
    data?: TemplateBase;
  }> {
    const masterTemplate = await this.templateQB.findOneByCondition({
      type: documentType,
      status: 'active',
    });

    if (!masterTemplate) {
      return {
        success: false,
        error: `Kindly setup Master template for ${humanizeSnakeCase(documentType)}`,
      };
    }

    return { success: true, data: masterTemplate };
  }

  private async validatePartnerDocument(
    partnerId: string,
    documentType: string
  ): Promise<{
    success: boolean;
    error?: string;
    data?: PartnerDocumentBase;
  }> {
    const partnerDocument = await this.partnerDocQB.findOneByCondition({
      partner_id: partnerId,
      document_type: documentType,
      status: 'active',
    });

    if (!partnerDocument) {
      return {
        success: false,
        error: 'Partner is yet to setup their template',
      };
    }

    return { success: true, data: partnerDocument };
  }

  private async checkDuplicateDocument(
    applicationId: string,
    documentType: string
  ): Promise<{ success: boolean; error?: string }> {
    const existingDocument = await this.transactionDocQB.findOneByCondition({
      application_id: applicationId,
      document_type: documentType,
    });

    if (existingDocument) {
      return {
        success: false,
        error: `A document of type ${humanizeSnakeCase(documentType)} has already been generated for this application`,
      };
    }

    return { success: true };
  }

  private async createEtchPacket(params: {
    documentType: string;
    applicationId: string;
    masterTemplate: TemplateBase;
    anvilData: any;
    buyer: PreApprovalBase;
    partnerDocument: PartnerDocumentBase;
  }): Promise<{
    success: boolean;
    error?: string;
    details?: string;
    etchPacketEid?: string;
    envelopeEid?: string;
  }> {
    const { documentType, applicationId, masterTemplate, anvilData, buyer, partnerDocument } =
      params;

    const { statusCode, data: result, errors } = await this.anvilClient.createEtchPacket({
      variables: {
        name: `${documentType} - ${applicationId}`,
        isDraft: false,
        isTest: process.env.NODE_ENV !== 'production',

        files: [
          {
            id: 'contractTemplate',
            castEid: masterTemplate.anvil_template_id,
          },
        ],

        data: {
          payloads: {
            contractTemplate: { data: anvilData },
          },
        },

        signers: [
          {
            id: 'buyer',
            name: `${buyer.personal_info.first_name} ${buyer.personal_info.last_name}`,
            email: buyer.personal_info.email,
            signerType: 'email',
            routingOrder: 1,
            fields: [
              { fileId: 'contractTemplate', fieldId: 'buyerSignature' },
              { fileId: 'contractTemplate', fieldId: 'buyerSignatureDate' },
            ],
          },
          {
            id: 'seller',
            name: partnerDocument.static_data.sellerSignatoryName,
            email: partnerDocument.static_data.sellerEmailValue,
            signerType: 'email',
            routingOrder: 2,
            fields: [
              { fileId: 'contractTemplate', fieldId: 'sellerSignature' },
              { fileId: 'contractTemplate', fieldId: 'sellerSignatureDate' },
            ],
          },
        ],
      },
    });

    if (errors && errors.length > 0) {
      const errorMessage = errors.map((e: any) => e.message || JSON.stringify(e)).join(', ');
      return {
        success: false,
        error: 'Failed to create Anvil etch packet',
        details: errorMessage,
      };
    }

    if (!result) {
      return {
        success: false,
        error: 'Failed to create Anvil etch packet',
        details: 'Empty response from Anvil',
      };
    }

    const etchPacket = result?.data?.createEtchPacket;

    if (!etchPacket) {
      return {
        success: false,
        error: 'Failed to create Anvil etch packet',
        details: 'No etch packet returned in response',
      };
    }

    return {
      success: true,
      etchPacketEid: etchPacket.eid,
      envelopeEid: etchPacket.documentGroup?.eid,
    };
  }

  private async updateApplicationStage(
    application: ApplicationBase,
    documentType: string,
    status: 'sent' | 'completed'
  ): Promise<void> {
    try {
    
      const currentStage = application.stages_completed.terms_agreement;

      await this.applicationQB.update(application.id, {
        stages_completed: {
          ...application.stages_completed,
          terms_agreement: {
            ...currentStage,
            status: currentStage?.status || 'current',
            completed: currentStage?.completed || false,
            data: {
              ...currentStage?.data,
              [`${documentType}_status`]: status,
              [`${documentType}_sent_at`]: new Date().toISOString(),
            }
          }
        }
      });

      console.log(`Updated terms and agreement stage with ${documentType} status: ${status}`);
    } catch (error) {
      console.error('Failed to update application stage:', error);
    }
  }
}


export const documentGenerator = new DocumentGeneratorService();