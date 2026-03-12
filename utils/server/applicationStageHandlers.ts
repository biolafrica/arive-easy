import { ApplicationBase } from '@/type/pages/dashboard/application';
import { OfferBase } from '@/type/pages/dashboard/offer';
import { PropertyBase } from '@/type/pages/property';
import { UserBase } from '@/type/user';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { sendEmail } from './sendEmail';
import { createNotification } from '../notifications/createNotification';
import { buildNotificationPayload } from '../notifications/notificationContent';
import { NotificationMetadata, NotificationType } from '@/type/pages/dashboard/notification';
import { offerNotificationBody } from '../email/templates/application';
import { AdminEscrowNotification, mortgageActivationEmail, paymentCompletionEmail, propertyAcquiredEmail, termsCompletionEmail } from '../email/templates/milestones';
import { TransactionBase } from '@/type/pages/dashboard/transactions';

interface StageHandler {
  shouldExecute(application: ApplicationBase): boolean;
  execute(application: ApplicationBase, context: StageHandlerContext): Promise<void>;
}

interface StageHandlerContext {
  propertyQB: SupabaseQueryBuilder<PropertyBase>;
  offerQB: SupabaseQueryBuilder<OfferBase>;
  userQB: SupabaseQueryBuilder<UserBase>;
}

async function notifyUser(params: {
  userId: string;
  email: string;
  userName: string;
  emailSubject: string;
  emailHtml: string;
  notificationType: NotificationType;
  notificationMetadata: NotificationMetadata;
}) {
  const {
    userId,
    email,
    userName,
    emailSubject,
    emailHtml,
    notificationType,
    notificationMetadata
  } = params;

  try {
    await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });

    await createNotification(
      buildNotificationPayload(notificationType, {
        user_id: userId,
        type: notificationType,
        channel: 'in_app',
        metadata: notificationMetadata,
      })
    );
  } catch (error) {
    console.error(`Failed to notify user ${userId}:`, error);
  }
}

class PropertySelectionHandler implements StageHandler {
  shouldExecute(app: ApplicationBase): boolean {
    return (
      app.stages_completed?.property_selection?.data?.status === 'sent' &&
      !!app.property_id
    );
  }

  async execute(app: ApplicationBase, context: StageHandlerContext): Promise<void> {
    const { propertyQB, offerQB, userQB } = context;
    const propertyData = app.stages_completed?.property_selection?.data;

    const property = await propertyQB.findById(app.property_id!);
    if (!property) {
      throw new Error(`Property ${app.property_id} not found`);
    }

    const existingOffer = await offerQB.findOneByCondition({
      application_id: app.id,
      property_id: app.property_id
    });

    if (existingOffer) {
      await offerQB.update(existingOffer.id, {
        status: 'pending',
        rejection_note: '',
        updated_at: new Date().toISOString()
      });
    } else {
      const offerData: Partial<OfferBase> = {
        user_id: app.user_id,
        application_id: app.id,
        property_id: app.property_id,
        property_name: propertyData.property_name || property.title,
        amount: String(app.property_price || property.price),
        status: 'pending',
        type: propertyData.type || 'mortgage',
        developer_id: property.developer_id || '',
        created_at: new Date().toISOString(),
      };

      await offerQB.create(offerData);
      
      await this.updatePropertyOffers(property.id);
    }

    await this.notifySeller(property, app, userQB);
  }

  private async updatePropertyOffers(propertyId: string): Promise<void> {
    const propertyQB = new SupabaseQueryBuilder<PropertyBase>('properties');
    const property = await propertyQB.findById(propertyId);
    await propertyQB.update(propertyId, {
      offers: (property.offers || 0) + 1
    });
  }

  private async notifySeller(
    property: PropertyBase,
    app: ApplicationBase,
    userQB: SupabaseQueryBuilder<UserBase>
  ): Promise<void> {
    if (!property.developer_id) return;

    const seller = await userQB.findById(property.developer_id);
    if (!seller?.email) return;

    await notifyUser({
      userId: seller.id,
      email: seller.email,
      userName: seller.name,
      emailSubject: `Offer for ${property.title}`,
      emailHtml: offerNotificationBody({
        sellerName: seller.name,
        propertyId: property.id,
        propertyName: property.title,
        offerAmount: property.price,
      }),
      notificationType: 'offer_received',
      notificationMetadata: {
        reference_number: app.application_number,
        application_id: app.id,
        property_id: app.property_id,
        cta_url: '/seller-dashboard/offers',
        property_name: app.property_name
      }
    });
  }
}

class MortgageActivationHandler implements StageHandler {
  shouldExecute(app: ApplicationBase): boolean {
    const stage = app.stages_completed?.mortgage_activation;
    return stage?.completed === true && stage?.status === 'completed';
  }

  async execute(app: ApplicationBase, context: StageHandlerContext): Promise<void> {
    const { propertyQB, userQB } = context;

    const transactionQB = new SupabaseQueryBuilder<TransactionBase>('transactions');

    const [user, seller,escrowTransaction] = await Promise.all([
      userQB.findById(app.user_id),
      app.developer_id ? userQB.findById(app.developer_id) : null,
      this.getEscrowTransaction(app.id, transactionQB)
    ]);

    if (!user) {
      throw new Error(`User ${app.user_id} not found`);
    }

    if (app.property_id) {
      await propertyQB.update(app.property_id, { status: 'sold' });
    }

    if (escrowTransaction) {
      await this.releaseEscrowFunds(escrowTransaction, transactionQB);
    } else {
      console.warn(`No escrow transaction found for application ${app.id}`);
    }

    await this.notifyBuyer(user, app);

    if (seller) {
      await this.notifySeller(seller, user, app);
    }

    if (escrowTransaction && seller) {
      await this.notifyAdminForFundRelease(app, escrowTransaction, seller, user);
    }
  }

  private async notifyBuyer(user: UserBase, app: ApplicationBase): Promise<void> {
    await notifyUser({
      userId: user.id,
      email: user.email,
      userName: user.name,
      emailSubject: 'Congratulations! You\'re Now a Property Owner!',
      emailHtml: mortgageActivationEmail({
        userName: user.name,
        propertyName: app.property_name,
        mortgageAmount: `${app.approved_loan_amount}`,
        totalLoanTerm: app.loan_term_months,
        applicationNumber: app.application_number,
        monthlyPayment: `${app.monthly_payment}`,
        firstPaymentDate: app.first_payment_date
      }),
      notificationType: 'mortgage_activated',
      notificationMetadata: {
        application_id: app.id,
        property_id: app.property_id,
        due_date: app.first_payment_date,
        cta_url: 'https://usekletch.com/user-dashboard/properties',
        property_name: app.property_name
      }
    });
  }

  private async notifySeller(
    seller: UserBase,
    buyer: UserBase,
    app: ApplicationBase
  ): Promise<void> {
    await notifyUser({
      userId: seller.id,
      email: seller.email,
      userName: seller.name,
      emailSubject: 'Congratulations! Your Property Has Been Sold',
      emailHtml: propertyAcquiredEmail({
        sellerName: seller.name,
        propertyName: app.property_name,
        propertyId: app.property_id,
        buyerName: buyer.name,
        saleAmount: `${app.property_price}`,
        applicationNumber: app.application_number,
      }),
      notificationType: 'property_acquired',
      notificationMetadata: {
        application_id: app.id,
        property_id: app.property_id,
        cta_url: `https://usekletch.com/seller-dashboard/listings/${app.property_id}`,
        property_name: app.property_name
      }
    });
  }

  private async getEscrowTransaction(
    applicationId: string,
    transactionQB: SupabaseQueryBuilder<TransactionBase>
  ): Promise<TransactionBase | null> {
    return await transactionQB.findOneByCondition({
      application_id: applicationId,
      type: 'escrow_down_payment',
      status: 'succeeded'
    });
  }

  private async releaseEscrowFunds(
    transaction: TransactionBase,
    transactionQB: SupabaseQueryBuilder<TransactionBase>
  ): Promise<void> {
    try {
      await transactionQB.update(transaction.id, {
        status: 'released',
        state: 'released',
        metadata: {
          ...transaction.metadata,
          escrow_status: 'released',
          session_url:transaction.metadata?.session_url || null,
          expires_at: transaction.metadata?.expires_at || '',
          initiated_at:new Date().toISOString()
        }
      });

      console.log(`Escrow funds released for transaction ${transaction.id}`);
    } catch (error) {
      console.error('Failed to release escrow funds:', error);
      throw error;
    }
  }

  private async notifyAdminForFundRelease(
    app: ApplicationBase,
    escrowTransaction: TransactionBase,
    seller: UserBase,
    buyer: UserBase
  ): Promise<void> {
    const escrowAmount = (escrowTransaction.amount / 100).toFixed(2);

    try {
      await sendEmail({
        to: 'muhammedolaleye@gmail.com',
        subject: `Action Required: Release Escrow Funds - Application ${app.application_number}`,
        html: AdminEscrowNotification({
          applicationNumber: app.application_number,
          propertyName: app.property_name,
          amount: escrowAmount,
          sellerName: seller.name,
          sellerEmail: seller.email,
          sellerID: seller.id,
          buyerName: buyer.name,
          transactionID: escrowTransaction.id,
        }),
      });

      console.log(`Admin notification sent for escrow release: ${escrowTransaction.id}`);
    } catch (error) {
      console.error('Failed to notify admin for fund release:', error);
    }
  }
}


class PaymentSetupHandler implements StageHandler {
  shouldExecute(app: ApplicationBase): boolean {
    const stage = app.stages_completed?.payment_setup;
    return stage?.completed === true && stage?.status === 'completed';
  }

  async execute(app: ApplicationBase, context: StageHandlerContext): Promise<void> {
    const { userQB } = context;

    const user = await userQB.findById(app.user_id);
    if (!user) {
      throw new Error(`User ${app.user_id} not found`);
    }

    const paymentBreakdown = this.calculatePaymentBreakdown(app);

    await notifyUser({
      userId: user.id,
      email: user.email,
      userName: user.name,
      emailSubject: 'Payments Complete, Your Property is Secured!',
      emailHtml: paymentCompletionEmail({
        userName: user.name,
        propertyName: app.property_name,
        totalPaid: paymentBreakdown.total,
        paymentBreakdown: {
          escrow: paymentBreakdown.escrow,
          legal: paymentBreakdown.legal,
          valuation: paymentBreakdown.valuation
        }
      }),
      notificationType: 'payment_stage_completed',
      notificationMetadata: {
        application_id: app.id,
        property_id: app.property_id,
        application_number: app.application_number,
        cta_url: 'https://usekletch.com/user-dashboard/applications',
      }
    });
  }

  private calculatePaymentBreakdown(app: ApplicationBase) {
    const escrow = app.stages_completed?.terms_agreement?.data?.down_payment_amount || 0;
    const legal = app.stages_completed?.payment_setup?.data?.legal_fee_amount || 0;
    const valuation = app.stages_completed?.payment_setup?.data?.valuation_fee_amount || 0;
    
    return {
      escrow,
      legal,
      valuation,
      total: escrow + legal + valuation
    };
  }
}

class TermsAgreementHandler implements StageHandler {
  shouldExecute(app: ApplicationBase): boolean {
    const stage = app.stages_completed?.terms_agreement;
    return stage?.completed === true && stage?.status === 'completed';
  }

  async execute(app: ApplicationBase, context: StageHandlerContext): Promise<void> {
    const { userQB } = context;

    const user = await userQB.findById(app.user_id);
    if (!user) {
      throw new Error(`User ${app.user_id} not found`);
    }

    await notifyUser({
      userId: user.id,
      email: user.email,
      userName: user.name,
      emailSubject: 'Legal Documentation Complete, Next Step: Secure Your Property',
      emailHtml: termsCompletionEmail({
        userName: user.name,
        propertyName: app.property_name,
        applicationNumber: app.id,
      }),
      notificationType: 'terms_stage_completed',
      notificationMetadata: {
        application_id: app.id,
        property_id: app.property_id,
        application_number: app.application_number,
        cta_url: 'https://usekletch.com/user-dashboard/applications',
      }
    });
  }
}

const STAGE_HANDLERS: StageHandler[] = [
  new PropertySelectionHandler(),
  new MortgageActivationHandler(),
  new PaymentSetupHandler(),
  new TermsAgreementHandler(),
];

export async function executeStageHandlers(
  application: ApplicationBase,
  context: StageHandlerContext
): Promise<void> {
  const errors: Error[] = [];

  for (const handler of STAGE_HANDLERS) {
    if (handler.shouldExecute(application)) {
      try {
        await handler.execute(application, context);
      } catch (error) {
        console.error(`Stage handler failed for ${handler.constructor.name}:`, error);
        errors.push(error as Error);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`${errors.length} stage handler(s) failed`);
  }
}