import { ApplicationBase } from "@/type/pages/dashboard/application";
import { SupabaseQueryBuilder } from "../supabase/queryBuilder";
import { PropertyBase } from "@/type/pages/property";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { UserBase } from "@/type/user";
import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { sendEmail } from "../email/send_email";
import { AdminEscrowNotification, mortgageActivationEmail, paymentCompletionEmail, propertyAcquiredEmail, termsCompletionEmail } from "../email/templates/milestones";
import { createNotification } from "../notifications/createNotification";
import { buildNotificationPayload } from "../notifications/notificationContent";
import { sendOfferAcceptedEmail } from "../email/templates/offers";
import { identityVerificationSuccessBody } from "../email/templates/identity-verification";

export type StageType = 'identity' | 'property' | 'terms' | 'payment' | 'mortgage';

interface StageCompletionParams {
  application: ApplicationBase;
  stageType: StageType;
  stageData: any;
  userId: string;
}

interface StageCompletionResult {
  success: boolean;
  error?: string;
  message?: string;
  updatedApplication?: ApplicationBase;
}

export async function executeStageCompletion(
  params: StageCompletionParams
): Promise<StageCompletionResult> {
  const { application, stageType, stageData, userId } = params;

  try {
    const updatePayload = buildStageUpdatePayload(
      application.stages_completed,
      stageType,
      stageData
    );

    const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');
    const updatedApplication = await applicationQB.update(application.id, updatePayload);

    await executeStageHandler(stageType, updatedApplication);

    return {
      success: true,
      message: getSuccessMessage(stageType),
      updatedApplication,
    };

  } catch (error) {
    console.error(`Stage completion error (${stageType}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    
  }


}

function buildStageUpdatePayload(
  currentStages: ApplicationBase['stages_completed'],
  stageType: StageType,
  stageData: any
): Partial<ApplicationBase> {

  switch (stageType) {
    case 'identity':
      return {
        stages_completed: {
          ...currentStages,
          identity_verification: {
            ...currentStages.identity_verification,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed',
            error_message:"",
            data: {
              ...currentStages.identity_verification?.data,
              ...stageData,
              updated_at: new Date().toISOString(),
            },
          },
          property_selection: {
            status: 'current',
            completed: false,
          },
        },
        processing_fee_payment_status: 'paid',
        processing_fee_payment_date: new Date().toISOString(),
        kyc_verified_at: new Date().toISOString(),
        current_stage: 'property_selection',
        current_step: 6,
      };
    
    case 'property':
      return {
        stages_completed: {
          ...currentStages,
          property_selection: {
            ...currentStages.property_selection,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed',
            data: {
              ...currentStages.property_selection?.data,
              ...stageData,
              submitted_at: new Date().toISOString(),
            },
          },
          terms_agreement: {
            status: 'current',
            completed: false,
          },
        },
        current_stage: 'terms_agreement',
        current_step: 7,
      };

    case 'terms':
      return {
        stages_completed: {
          ...currentStages,
          terms_agreement: {
            ...currentStages.terms_agreement,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed',
            data: {
              ...currentStages.terms_agreement?.data,
              ...stageData,
            },
          },
          payment_setup: {
            status: 'current',
            completed: false,
            data: {
              ...currentStages.payment_setup?.data,
              terms_agreement_signed: true,
            },
          },
        },
        current_stage: 'payment_setup',
        current_step: 8,
      };

    case 'payment':
      return {
        stages_completed: {
          ...currentStages,
          payment_setup: {
            ...currentStages.payment_setup,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed',
            data: {
              ...currentStages.payment_setup?.data,
              ...stageData,
            },
          },
          mortgage_activation: {
            status: 'current',
            completed: false,
          },
        },
        current_stage: 'mortgage_activation',
        current_step: 9,
      };

    case 'mortgage':
      return {
        stages_completed: {
          ...currentStages,
          mortgage_activation: {
            ...currentStages.mortgage_activation,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed',
            data: {
              ...currentStages.mortgage_activation?.data,
              ...stageData,
              current_step: 'success',
              direct_debit_status: 'active',
              direct_debit_creation_date: new Date().toISOString(),
            },
          },
        },
        direct_debit_status: 'active',
        status: 'active',
        current_stage: 'mortgage_activation',
        current_step: 9,
      };
  
    default:
      throw new Error(`Unknown stage type: ${stageType}`);
  }
}

async function executeStageHandler(
  stageType: StageType,
  application: ApplicationBase
): Promise<void> {
  const propertyQB = new SupabaseQueryBuilder<PropertyBase>('properties');
  const offerQB = new SupabaseQueryBuilder<OfferBase>('offers');
  const userQB = new SupabaseQueryBuilder<UserBase>('users');
  const transactionQB = new SupabaseQueryBuilder<TransactionBase>('transactions');

  switch (stageType) {
    case 'property':
      await handlePropertySelection(application, { propertyQB, offerQB, userQB });
      break;

    case 'terms':
      await handleTermsAgreement(application, { userQB });
      break;

    case 'payment':
      await handlePaymentSetup(application, { userQB });
      break;

    case 'mortgage':
      await handleMortgageActivation(application, { propertyQB, userQB, transactionQB });
      break;

    case 'identity':
       await handleIdentityVerification(application, { userQB });
      break;

    default:
      console.log(`No handler for stage type: ${stageType}`);
      
  }

}

async function handlePropertySelection(
  app: ApplicationBase,
  context: {
    propertyQB: SupabaseQueryBuilder<PropertyBase>;
    offerQB: SupabaseQueryBuilder<OfferBase>;
    userQB: SupabaseQueryBuilder<UserBase>;
  }
): Promise<void> {
  const {offerQB, userQB } = context;

  const offer = await offerQB.findOneByCondition({
    application_id: app.id
  })
  if (!offer) {
    throw new Error(`User is yet to create any offer`);
  }

  const user = await userQB.findById(app.user_id);
  if (!user) {
    throw new Error(`User ${app.user_id} not found`);
  }

  if (user?.email) {
    try {
      await sendEmail({
        to:  `${user.email}`,
        subject: 'Property Offer Feedback',
        html: sendOfferAcceptedEmail({
          userName: user.name,
          applicationNumber: app.application_number,
          propertyName:app.property_name,
          offerAmount:offer.amount
        }),
      });
    } catch (error) {
      console.error('Failed to send offer accepted email:', error);
    }

    await createNotification(
      buildNotificationPayload('offer_accepted', {
        user_id:user.id,
        application_id: app.id,
        property_id:offer.property_id,
        type:'offer_accepted',
        channel: 'in_app',
        metadata: {
          reference_number: app.application_number,
          application_number: app.id,
          cta_url: `/user-dashboard/applications`,
          property_name:offer.property_name 
        },
      })
    );
  }
         
}

async function handleTermsAgreement(
  app: ApplicationBase,
  context: { userQB: SupabaseQueryBuilder<UserBase> }
): Promise<void> {
  const { userQB } = context;

  const user = await userQB.findById(app.user_id);
  if (!user) {
    throw new Error(`User ${app.user_id} not found`);
  }

  await sendEmail({
    to: user.email,
    subject: 'Legal Documentation Complete, Next Step: Secure Your Property',
    html: termsCompletionEmail({
      userName: user.name,
      propertyName: app.property_name,
      applicationNumber: app.id,
    }),
  });

  await createNotification(
    buildNotificationPayload('terms_stage_completed', {
      user_id: user.id,
      application_id: app.id,
      property_id: app.property_id,
      type: 'terms_stage_completed',
      channel: 'in_app',
      metadata: {
        application_number: app.application_number,
        cta_url: '/user-dashboard/applications',
      },
    })
  );

}

async function handleIdentityVerification(
  app: ApplicationBase,
  context: { userQB: SupabaseQueryBuilder<UserBase> }
): Promise<void> {
  const { userQB } = context;

  const user = await userQB.findById(app.user_id);
  if (!user) {
    throw new Error(`User ${app.user_id} not found`);
  }

  await sendEmail({
    to: user.email,
    subject: 'Identity Verification Complete, Next Step: Select Your Property',
    html: identityVerificationSuccessBody({
      userName: user.name,
      applicationId: app.id,
      verificationDate: new Date().toISOString(),
    }),
  });

  // add notification later

}

async function handlePaymentSetup(
  app: ApplicationBase,
  context: { userQB: SupabaseQueryBuilder<UserBase> }
): Promise<void> {
  const { userQB } = context;

  const user = await userQB.findById(app.user_id);
  if (!user) {
    throw new Error(`User ${app.user_id} not found`);
  }

  const escrow = app.stages_completed?.terms_agreement?.data?.down_payment_amount || 0;
  const legal = app.stages_completed?.payment_setup?.data?.legal_fee_amount || 0;
  const valuation = app.stages_completed?.payment_setup?.data?.valuation_fee_amount || 0;
  const total = escrow + legal + valuation;

  await sendEmail({
    to: user.email,
    subject: 'Payments Complete, Your Property is Secured!',
    html: paymentCompletionEmail({
      userName: user.name,
      propertyName: app.property_name,
      totalPaid: total,
      paymentBreakdown: { escrow, legal, valuation },
    }),
  });

  await createNotification(
    buildNotificationPayload('payment_stage_completed', {
      user_id: user.id,
      application_id: app.id,
      property_id: app.property_id,
      type: 'payment_stage_completed',
      channel: 'in_app',
      metadata: {
        application_number: app.application_number,
        cta_url: '/user-dashboard/applications',
      },
    })
  );

}

async function handleMortgageActivation(
  app: ApplicationBase,
  context: {
    propertyQB: SupabaseQueryBuilder<PropertyBase>;
    userQB: SupabaseQueryBuilder<UserBase>;
    transactionQB: SupabaseQueryBuilder<TransactionBase>;
  }
): Promise<void> {
  const { propertyQB, userQB, transactionQB } = context;

  const [user, seller, escrowTransaction] = await Promise.all([
    userQB.findById(app.user_id),
    app.developer_id ? userQB.findById(app.developer_id) : null,
    transactionQB.findOneByCondition({
      application_id: app.id,
      type: 'escrow_down_payment',
      status: 'succeeded',
    }),
  ]);

  if (!user) {
    throw new Error(`User ${app.user_id} not found`);
  }

  if (app.property_id) {
    await propertyQB.update(app.property_id, { status: 'sold' });
  }

  if (escrowTransaction) {
    await transactionQB.update(escrowTransaction.id, {
      status: 'released',
      state: 'released',
      metadata: {
        ...escrowTransaction.metadata,
        escrow_status: 'released',
        initiated_at: new Date().toISOString(),
        session_url:escrowTransaction.metadata?.session_url || null,
        expires_at:escrowTransaction.metadata?.expires_at || ''
      },
    });
  }

  await sendEmail({
    to: user.email,
    subject: "Congratulations! You're Now a Property Owner!",
    html: mortgageActivationEmail({
      userName: user.name,
      propertyName: app.property_name,
      mortgageAmount: `${app.approved_loan_amount}`,
      totalLoanTerm: app.loan_term_months,
      applicationNumber: app.application_number,
      monthlyPayment: `${app.monthly_payment}`,
      firstPaymentDate: app.first_payment_date,
    }),
  });

  await createNotification(
    buildNotificationPayload('mortgage_activated', {
      user_id: user.id,
      application_id: app.id,
      property_id: app.property_id,
      type: 'mortgage_activated',
      channel: 'in_app',
      metadata: {
        due_date: app.first_payment_date,
        escrow_amount: escrowTransaction?.amount || 0,
        cta_url: '/user-dashboard/properties',
        property_name: app.property_name,
      },
    })
  );

  if (seller) {
    await sendEmail({
      to: seller.email,
      subject: 'Congratulations! Your Property Has Been Sold',
      html: propertyAcquiredEmail({
        sellerName: seller.name,
        propertyName: app.property_name,
        propertyId: app.property_id,
        buyerName: user.name,
        saleAmount: `${app.property_price}`,
        applicationNumber: app.application_number,
        escrowAmount:escrowTransaction?.amount || 0
      }),
    });

    await createNotification(
      buildNotificationPayload('property_acquired', {
        user_id: seller.id,
        application_id: app.id,
        property_id: app.property_id,
        type: 'property_acquired',
        channel: 'in_app',
        metadata: {
          cta_url: `/seller-dashboard/listings/${app.property_id}`,
          property_name: app.property_name,
        },
      })
    );
  }

  if (escrowTransaction && seller) {
    await sendEmail({
      to: 'muhammedolaleye@gmail.com',
      subject: `Action Required: Release Escrow Funds - Application ${app.application_number}`,
      html: AdminEscrowNotification({
        applicationNumber: app.application_number,
        propertyName: app.property_name,
        amount: escrowTransaction.amount,
        sellerName: seller.name,
        sellerEmail: seller.email,
        sellerID: seller.id,
        buyerName: user.name,
        transactionID: escrowTransaction.id,
      }),
    });
  }

}

function getSuccessMessage(stageType: StageType): string {
  const messages = {
    identity: 'Identity verification completed',
    property: 'Property selection completed',
    terms: 'Terms and agreement completed',
    payment: 'Payment setup completed',
    mortgage: 'Mortgage activated',
  };

  return messages[stageType];
}