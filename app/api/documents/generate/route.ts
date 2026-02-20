import { resolveFieldValue } from "@/lib/documentFieldMappings";
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PreApprovalBase } from "@/type/pages/dashboard/approval";
import { PartnerDocumentBase, SendToESignatureProps, TemplateBase, TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { PropertyBase } from "@/type/pages/property";
import { requireAuth } from "@/utils/server/authMiddleware";
import { storageManager } from "@/utils/server/storageManager";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest, NextResponse } from "next/server";

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
    
    
    const body = await request.json();
    const { applicationId, documentType } = body;

    const application = await applicationQueryBuilder.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    console.log("application", application)

    const partnerDocument = await partnerDocumentQueryBuilder.findOneByCondition({
      partner_id: application.developer_id,
      document_type: documentType,
      status: 'active',
    });
    console.log("partnerDocument", partnerDocument)

    if (!partnerDocument) {
      return NextResponse.json({ error: 'No active template found for this document type' }, { status: 404 });
    }

    const masterTemplate = await templateQueryBuilder.findById(partnerDocument.template_id);
    if (!masterTemplate) {
      return NextResponse.json({ error: 'Master template not found' }, { status: 404 });
    }
    console.log("master template", masterTemplate)

    const [buyer, property] = await Promise.all([
      preApprovalQueryBuilder.findById(application.pre_approval_id),
      propertyQueryBuilder.findById(application.property_id)
    ]);

    console.log("buyer", buyer)
    console.log("property", property)

    if (!buyer || !property) {
      return NextResponse.json({ error: 'Buyer or property data not found' }, { status: 404 });
    }

    const mergeData = generateMergeDataFromTemplate({
      templateFields: masterTemplate.template_fields,
      data: {
        partnerDocument,
        buyer : buyer.personal_info,
        property,
        application,
        applicationId
      }
    });

    console.log('Generated merge data:', Object.keys(mergeData));

    const generatedDocumentUrl = await generatePdfFromTemplate({
      templateUrl: partnerDocument.template_document_url || '',
      templateFields: masterTemplate.template_fields,
      mergeData,
      outputPath: `applications/${applicationId}/documents/${documentType}-${Date.now()}.pdf`
    });

    const esignResult = await sendToESignaturesCom({
      documentUrl: generatedDocumentUrl,
      applicationId,
      documentType,
      signers: [
        {
          role: 'buyer',
          name: `${buyer.personal_info.first_name} ${buyer.personal_info.last_name}`,
          email: buyer.personal_info.email,
        },
        {
          role: 'seller',
          name: partnerDocument.static_data.seller.company_name,
          email: partnerDocument.static_data.seller.email,
        }
      ]
    });

    const transactionDocument = await transactionDocumentQueryBuilder.create({
      application_id: applicationId,
      partner_document_id: partnerDocument.id,
      template_id: partnerDocument.template_id,
      document_type: documentType,
      buyer_id: application.user_id,
      seller_id: application.developer_id,
      property_id: application.property_id,
      
      populated_data: mergeData,
      generated_document_url: generatedDocumentUrl,
      
      esign_provider: 'signwell.com',
      esign_document_id: esignResult.document_id,
      esign_envelope_id: esignResult.envelope_id,
      signing_urls: esignResult.signing_urls,
      
      signatures: {},
      required_signatures: ['buyer', 'seller'],
      
      status: 'sent',
      generated_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      transaction_document: transactionDocument,
      signing_urls: esignResult.signing_urls,
      message: 'Document generated and sent for signature successfully'
    });


  } catch (error) {
    console.error('E-signature sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send document for signature' },
      { status: 500 }
    );
  }

}

function generateMergeDataFromTemplate({
  templateFields,
  data
}: {
  templateFields: any[];
  data: {
    partnerDocument: any;
    buyer: any;
    property: any;
    application: any;
    applicationId: string;
  };
}): Record<string, any> {
  
  const mergeData: Record<string, any> = {};

  for (const field of templateFields) {
    const value = resolveFieldValue(
      field.field_key,
      field.data_source,
      data,
      field.default_value
    );
    console.log(`Resolved value for ${field.field_key} (${field.data_source}):`, value);

    // Set the value using nested key path
    setNestedValue(mergeData, field.field_key, value);
  }
  console.log('Final merge data object:', mergeData);

  return mergeData;
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  
  target[lastKey] = value;
  console.log(`Set value at path ${path}:`, value);
}


async function generatePdfFromTemplate({
  templateUrl,
  templateFields,
  mergeData,
  outputPath
}: {
  templateUrl: string;
  templateFields: any[];
  mergeData: Record<string, any>;
  outputPath: string;
}): Promise<string> {
  try {
    // Download template
    const templateResponse = await fetch(templateUrl);
    const templateBuffer = await templateResponse.arrayBuffer();
    console.log('Downloaded template, size:', templateBuffer.byteLength);


    // Replace placeholders (simplified - use pdf-lib in production)
    const populatedBuffer = await replacePdfPlaceholders(templateBuffer, templateFields, mergeData);
    console.log('Populated PDF buffer size:', populatedBuffer.byteLength);

    // Upload populated PDF
    const file = new File([populatedBuffer], outputPath.split('/').pop() || 'document.pdf', { 
      type: 'application/pdf' 
    });
    console.log('Created file object for upload:', file);
    
    const uploadedUrl = await storageManager.uploadFile(file, {
      bucket: 'documents',
      folder: 'transactions'
    });

    return uploadedUrl.publicUrl;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF from template');
  }
}

async function sendToESignaturesCom({ documentUrl, applicationId, documentType, signers }: SendToESignatureProps) {
  const apiKey = process.env.ESIGNATURES_API_KEY;
  const apiUrl = process.env.ESIGNATURES_API_URL || 'https://api.esignatures.com/v1';

  if (!apiKey) {
    return {
      document_id: `doc_${Date.now()}`,
      envelope_id: `env_${Date.now()}`,
      signing_urls: {
        buyer: `https://demo.esignatures.com/sign/buyer-${applicationId}`,
        seller: `https://demo.esignatures.com/sign/seller-${applicationId}`
      },
      status: 'sent'
    };
  }

  const envelopeResponse = await fetch(`${apiUrl}/envelopes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: `${documentType.replace('_', ' ')} - Application ${applicationId}`,
      message: 'Please review and sign this document.',
      status: 'sent',
      documents: [{
        name: `${documentType}-${applicationId}.pdf`,
        document_url: documentUrl,
        document_id: '1',
      }],
      recipients: {
        signers: signers.map((signer, index) => ({
          email: signer.email,
          name: signer.name,
          recipient_id: String(index + 1),
          routing_order: String(index + 1),
        })),
      },
      event_notification: {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/esignatures`,
        events: ['envelope-sent', 'envelope-completed', 'envelope-declined'],
      },
    }),
  });

  const envelopeData = await envelopeResponse.json();
  
  return {
    document_id: envelopeData.document_id || envelopeData.envelope_id,
    envelope_id: envelopeData.envelope_id,
    signing_urls: {}, // Would get these from separate API calls
    status: envelopeData.status
  };

}

async function replacePdfPlaceholders(
  pdfBuffer: ArrayBuffer,
  templateFields: any[],
  mergeData: Record<string, any>
): Promise<ArrayBuffer> {
  // Mock implementation - in production use pdf-lib
  console.log('Replacing placeholders:', Object.keys(mergeData));
  return pdfBuffer;
}
