import { DiditSessionResponse, DiditWebhookPayload, VerificationType } from '@/type/common/didit';
import crypto from 'crypto';

const DIDIT_BASE_URL = process.env.DIDIT_BASE_URL || 'https://verification.didit.me';
const DIDIT_API_KEY = process.env.DIDIT_API_KEY!;
const DIDIT_WEBHOOK_SECRET = process.env.DIDIT_WEBHOOK_SECRET!;

const WORKFLOW_IDS = {
  home_country: process.env.DIDIT_HOME_COUNTRY_WORKFLOW_ID!, 
  immigration: process.env.DIDIT_IMMIGRATION_WORKFLOW_ID!, 
};

export async function createVerificationSession( 
  applicationId: string, verificationType: VerificationType, callbackUrl: string, metadata?: Record<string, any>
): Promise<DiditSessionResponse> {
  const workflowId = WORKFLOW_IDS[verificationType];
  
  if (!workflowId) {
    throw new Error(`No workflow configured for verification type: ${verificationType}`);
  }

  const response = await fetch(`${DIDIT_BASE_URL}/v2/session/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': DIDIT_API_KEY,
    },
    body: JSON.stringify({
      workflow_id: workflowId,
      vendor_data: `${applicationId}:${verificationType}`,
      callback: callbackUrl,
      metadata: {
        application_id: applicationId,
        verification_type: verificationType,
        ...metadata,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to create session: ${response.status}`);
  }

  return response.json();
}

export async function getVerificationSession(sessionId: string): Promise<any> {
  const response = await fetch(`${DIDIT_BASE_URL}/v2/session/${sessionId}/`, {
    method: 'GET',
    headers: {
      'X-Api-Key': DIDIT_API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to get session: ${response.status}`);
  }

  return response.json();
}

export function verifyWebhookSignature(
  rawBody: string, signature: string,timestamp: string
): boolean {
  if (!signature || !timestamp || !rawBody || !DIDIT_WEBHOOK_SECRET) {
    return false;
  }

  // Validate timestamp (within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp, 10);
  const timeDiff = Math.abs(currentTime - webhookTime);
  
  if (timeDiff > 300) { // 5 minutes
    console.warn('Webhook timestamp expired');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', DIDIT_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function verifyStructuredSignature(
  sessionId: string, status: string, createdAt: string, signature: string
): boolean {
  const signatureData = `${sessionId}|${status}|${createdAt}`;
  const expectedSignature = crypto
  .createHmac('sha256', DIDIT_WEBHOOK_SECRET)
  .update(signatureData)
  .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function parseVendorData(vendorData: string): {
  applicationId: string; verificationType: VerificationType;
} {
  const [applicationId, verificationType] = vendorData.split(':');
  return {
    applicationId,
    verificationType: verificationType as VerificationType,
  };
}

export function mapDiditStatus(diditStatus: string): string {
  const statusMap: Record<string, string> = {
    'Not Started': 'not_started',
    'In Progress': 'in_progress',
    'In Review': 'in_review',
    'Approved': 'approved',
    'Declined': 'declined',
    'Expired': 'expired',
    'Abandoned': 'abandoned',
    'KYC Expired': 'kyc_expired',
  };

  return statusMap[diditStatus] || diditStatus.toLowerCase().replace(/ /g, '_');
}

export function calculateOverallStatus(
  homeCountryStatus: string, immigrationStatus: string
): string {

  if (homeCountryStatus === 'approved' && immigrationStatus === 'approved') {
    return 'approved';
  }

  if (homeCountryStatus === 'declined' || immigrationStatus === 'declined') {
    return 'failed';
  }

  if (homeCountryStatus === 'in_review' || immigrationStatus === 'in_review') {
    return 'pending';
  }

  if ( 
    homeCountryStatus === 'in_progress' || immigrationStatus === 'in_progress' || homeCountryStatus === 'approved' || immigrationStatus === 'approved'
  ) {
    return 'partial';
  }
  return 'not_started';
}


