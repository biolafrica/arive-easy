import { NextRequest, NextResponse } from "next/server";
import Anvil from '@anvilco/anvil';

import { requireAuth } from "@/utils/server/authMiddleware";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { buildAnvilPayload } from "@/lib/anvilFieldResolver";

import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PreApprovalBase } from "@/type/pages/dashboard/approval";
import { PartnerDocumentBase,TemplateBase, TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { PropertyBase } from "@/type/pages/property";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";


export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!user || user.user_metadata?.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>('applications');
    const partnerDocumentQueryBuilder = new SupabaseQueryBuilder<PartnerDocumentBase>('partner_documents');
    const propertyQueryBuilder = new SupabaseQueryBuilder<PropertyBase>('properties');
    const preApprovalQueryBuilder = new SupabaseQueryBuilder<PreApprovalBase>('pre_approvals');
    const transactionDocumentQueryBuilder = new SupabaseQueryBuilder<TransactionDocumentBase>('document_transactions'); 
    const templateQueryBuilder = new SupabaseQueryBuilder<TemplateBase>('document_templates');

    const anvilClient = new Anvil({ apiKey: process.env.ANVIL_API_KEY! })

    const body = await request.json();
    const { applicationId, documentType } = body;

    const masterTemplate = await templateQueryBuilder.findOneByCondition({
      type: documentType,
      status: 'active'
    })

    if (!masterTemplate) {
      return NextResponse.json({ error: `Kindly setup Master template for ${documentType}` }, { status: 404 });
    }

    const application = await applicationQueryBuilder.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const partnerDocument = await partnerDocumentQueryBuilder.findOneByCondition({
      partner_id: application.developer_id,
      document_type: documentType,
      status: 'active',
    });

    console.log("partnerDocument", partnerDocument)

    if (!partnerDocument) {
      return NextResponse.json({ error: 'Partner is yet to setup their template' }, { status: 404 });
    }


    const [buyer, property] = await Promise.all([
      preApprovalQueryBuilder.findById(application.pre_approval_id),
      propertyQueryBuilder.findById(application.property_id)
    ]);


    if (!buyer || !property) {
      return NextResponse.json({ error: 'Buyer or property data not found' }, { status: 404 });
    }

    const anvilData = buildAnvilPayload(masterTemplate.template_fields, {
      partnerDocument,
      buyerInfo: buyer.personal_info,
      property,
      application,
      applicationId
    });

    console.log('Anvil payload:', anvilData);

    const { statusCode, data: result, errors } = await anvilClient.createEtchPacket({
      variables: {
        name: `${documentType} - ${applicationId}`,
        isDraft: false,
        isTest: process.env.NODE_ENV !== 'production',
        webhookURL: 'https://www.usekletch.com/api/webhook/anvil',

        files: [{
          id: 'contractTemplate',
          castEid: masterTemplate.anvil_template_id, 
        }],

        data: {
          payloads: {
            contractTemplate: { data: anvilData }
          }
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
              { fileId: 'contractTemplate', fieldId: 'buyerSignatureDate' }
            ]
          },
          {
            id: 'seller',
            name: partnerDocument.static_data.sellerSignatoryName,
            email: partnerDocument.static_data.sellerEmailValue,
            signerType: 'email',
            routingOrder: 2,
            fields: [
              { fileId: 'contractTemplate', fieldId: 'sellerSignature' },
              { fileId: 'contractTemplate', fieldId: 'sellerSignatureDate' }
            ]
          }
        ]
      }
    });

    console.log('Anvil statusCode:', statusCode)
    console.log('Anvil errors:', JSON.stringify(errors, null, 2))
    console.log('Anvil result:', JSON.stringify(result, null, 2))

    if (errors && errors.length > 0) {
      const errorMessage = errors
      .map((e: any) => e.message || JSON.stringify(e))
      .join(', ')

      return NextResponse.json(
        {
          error: 'Failed to create Anvil etch packet',
          details: errorMessage,
          statusCode
        },
        { status: 500 }
      )
    }

    if (!result) {
      return NextResponse.json(
        {
          error: 'Failed to create Anvil etch packet',
          details: 'Empty response from Anvil',
          statusCode
        },
        { status: 500 }
      )
    }

    const etchPacket = result?.data?.createEtchPacket

    if (!etchPacket) {
      return NextResponse.json(
        { 
          error: 'Failed to create Anvil etch packet',
          details: 'No etch packet returned in response',
          rawResponse: result
        },
        { status: 500 }
      )
    }

    await transactionDocumentQueryBuilder.create({
      application_id: applicationId,
      partner_document_id: partnerDocument.id,
      template_id: partnerDocument.template_id,
      transaction_document_number:generateApplicationRefNo('TRD'),
      document_type: documentType,
      buyer_id: application.user_id,
      seller_id: application.developer_id,
      property_id: application.property_id,
      populated_data: anvilData,
      esign_provider: 'anvil',
      esign_document_id: etchPacket.eid,
      esign_envelope_id: etchPacket.documentGroup?.eid,
      status: 'sent',
      sent_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({ success: true, etchPacketEid: etchPacket.eid })


  } catch (error) {
    console.error('E-signature sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send document for signature' },
      { status: 500 }
    );
  }

}


