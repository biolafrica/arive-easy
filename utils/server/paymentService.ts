import Stripe from 'stripe';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { TransactionBase } from '@/type/pages/dashboard/transactions';
import { PropertyBase } from '@/type/pages/property';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export type PaymentType = | 'processing_fee' | 'legal_fee' | 'valuation_fee'  | 'escrow_down_payment';

export interface PaymentConfig {
  name: string;
  description: string;
  minAmount?: number;
  fixedAmount?: number;
  requiresSeller?: boolean;
  requiresProperty?: boolean;
}

export interface CreatePaymentParams {
  userId: string;
  userEmail: string;
  userName: string;
  applicationId: string;
  paymentType: PaymentType;
  amount?: number; // Optional for fixed-amount payments
  sellerId?: string;
  propertyId?: string;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  url?: string| null;
  sessionId?: string;
  error?: string;
  details?: string;
}

const PAYMENT_CONFIGS: Record<PaymentType, PaymentConfig> = {
  processing_fee: {
    name: 'Application Processing Fee',
    description: 'One-time processing fee for application verification',
    fixedAmount: 100, // $100
  },
  legal_fee: {
    name: 'Legal Processing Fee',
    description: 'Legal documentation and processing fee for property purchase',
    minAmount: 1,
  },
  valuation_fee: {
    name: 'Property Valuation Fee',
    description: 'Professional property valuation and assessment fee',
    minAmount: 1,
  },
  escrow_down_payment: {
    name: 'Down Payment - Escrow',
    description: 'Secure escrow payment for property purchase',
    minAmount: 10, // $1000
    requiresSeller: true,
    requiresProperty: true,
  },
};

export class PaymentService {
  private transactionQB: SupabaseQueryBuilder<TransactionBase>;
  private propertyQB: SupabaseQueryBuilder<PropertyBase>;

  constructor() {
    this.transactionQB = new SupabaseQueryBuilder<TransactionBase>('transactions');
    this.propertyQB = new SupabaseQueryBuilder<PropertyBase>('properties');
  }

  async createPaymentSession(params: CreatePaymentParams): Promise<PaymentResult> {
    const {
      userId, userEmail, userName, applicationId,
      paymentType, amount, sellerId, propertyId, description,
    } = params;

    try {
      const config = PAYMENT_CONFIGS[paymentType];
      if (!config) {
        return {
          success: false,
          error: 'Invalid payment type',
        };
      }

      const validation = this.validatePaymentParams(params, config);
      if (!validation.success) {
        return validation;
      }

      const finalAmount = config.fixedAmount || amount!;

      const existingCheck = await this.checkExistingPayment(
        applicationId,
        userId,
        paymentType
      );
      if (!existingCheck.success) {
        return existingCheck;
      }

      let property: PropertyBase | null = null;
      if (propertyId) {
        property = await this.propertyQB.findById(propertyId);
        if (!property) {
          console.warn(`Property ${propertyId} not found`);
        }
      }

      const session = await this.createStripeSession({
        config,
        finalAmount,
        description,
        userEmail,
        userId,
        applicationId,
        paymentType,
        sellerId,
        propertyId,
        property,
      });

      await this.createTransactionRecord({
        userId,
        userName,
        applicationId,
        sessionId: session.id,
        amount: finalAmount,
        paymentType,
        sessionUrl: session.url!,
        expiresAt: session.expires_at,
        sellerId,
        propertyId,
        propertyName: property?.title,
      });

      return {
        success: true,
        url: session.url!,
        sessionId: session.id,
      };

    } catch (error) {
      console.error(`Payment session creation error (${paymentType}):`, error);
      return {
        success: false,
        error: 'Failed to create payment session',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private validatePaymentParams(
    params: CreatePaymentParams,
    config: PaymentConfig
  ): PaymentResult {
    const { amount, sellerId, propertyId } = params;

    if (!config.fixedAmount && !amount) {
      return {
        success: false,
        error: 'Amount is required',
      };
    }

    if (config.minAmount && amount && amount < config.minAmount) {
      return {
        success: false,
        error: `Minimum amount is $${config.minAmount}`,
      };
    }

    if (config.requiresSeller && !sellerId) {
      return {
        success: false,
        error: 'Seller ID is required for this payment type',
      };
    }

    if (config.requiresProperty && !propertyId) {
      return {
        success: false,
        error: 'Property ID is required for this payment type',
      };
    }

    return { success: true };
  }

  private async checkExistingPayment(
    applicationId: string,
    userId: string,
    paymentType: PaymentType
  ): Promise<PaymentResult> {
    const successfulTransaction = await this.transactionQB.findOneByCondition({
      application_id: applicationId,
      user_id: userId,
      type: paymentType,
      status: 'succeeded',
    });

    if (successfulTransaction) {
      return {
        success: false,
        error: `Payment already completed for this ${paymentType.replace('_', ' ')}`,
      };
    }

    const pendingTransaction = await this.transactionQB.findOneByCondition({
      application_id: applicationId,
      user_id: userId,
      type: paymentType,
      status: 'pending',
    });

    if (pendingTransaction) {
      const expiresAt = pendingTransaction.metadata?.expires_at;
      if (expiresAt && new Date(expiresAt) > new Date()) {
        return {
          success: true,
          url: pendingTransaction.metadata?.session_url,
          sessionId: pendingTransaction.stripe_session_id,
        };
      }
      
      await this.transactionQB.update(pendingTransaction.id, {
        status: 'expired',
      });
    }

    return { success: true };
  }

  private async createStripeSession(params: {
    config: PaymentConfig;
    finalAmount: number;
    description?: string;
    userEmail: string;
    userId: string;
    applicationId: string;
    paymentType: PaymentType;
    sellerId?: string;
    propertyId?: string;
    property?: PropertyBase | null;
  }): Promise<Stripe.Checkout.Session> {
    const { 
      config, finalAmount, description, userEmail, userId,
      applicationId, paymentType, sellerId, propertyId, property,
    } = params;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const metadata: Record<string, string> = {
      user_id: userId,
      application_id: applicationId,
      payment_type: paymentType,
      original_amount: finalAmount.toString(),
      user_email: userEmail,
    };

    if (sellerId) metadata.seller_id = sellerId;
    if (propertyId) metadata.property_id = propertyId;

    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: config.name,
              description: description || config.description,
              images: property?.images ,
            },
            unit_amount: finalAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/test/success?session_id={CHECKOUT_SESSION_ID}&type=${paymentType}`,
      cancel_url: `${baseUrl}/test/cancelled?type=${paymentType}`,
      metadata,
      customer_email: userEmail,
      payment_intent_data: {
        metadata: {
          ...metadata,
          fee_type: paymentType.replace('_fee', '').replace('escrow_', ''),
        },
      },
    });
  }

  private async createTransactionRecord(params: {
    userId: string;
    userName: string;
    applicationId: string;
    sessionId: string;
    amount: number;
    paymentType: PaymentType;
    sessionUrl: string;
    expiresAt: number;
    sellerId?: string;
    propertyId?: string;
    propertyName?: string;
  }): Promise<TransactionBase> {
    const { 
      userId, userName, applicationId, sessionId, amount,
      paymentType, sessionUrl, expiresAt, sellerId, propertyId, propertyName,
    } = params;

    return await this.transactionQB.create({
      user_id: userId,
      user_name: userName,
      application_id: applicationId,
      stripe_session_id: sessionId,
      amount: amount * 100,
      currency: 'usd',
      status: 'pending',
      type: paymentType,
      developer_id: sellerId,
      property_id: propertyId,
      property_name: propertyName,
      metadata: {
        session_url: sessionUrl,
        expires_at: new Date(expiresAt * 1000).toISOString(),
        payment_type: paymentType,
      },
    });
  }

  async getSessionStatus(sessionId: string): Promise<{
    status: string;
    paymentStatus: string;
  }> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.status || 'unknown',
      paymentStatus: session.payment_status,
    };
  }
}

export const paymentService = new PaymentService();