import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const {
  mockRequireAuth,
  mockFindById,
  mockFindOneByCondition,
  mockUpdate,
  mockCreate,
  mockStripeCustomersCreate,
  mockStripeSetupIntentsCreate,
  mockStripeSetupIntentsRetrieve,
  mockStripePaymentMethodsAttach,
  mockStripePaymentMethodsRetrieve,
  mockStripeCustomersUpdate,
  mockStripePricesCreate,
  mockStripeSubscriptionsCreate,
  mockSendEmail,
  mockSupabaseFrom,
  mockSupabaseInsert,
  mockSupabaseEq,
  mockSupabaseSelect,
} = vi.hoisted(() => {
  const mockSupabaseInsert = vi.fn().mockResolvedValue({ error: null });
  const mockSupabaseEq = vi.fn();
  const mockSupabaseSelect = vi.fn();
  const mockSupabaseFrom = vi.fn();

  const chainObj = {
    insert: mockSupabaseInsert,
    select: mockSupabaseSelect,
    eq: mockSupabaseEq,
  };

  mockSupabaseFrom.mockReturnValue(chainObj);
  mockSupabaseSelect.mockReturnValue(chainObj);
  mockSupabaseEq.mockReturnValue(chainObj);

  return {
    mockRequireAuth: vi.fn(),
    mockFindById: vi.fn(),
    mockFindOneByCondition: vi.fn(),
    mockUpdate: vi.fn(),
    mockCreate: vi.fn(),
    mockStripeCustomersCreate: vi.fn(),
    mockStripeSetupIntentsCreate: vi.fn(),
    mockStripeSetupIntentsRetrieve: vi.fn(),
    mockStripePaymentMethodsAttach: vi.fn(),
    mockStripePaymentMethodsRetrieve: vi.fn(),
    mockStripeCustomersUpdate: vi.fn(),
    mockStripePricesCreate: vi.fn(),
    mockStripeSubscriptionsCreate: vi.fn(),
    mockSendEmail: vi.fn().mockResolvedValue(undefined),
    mockSupabaseFrom,
    mockSupabaseInsert,
    mockSupabaseEq,
    mockSupabaseSelect,
  };
});


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

vi.mock('@/utils/supabase/supabaseAdmin', () => ({
  supabaseAdmin: { from: mockSupabaseFrom },
}));

vi.mock('stripe', () => {
  const StripeMock = vi.fn().mockImplementation(function () {
    return {
      customers: {
        create: mockStripeCustomersCreate,
        update: mockStripeCustomersUpdate,
      },
      setupIntents: {
        create: mockStripeSetupIntentsCreate,
        retrieve: mockStripeSetupIntentsRetrieve,
      },
      paymentMethods: {
        attach: mockStripePaymentMethodsAttach,
        retrieve: mockStripePaymentMethodsRetrieve,
      },
      prices: { create: mockStripePricesCreate },
      subscriptions: { create: mockStripeSubscriptionsCreate },
    };
  });
  StripeMock.prototype = {};
  return { default: StripeMock, __esModule: true };
});

vi.mock('@/utils/email/send_email', () => ({ sendEmail: mockSendEmail }));
vi.mock('@/utils/email/templates/direct-debit', () => ({
  getDirectDebitConfirmationEmailTemplate: vi.fn().mockReturnValue('<html>email</html>'),
}));
vi.mock('@/utils/notifications/createNotification', () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/utils/notifications/notificationContent', () => ({
  buildNotificationPayload: vi.fn().mockReturnValue({}),
}));
vi.mock('@/utils/common/generateApplicationRef', () => ({
  generateApplicationRefNo: vi.fn().mockReturnValue('MOR-2025-001'),
}));

import { POST as initiatePost } from '@/app/api/direct-debit/initiate/route';
import { POST as confirmPost } from '@/app/api/direct-debit/confirm/route';


const MOCK_USER = { id: 'user_123', email: 'emeka@example.com' };

const MOCK_APPLICATION = {
  id: 'app_456',
  user_id: 'user_123',
  property_id: 'prop_999',
  pre_approval_id: 'pre_001',
  application_number: 'APP-2025-001',
  monthly_payment: 1000,
  approved_loan_amount: 200000,
  property_price: 250000,
  down_payment_amount: 50000,
  interest_rate: 5.5,
  loan_term_months: 24,
  total_payment: 24000,
  first_payment_date: '2025-08-01',
  last_payment_date: '2027-07-01',
  payment_day_of_month: 1,
  developer_id: 'dev_111',
  stages_completed: { mortgage_activation: { data: {} } },
};

const MOCK_PRE_APPROVAL = {
  id: 'pre_001',
  personal_info: {
    email: 'emeka@example.com',
    first_name: 'Emeka',
    last_name: 'Okafor',
    residence_country: 'CA',
  },
};

const MOCK_USER_DB = {
  id: 'user_123',
  name: 'Emeka Okafor',
  email: 'emeka@example.com',
  stripe_customer_id: null, // no customer by default
};

const MOCK_MORTGAGE = {
  id: 'mortgage_123',
  application_id: 'app_456',
  user_id: 'user_123',
  stripe_customer_id: 'cus_test',
  stripe_setup_intent_id: 'seti_test',
  monthly_payment: 1000,
  total_payments: 24,
  number_of_payments: 24,
  first_payment_date: '2025-08-01',
  last_payment_date: '2027-07-01',
  payment_day_of_month: 1,
  stripe_subscription_id: null, // no subscription by default
};

const MOCK_SETUP_INTENT = {
  id: 'seti_new_123',
  client_secret: 'seti_new_123_secret',
  status: 'requires_payment_method',
  metadata: {},
};

const MOCK_STRIPE_CUSTOMER = {
  id: 'cus_new_123',
};

function makePostRequest(url: string, body: object): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const chainObj = {
  insert: mockSupabaseInsert,
  select: mockSupabaseSelect,
  eq: mockSupabaseEq,
};

function resetMocks() {
  vi.clearAllMocks();

  // Supabase chain
  mockSupabaseFrom.mockReturnValue(chainObj);
  mockSupabaseSelect.mockReturnValue(chainObj);
  mockSupabaseEq.mockReturnValue(chainObj);
  mockSupabaseInsert.mockResolvedValue({ error: null });

  // Auth
  mockRequireAuth.mockResolvedValue(MOCK_USER);

  // QB defaults — order matches how the route calls them
  mockFindOneByCondition.mockResolvedValue(null);
  mockFindById.mockResolvedValue(null);
  mockUpdate.mockResolvedValue(true);
  mockCreate.mockResolvedValue({ id: 'new_record_id' });

  // Stripe defaults
  mockStripeCustomersCreate.mockResolvedValue(MOCK_STRIPE_CUSTOMER);
  mockStripeCustomersUpdate.mockResolvedValue({});
  mockStripeSetupIntentsCreate.mockResolvedValue(MOCK_SETUP_INTENT);
  mockStripeSetupIntentsRetrieve.mockResolvedValue({
    id: 'seti_test',
    status: 'succeeded',
    payment_method: 'pm_test',
    metadata: { application_id: 'app_456' },
  });
  mockStripePaymentMethodsAttach.mockResolvedValue({});
  mockStripePaymentMethodsRetrieve.mockResolvedValue({
    id: 'pm_test',
    type: 'card',
    card: { brand: 'visa', last4: '4242' },
    us_bank_account: null,
    acss_debit: null,
  });
  mockStripePricesCreate.mockResolvedValue({ id: 'price_test' });
  mockStripeSubscriptionsCreate.mockResolvedValue({ id: 'sub_test' });

  // Email
  mockSendEmail.mockResolvedValue(undefined);
}

describe('POST /api/direct-debit/initiate', () => {
  beforeEach(resetMocks);


  it('returns 400 when application_id is missing', async () => {
    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { user_country: 'CA' }
    );
    const res = await initiatePost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Application ID is required');
  });

  it('returns 404 when application not found or belongs to different user', async () => {
    // findOneByCondition returns null (application not found for this user)
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    const res = await initiatePost(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toContain('Application not found');
  });

  it('returns 400 when monthly_payment is missing', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_APPLICATION,
      monthly_payment: null,
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    const res = await initiatePost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('not ready for payment setup');
  });

  it('returns 400 when approved_loan_amount is missing', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_APPLICATION,
      approved_loan_amount: null,
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    const res = await initiatePost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('not ready for payment setup');
  });

  it('returns 400 when direct debit is already set up (stripe_subscription_id exists)', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION); // application found
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      stripe_subscription_id: 'sub_existing', // already set up
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    const res = await initiatePost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('already set up');
  });


  it('uses acss_debit + card for user_country = CA', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null); // no existing mortgage
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    await initiatePost(req);

    expect(mockStripeSetupIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: expect.arrayContaining(['acss_debit', 'card']),
      })
    );
  });

  it('uses us_bank_account + card for user_country = US', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'US' }
    );
    await initiatePost(req);

    expect(mockStripeSetupIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: expect.arrayContaining(['us_bank_account', 'card']),
      })
    );
  });

  it('treats user_country = "canada" (lowercase) as Canadian', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'canada' }
    );
    await initiatePost(req);

    expect(mockStripeSetupIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: expect.arrayContaining(['acss_debit']),
      })
    );
  });

  it('treats user_country = "Canada" (capitalized) as Canadian', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'Canada' }
    );
    await initiatePost(req);

    expect(mockStripeSetupIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: expect.arrayContaining(['acss_debit']),
      })
    );
  });


  it('creates a new Stripe customer when user has no stripe_customer_id', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce({ ...MOCK_USER_DB, stripe_customer_id: null }) // no customer
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    await initiatePost(req);

    expect(mockStripeCustomersCreate).toHaveBeenCalledTimes(1);
    // Should save the new customer ID to the user record
    expect(mockUpdate).toHaveBeenCalledWith(
      'user_123',
      expect.objectContaining({ stripe_customer_id: MOCK_STRIPE_CUSTOMER.id })
    );
  });

  it('reuses existing stripe_customer_id without creating a new customer', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce({ ...MOCK_USER_DB, stripe_customer_id: 'cus_existing' }) // has customer
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    await initiatePost(req);

    expect(mockStripeCustomersCreate).not.toHaveBeenCalled();
  });


  it('creates a new mortgage record when none exists', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null); // no existing mortgage
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
    mockCreate.mockResolvedValueOnce({ id: 'new_mortgage_id' });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    await initiatePost(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        application_id: 'app_456',
        status: 'pending_payment_method',
      })
    );
  });

  it('updates existing mortgage record when one already exists (no subscription)', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      stripe_subscription_id: null, // no subscription — can update
    });
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    await initiatePost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ stripe_setup_intent_id: MOCK_SETUP_INTENT.id })
    );
    expect(mockCreate).not.toHaveBeenCalledWith(
      expect.objectContaining({ application_id: 'app_456', status: 'pending_payment_method' })
    );
  });

  it('returns 500 when mortgage create returns null', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
    mockCreate.mockResolvedValueOnce(null); // create fails

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    const res = await initiatePost(req);

    expect(res.status).toBe(500);
  });


  it('returns client_secret, setup_intent_id, mortgage_id, and customer_id', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_APPLICATION);
    mockFindOneByCondition.mockResolvedValueOnce(null);
    mockFindById
      .mockResolvedValueOnce(MOCK_USER_DB)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
    mockCreate.mockResolvedValueOnce({ id: 'new_mortgage_id' });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/initiate',
      { application_id: 'app_456', user_country: 'CA' }
    );
    const res = await initiatePost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.client_secret).toBe(MOCK_SETUP_INTENT.client_secret);
    expect(json.setup_intent_id).toBe(MOCK_SETUP_INTENT.id);
    expect(json.mortgage_id).toBe('new_mortgage_id');
    expect(json.customer_id).toBeDefined();
  });
});

describe('POST /api/direct-debit/confirm', () => {
  beforeEach(resetMocks);

  it('returns 400 when application_id is missing', async () => {
    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      { setup_intent_id: 'seti_test', payment_method_id: 'pm_test' }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Missing required fields');
  });

  it('returns 400 when setup_intent_id is missing', async () => {
    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      { application_id: 'app_456', payment_method_id: 'pm_test' }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Missing required fields');
  });

  it('returns 400 when payment_method_id is missing', async () => {
    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      { application_id: 'app_456', setup_intent_id: 'seti_test' }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Missing required fields');
  });

  it('returns 400 when SetupIntent status is requires_payment_method', async () => {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test',
      status: 'requires_payment_method', // not succeeded/processing
      payment_method: null,
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('requires_payment_method');
  });

  it('returns 404 when mortgage record not found', async () => {
    // SetupIntent succeeded
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test',
      status: 'succeeded',
      payment_method: 'pm_test',
    });
    // mortgage not found
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toContain('Mortgage record not found');
  });

  it('returns 404 when application not found', async () => {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test',
      status: 'succeeded',
      payment_method: 'pm_test',
    });
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE); // mortgage found
    mockFindById.mockResolvedValueOnce(null); // application not found

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toContain('Application not found');
  });

  it('formats us_bank_account display correctly', async () => {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test', status: 'succeeded', payment_method: 'pm_bank',
    });
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
    mockStripePaymentMethodsRetrieve.mockResolvedValueOnce({
      id: 'pm_bank',
      type: 'us_bank_account',
      us_bank_account: { bank_name: 'Chase', last4: '6789' },
      acss_debit: null,
      card: null,
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_bank',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({
        payment_method_display: expect.stringContaining('Chase'),
      })
    );
  });

  it('formats acss_debit display correctly', async () => {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test', status: 'succeeded', payment_method: 'pm_acss',
    });
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
    mockStripePaymentMethodsRetrieve.mockResolvedValueOnce({
      id: 'pm_acss',
      type: 'acss_debit',
      acss_debit: { bank_name: 'TD Bank', last4: '1234' },
      us_bank_account: null,
      card: null,
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_acss',
      }
    );
    const res = await confirmPost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({
        payment_method_display: expect.stringContaining('TD Bank'),
      })
    );
  });

  it('formats card display correctly', async () => {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test', status: 'succeeded', payment_method: 'pm_card',
    });
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
    mockStripePaymentMethodsRetrieve.mockResolvedValueOnce({
      id: 'pm_card',
      type: 'card',
      card: { brand: 'visa', last4: '4242' },
      us_bank_account: null,
      acss_debit: null,
    });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_card',
      }
    );
    await confirmPost(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({
        payment_method_display: expect.stringContaining('VISA'),
      })
    );
  });


  function setupConfirmHappyPath(setupIntentStatus: 'succeeded' | 'processing') {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test',
      status: setupIntentStatus,
      payment_method: 'pm_test',
    });
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);
  }

  it('sets direct_debit_status to active when SetupIntent is succeeded', async () => {
    setupConfirmHappyPath('succeeded');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('active');
    expect(json.is_pending_verification).toBe(false);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'active' })
    );
  });

  it('sets direct_debit_status to pending_verification when SetupIntent is processing', async () => {
    setupConfirmHappyPath('processing');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('pending_verification');
    expect(json.is_pending_verification).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'pending_verification' })
    );
  });


  it('creates correct number of payments derived from dates (not dollar amount)', async () => {
    setupConfirmHappyPath('succeeded');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    await confirmPost(req);

    // supabaseAdmin.from('mortgage_payments').insert(batch) should be called
    // with 24 payments total (may be split into batches of 50)
    const insertCalls = mockSupabaseInsert.mock.calls;
    const totalPayments = insertCalls.reduce(
      (sum, call) => sum + (call[0]?.length || 0), 0
    );
    expect(totalPayments).toBe(24);
  });

  it('sets all payment statuses to scheduled', async () => {
    setupConfirmHappyPath('succeeded');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    await confirmPost(req);

    const insertCalls = mockSupabaseInsert.mock.calls;
    const allPayments = insertCalls.flatMap((call) => call[0] || []);
    expect(allPayments.every((p: any) => p.status === 'scheduled')).toBe(true);
  });

  it('payment due dates increment monthly from first_payment_date', async () => {
    setupConfirmHappyPath('succeeded');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    await confirmPost(req);

    const insertCalls = mockSupabaseInsert.mock.calls;
    const allPayments = insertCalls.flatMap((call) => call[0] || []);

    expect(allPayments[0].due_date).toBe('2025-08-01');
    expect(allPayments[1].due_date).toBe('2025-09-01');
    expect(allPayments[11].due_date).toBe('2026-07-01');
  });

  it('batches correctly when numberOfPayments > 50', async () => {
    mockStripeSetupIntentsRetrieve.mockResolvedValueOnce({
      id: 'seti_test', status: 'succeeded', payment_method: 'pm_test',
    });
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      first_payment_date: '2025-01-01',
      last_payment_date: '2030-12-01', // 72 months
      monthly_payment: 1000,
    });
    mockFindById
      .mockResolvedValueOnce({
        ...MOCK_APPLICATION,
        first_payment_date: '2025-01-01',
        last_payment_date: '2030-12-01',
      })
      .mockResolvedValueOnce(MOCK_PRE_APPROVAL);

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    await confirmPost(req);

    expect(mockSupabaseInsert.mock.calls.length).toBeGreaterThan(1);

    const totalPayments = mockSupabaseInsert.mock.calls.reduce(
      (sum, call) => sum + (call[0]?.length || 0), 0
    );
    expect(totalPayments).toBe(72);
  });

  it('does not crash when supabase insert returns an error on a batch', async () => {
    setupConfirmHappyPath('succeeded');
    mockSupabaseInsert.mockResolvedValueOnce({ error: { message: 'insert failed' } });

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);

    expect(res.status).toBe(200);
  });


  it('sends "Set Up Successfully" email when SetupIntent is succeeded', async () => {
    setupConfirmHappyPath('succeeded');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    await confirmPost(req);

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Set Up Successfully'),
      })
    );
  });

  it('sends "Bank Verification in Progress" email when SetupIntent is processing', async () => {
    setupConfirmHappyPath('processing');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    await confirmPost(req);

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Bank Verification in Progress'),
      })
    );
  });

  it('does not crash when sendEmail throws', async () => {
    setupConfirmHappyPath('succeeded');
    mockSendEmail.mockRejectedValueOnce(new Error('SMTP error'));

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);

    expect(res.status).toBe(200);
  });


  it('returns success, subscription_id, mortgage_id, status, and number_of_payments', async () => {
    setupConfirmHappyPath('succeeded');

    const req = makePostRequest(
      'http://localhost/api/direct-debit/confirm',
      {
        application_id: 'app_456',
        setup_intent_id: 'seti_test',
        payment_method_id: 'pm_test',
      }
    );
    const res = await confirmPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.subscription_id).toBe('sub_test');
    expect(json.mortgage_id).toBe('mortgage_123');
    expect(json.number_of_payments).toBe(24);
  });
});