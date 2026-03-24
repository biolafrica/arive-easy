import { vi } from 'vitest';

vi.mock('@/utils/supabase/supabaseAdmin', () => ({
  supabaseAdmin: { from: vi.fn() },
}));

vi.mock('@/utils/supabase/queryBuilder', () => ({
  SupabaseQueryBuilder: vi.fn().mockImplementation(function () {
    return {
      findById: vi.fn(),
      findOneByCondition: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    };
  }),
}));

vi.mock('stripe', () => {
  const StripeMock = vi.fn().mockImplementation(function () {
    return {
      setupIntents: { create: vi.fn() },
      customers: { create: vi.fn(), update: vi.fn() },
      paymentMethods: { retrieve: vi.fn(), attach: vi.fn() },
      prices: { create: vi.fn() },
      subscriptions: { create: vi.fn() },
      webhooks: { constructEvent: vi.fn() },
      charges: { list: vi.fn() },
    };
  });
  StripeMock.prototype = {};
  return { default: StripeMock, __esModule: true };
});

vi.mock('@/utils/server/authMiddleware', () => ({
  requireAuth: vi.fn().mockResolvedValue({ id: 'user_test', email: 'test@test.com' }),
}));

vi.mock('@/utils/email/send_email', () => ({ sendEmail: vi.fn() }));