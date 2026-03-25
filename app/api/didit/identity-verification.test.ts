import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const {
  mockRequireAuth,
  mockFindById,
  mockFindOneByCondition,
  mockUpdate,
  mockCreate,
  mockCreateVerificationSession,
  mockVerifyStructuredSignature,
  mockVerifyWebhookSignature,
  mockParseVendorData,
  mockMapDiditStatus,
  mockCalculateOverallStatus,
  mockSendEmail,
  mockCreateNotification,
  mockFetch,
  mockRouterPush,
} = vi.hoisted(() => ({
  mockRequireAuth: vi.fn(),
  mockFindById: vi.fn(),
  mockFindOneByCondition: vi.fn(),
  mockUpdate: vi.fn(),
  mockCreate: vi.fn(),
  mockCreateVerificationSession: vi.fn(),
  mockVerifyStructuredSignature: vi.fn(),
  mockVerifyWebhookSignature: vi.fn(),
  mockParseVendorData: vi.fn(),
  mockMapDiditStatus: vi.fn(),
  mockCalculateOverallStatus: vi.fn(),
  mockSendEmail: vi.fn().mockResolvedValue(undefined),
  mockCreateNotification: vi.fn().mockResolvedValue(undefined),
  mockFetch: vi.fn(),
  mockRouterPush: vi.fn(),
}));


vi.mock('@/utils/server/authMiddleware', () => ({
  requireAuth: mockRequireAuth,
}));

vi.mock('@/utils/supabase/queryBuilder', () => {
  const QB = vi.fn().mockImplementation(function () {
    return {
      findById: mockFindById,
      findOneByCondition: mockFindOneByCondition,
      update: mockUpdate,
      create: mockCreate,
    };
  });
  QB.prototype = {};
  return { SupabaseQueryBuilder: QB, __esModule: true };
});

vi.mock('@/utils/server/didit', () => ({
  createVerificationSession: mockCreateVerificationSession,
  verifyStructuredSignature: mockVerifyStructuredSignature,
  verifyWebhookSignature: mockVerifyWebhookSignature,
  parseVendorData: mockParseVendorData,
  mapDiditStatus: mockMapDiditStatus,
  calculateOverallStatus: mockCalculateOverallStatus,
}));

vi.mock('@/utils/email/send_email', () => ({ sendEmail: mockSendEmail }));
vi.mock('@/utils/notifications/createNotification', () => ({
  createNotification: mockCreateNotification,
}));
vi.mock('@/utils/notifications/notificationContent', () => ({
  buildNotificationPayload: vi.fn().mockReturnValue({}),
}));
vi.mock('@/utils/email/templates/identity-verification', () => ({
  identityVerificationSuccessBody: vi.fn().mockReturnValue('<html>success</html>'),
  identityVerificationDeclineBody: vi.fn().mockReturnValue('<html>decline</html>'),
}));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({ push: mockRouterPush }),
}));
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));


import { POST as createSessionPost } from '@/app/api/didit/create-session/route';
import { GET as checkStatusGet } from '@/app/api/didit/check-status/route';
import { POST as webhookPost } from '@/app/api/didit/webhook/route';

const MOCK_USER = { id: 'user_123', email: 'emeka@example.com', name: 'Emeka Okafor' };

const MOCK_APPLICATION = {
  id: 'app_456',
  user_id: 'user_123',
  processing_fee_payment_status: 'paid',
  identity_verification_status: 'not_started',
  application_number: 'APP-2025-001',
  current_stage: 'identity_verification',
  current_step: 5,
  stages_completed: {
    identity_verification: { completed: false, status: 'current', data: {} },
    property_selection: { status: 'pending', completed: false },
  },
};

const MOCK_VERIFICATION = {
  id: 'verif_001',
  application_id: 'app_456',
  user_id: 'user_123',
  home_country_status: 'not_started',
  immigration_status: 'not_started',
  overall_status: 'not_started',
  home_country_session_id: null,
  immigration_session_id: null,
};

const MOCK_SESSION = {
  session_id: 'did_session_123',
  url: 'https://verify.didit.me/session/did_session_123',
};

const BASE_WEBHOOK_PAYLOAD = {
  session_id: 'did_session_123',
  status: 'approved',
  created_at: '2025-06-01T10:00:00Z',
  vendor_data: '{"applicationId":"app_456","verificationType":"home_country"}',
  decision: {
    id_verifications: [{
      document_type: 'passport',
      document_number: 'A12345678',
      expiration_date: '2030-01-01',
      first_name: 'Emeka',
      last_name: 'Okafor',
      full_name: 'Emeka Okafor',
      date_of_birth: '1990-01-01',
      nationality: 'NG',
      issuing_state: 'NG',
      warnings: [],
    }],
    face_matches: [{ score: 0.98, status: 'approved' }],
    liveness_checks: [{ score: 0.99, method: 'passive', age_estimation: 35 }],
  },
};

function makePostRequest(url: string, body: object, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function makeGetRequest(url: string): NextRequest {
  return new NextRequest(url);
}

function resetMocks() {
  vi.clearAllMocks();
  mockRequireAuth.mockResolvedValue(MOCK_USER);
  mockFindById.mockResolvedValue(MOCK_APPLICATION);
  mockFindOneByCondition.mockResolvedValue(null);
  mockUpdate.mockResolvedValue({ ...MOCK_APPLICATION });
  mockCreate.mockResolvedValue({ id: 'new_id' });
  mockCreateVerificationSession.mockResolvedValue(MOCK_SESSION);
  mockVerifyStructuredSignature.mockReturnValue(true);
  mockVerifyWebhookSignature.mockReturnValue(true);
  mockParseVendorData.mockReturnValue({ applicationId: 'app_456', verificationType: 'home_country' });
  mockMapDiditStatus.mockReturnValue('approved');
  mockCalculateOverallStatus.mockReturnValue('not_started');
  mockSendEmail.mockResolvedValue(undefined);
  mockCreateNotification.mockResolvedValue(undefined);
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      success: true,
      home_country_status: 'not_started',
      immigration_status: 'not_started',
      overall_status: 'not_started',
    }),
  });
}

describe('POST /api/didit/create-session', () => {
  beforeEach(resetMocks);

  it('returns 400 when application_id is missing', async () => {
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Missing required fields');
  });

  it('returns 400 when verification_type is missing', async () => {
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Missing required fields');
  });

  it('returns 400 for invalid verification_type', async () => {
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'invalid_type',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Invalid verification_type');
  });

  it('returns 404 when application not found', async () => {
    mockFindById.mockResolvedValueOnce(null);
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_missing',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    expect(res.status).toBe(404);
  });

  it('returns 403 when application belongs to different user', async () => {
    mockFindById.mockResolvedValueOnce({ ...MOCK_APPLICATION, user_id: 'other_user' });
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    expect(res.status).toBe(403);
  });

  it('returns 400 when processing fee has not been paid', async () => {
    mockFindById.mockResolvedValueOnce({ ...MOCK_APPLICATION, processing_fee_payment_status: 'pending' });
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Processing fee must be paid');
  });

  it('returns 400 when home_country verification is already approved', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_VERIFICATION,
      home_country_status: 'approved',
    });
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('already completed');
  });

  it('returns 400 when verification is in_progress', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_VERIFICATION,
      home_country_status: 'in_progress',
    });
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('already in progress');
  });

  it('creates a new verification record when none exists', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(null);
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ application_id: 'app_456' })
    );
  });

  it('updates existing record and does not create a new one', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    await createSessionPost(req);
    expect(mockUpdate).toHaveBeenCalledWith(
      'verif_001',
      expect.objectContaining({ home_country_session_id: MOCK_SESSION.session_id })
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('stores immigration_session_id when verification_type is immigration', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'immigration',
    });
    await createSessionPost(req);
    expect(mockUpdate).toHaveBeenCalledWith(
      'verif_001',
      expect.objectContaining({ immigration_session_id: MOCK_SESSION.session_id })
    );
  });

  it('returns { success, url, session_id } on success', async () => {
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'home_country',
    });
    const res = await createSessionPost(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.url).toBe(MOCK_SESSION.url);
    expect(json.session_id).toBe(MOCK_SESSION.session_id);
  });

  it('returns 400 when verification is in_review', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_VERIFICATION,
      immigration_status: 'in_review',
    });
    const req = makePostRequest('http://localhost/api/didit/create-session', {
      application_id: 'app_456',
      verification_type: 'immigration',
    });
    const res = await createSessionPost(req);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/didit/check-status', () => {
  beforeEach(resetMocks);

  it('returns 400 when applicationId is missing', async () => {
    const req = makeGetRequest('http://localhost/api/didit/check-status');
    const res = await checkStatusGet(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Missing applicationId');
  });

  it('returns 404 when application not found', async () => {
    mockFindById.mockResolvedValueOnce(null);
    const req = makeGetRequest('http://localhost/api/didit/check-status?applicationId=missing');
    const res = await checkStatusGet(req);
    expect(res.status).toBe(404);
  });

  it('returns 403 when application belongs to different user', async () => {
    mockFindById.mockResolvedValueOnce({ ...MOCK_APPLICATION, user_id: 'other_user' });
    const req = makeGetRequest('http://localhost/api/didit/check-status?applicationId=app_456');
    const res = await checkStatusGet(req);
    expect(res.status).toBe(403);
  });

  it('returns default not_started statuses when no verification record exists', async () => {
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    const req = makeGetRequest('http://localhost/api/didit/check-status?applicationId=app_456');
    const res = await checkStatusGet(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.home_country_status).toBe('not_started');
    expect(json.immigration_status).toBe('not_started');
    expect(json.overall_status).toBe('not_started');
  });

  it('returns actual verification statuses from DB', async () => {
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_VERIFICATION,
      home_country_status: 'approved',
      immigration_status: 'in_progress',
      overall_status: 'not_started',
    });
    const req = makeGetRequest('http://localhost/api/didit/check-status?applicationId=app_456');
    const res = await checkStatusGet(req);
    const json = await res.json();
    expect(json.home_country_status).toBe('approved');
    expect(json.immigration_status).toBe('in_progress');
  });

  it('returns detailed data object with home_country document info', async () => {
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_VERIFICATION,
      home_country_status: 'approved',
      home_country_document_type: 'passport',
      home_country_document_number: 'A12345678',
      home_country_verified_at: '2025-06-01T10:00:00Z',
    });
    const req = makeGetRequest('http://localhost/api/didit/check-status?applicationId=app_456');
    const res = await checkStatusGet(req);
    const json = await res.json();
    expect(json.data.home_country.document_type).toBe('passport');
    expect(json.data.home_country.document_number).toBe('A12345678');
    expect(json.data.home_country.verified_at).toBe('2025-06-01T10:00:00Z');
  });

  it('returns immigration document info in data object', async () => {
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_VERIFICATION,
      immigration_status: 'approved',
      immigration_document_type: 'green_card',
      immigration_country: 'US',
    });
    const req = makeGetRequest('http://localhost/api/didit/check-status?applicationId=app_456');
    const res = await checkStatusGet(req);
    const json = await res.json();
    expect(json.data.immigration.document_type).toBe('green_card');
    expect(json.data.immigration.country).toBe('US');
  });
});

describe('POST /api/didit/webhook', () => {
  beforeEach(resetMocks);

  function makeWebhookRequest(body: object): NextRequest {
    return new NextRequest('http://localhost/api/didit/webhook', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': 'valid_sig',
        'X-Timestamp': '1234567890',
      },
    });
  }

  // ── Signature / parsing ──────────────────────────────────────────────────────

  it('returns 400 when JSON body is invalid', async () => {
    const req = new NextRequest('http://localhost/api/didit/webhook', {
      method: 'POST',
      body: 'not-json',
      headers: { 'X-Signature': 'sig', 'X-Timestamp': '123' },
    });
    const res = await webhookPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when vendor_data cannot be parsed', async () => {
    mockParseVendorData.mockReturnValueOnce({ applicationId: null, verificationType: null });
    const req = makeWebhookRequest({ ...BASE_WEBHOOK_PAYLOAD, vendor_data: 'bad' });
    const res = await webhookPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when verification record not found', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(null);
    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    const res = await webhookPost(req);
    expect(res.status).toBe(404);
  });

  // ── home_country approved ────────────────────────────────────────────────────

  it('updates home_country_status to approved with document data', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('not_started');
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)     // applicationQueryBuilder.update (stages)
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, home_country_status: 'approved', user_id: 'user_123' });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    const res = await webhookPost(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'verif_001',
      expect.objectContaining({
        home_country_status: 'approved',
        home_country_document_type: 'passport',
        home_country_document_number: 'A12345678',
      })
    );
  });

  it('updates application stages_completed when home_country approved', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('not_started');
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, user_id: 'user_123' });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    await webhookPost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({
        stages_completed: expect.objectContaining({
          identity_verification: expect.objectContaining({ status: 'current' }),
        }),
      })
    );
  });

  // ── immigration approved ─────────────────────────────────────────────────────

  it('updates immigration_status to approved', async () => {
    mockParseVendorData.mockReturnValueOnce({ applicationId: 'app_456', verificationType: 'immigration' });
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('not_started');
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, immigration_status: 'approved', user_id: 'user_123' });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    const res = await webhookPost(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'verif_001',
      expect.objectContaining({ immigration_status: 'approved' })
    );
  });

  // ── Both approved — stage transition ─────────────────────────────────────────

  it('advances stage to property_selection when both verifications are approved', async () => {
    // home_country was already approved, now immigration completes → overall = approved
    mockParseVendorData.mockReturnValueOnce({ applicationId: 'app_456', verificationType: 'immigration' });
    mockFindOneByCondition.mockResolvedValueOnce({ ...MOCK_VERIFICATION, home_country_status: 'approved' });
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('approved');

    // Call order:
    // 1. findById → immigration approved block (stages update)
    // 2. update(app_456, {stages_completed immigration data}) → immigration stages
    // 3. update(verif_001, updateData) → main verification update → returns overall approved
    // 4. findById → userQueryBuilder.findById(user_id)
    // 5. findById → overall approved block
    // 6. update(app_456, {identity_verification_status, current_stage...})
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);  // #1 immigration stages
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)             // #2 immigration stages update
      .mockResolvedValueOnce({                             // #3 verification update
        ...MOCK_VERIFICATION,
        immigration_status: 'approved',
        overall_status: 'approved',
        user_id: 'user_123',
      })
      .mockResolvedValueOnce(MOCK_APPLICATION);            // #6 overall approved update
    mockFindById
      .mockResolvedValueOnce(MOCK_USER)                    // #4 get user
      .mockResolvedValueOnce(MOCK_APPLICATION);            // #5 overall approved findById

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    await webhookPost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({
        identity_verification_status: 'approved',
        current_stage: 'property_selection',
        current_step: 6,
        stages_completed: expect.objectContaining({
          identity_verification: expect.objectContaining({
            completed: true,
            status: 'completed',
          }),
        }),
      })
    );
  });

  it('sends success email when overall_status becomes approved', async () => {
    mockParseVendorData.mockReturnValueOnce({ applicationId: 'app_456', verificationType: 'immigration' });
    mockFindOneByCondition.mockResolvedValueOnce({ ...MOCK_VERIFICATION, home_country_status: 'approved' });
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('approved');
    // findById order: immigration-stages, user, overall-approved
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)  // immigration stages block
      .mockResolvedValueOnce(MOCK_USER)          // userQueryBuilder.findById
      .mockResolvedValueOnce(MOCK_APPLICATION);  // overall approved block
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)   // immigration stages update
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, overall_status: 'approved', user_id: 'user_123' })
      .mockResolvedValueOnce(MOCK_APPLICATION);  // overall approved update

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    await webhookPost(req);

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Identity Verification Complete - Kletch' })
    );
  });

  // ── Declined ──────────────────────────────────────────────────────────────────

  it('sets identity_verification_status to failed when declined', async () => {
    // Declined call order:
    // 1. update(verif_001, updateData) → main verification update
    // 2. userQueryBuilder.findById → get user
    // 3. findById(applicationId) → inside declined block
    // 4. update(app_456, {identity_verification_status:'failed'...})
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    mockMapDiditStatus.mockReturnValueOnce('declined');
    mockCalculateOverallStatus.mockReturnValueOnce('failed');
    mockUpdate
      .mockResolvedValueOnce({                              // #1 verification update
        ...MOCK_VERIFICATION,
        home_country_status: 'declined',
        user_id: 'user_123',
      })
      .mockResolvedValueOnce(MOCK_APPLICATION);             // #4 application declined update
    mockFindById
      .mockResolvedValueOnce(MOCK_USER)                     // #2 get user
      .mockResolvedValueOnce(MOCK_APPLICATION);             // #3 declined block findById

    const req = makeWebhookRequest({ ...BASE_WEBHOOK_PAYLOAD, status: 'declined' });
    await webhookPost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({ identity_verification_status: 'failed' })
    );
  });

  it('sends failure email when verification is declined', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    mockMapDiditStatus.mockReturnValueOnce('declined');
    mockCalculateOverallStatus.mockReturnValueOnce('failed');
    mockUpdate
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, home_country_status: 'declined', user_id: 'user_123' })
      .mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindById
      .mockResolvedValueOnce(MOCK_USER)          // userQueryBuilder.findById
      .mockResolvedValueOnce(MOCK_APPLICATION);  // declined block findById

    const req = makeWebhookRequest({ ...BASE_WEBHOOK_PAYLOAD, status: 'declined' });
    await webhookPost(req);

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Identity Verification - Action Required' })
    );
  });

  it('does not crash when sendEmail throws', async () => {
    mockParseVendorData.mockReturnValueOnce({ applicationId: 'app_456', verificationType: 'immigration' });
    mockFindOneByCondition.mockResolvedValueOnce({ ...MOCK_VERIFICATION, home_country_status: 'approved' });
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('approved');
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)  // immigration stages block
      .mockResolvedValueOnce(MOCK_USER)          // userQueryBuilder.findById
      .mockResolvedValueOnce(MOCK_APPLICATION);  // overall approved block
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, overall_status: 'approved', user_id: 'user_123' })
      .mockResolvedValueOnce(MOCK_APPLICATION);
    mockSendEmail.mockRejectedValueOnce(new Error('SMTP error'));

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    const res = await webhookPost(req);
    expect(res.status).toBe(200);
  });

  it('returns 200 with processed status on success', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_VERIFICATION);
    mockMapDiditStatus.mockReturnValueOnce('in_progress');
    mockCalculateOverallStatus.mockReturnValueOnce('not_started');
    mockUpdate.mockResolvedValueOnce({ ...MOCK_VERIFICATION, user_id: 'user_123' });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeWebhookRequest({ ...BASE_WEBHOOK_PAYLOAD, status: 'pending' });
    const res = await webhookPost(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe('Webhook processed successfully');
  });

  // ── Architectural note ────────────────────────────────────────────────────────

  it('ARCH NOTE: webhook handles full stage transition — client onUpdate is redundant', async () => {
    mockParseVendorData.mockReturnValueOnce({ applicationId: 'app_456', verificationType: 'immigration' });
    mockFindOneByCondition.mockResolvedValueOnce({ ...MOCK_VERIFICATION, home_country_status: 'approved' });
    mockMapDiditStatus.mockReturnValueOnce('approved');
    mockCalculateOverallStatus.mockReturnValueOnce('approved');
    // Correct findById order: immigration-stages, user, overall-approved
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)  // immigration approved stages block
      .mockResolvedValueOnce(MOCK_USER)          // userQueryBuilder.findById
      .mockResolvedValueOnce(MOCK_APPLICATION);  // overall approved findById
    mockUpdate
      .mockResolvedValueOnce(MOCK_APPLICATION)   // immigration stages update
      .mockResolvedValueOnce({ ...MOCK_VERIFICATION, overall_status: 'approved', user_id: 'user_123' })
      .mockResolvedValueOnce(MOCK_APPLICATION);  // overall approved update

    const req = makeWebhookRequest(BASE_WEBHOOK_PAYLOAD);
    await webhookPost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({
        current_stage: 'property_selection',
        stages_completed: expect.objectContaining({
          identity_verification: expect.objectContaining({ completed: true, status: 'completed' }),
          property_selection: expect.objectContaining({ status: 'current' }),
        }),
      })
    );
  });
});

