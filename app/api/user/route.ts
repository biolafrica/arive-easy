import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { UserBackendFormProps, UserBase } from "@/type/user";
import { sendEmail } from "@/utils/email/send_email";
import { confirmationLinkEmail, internalUserCredentialsEmail } from "@/utils/email/templates/welcome";

const handlers = createCRUDHandlers<UserBackendFormProps>({
  table: "users",
  requiredFields: ["email", "name", "role"],
  searchFields: ['name'],
  
  hooks: {
    beforeCreate: async (data, context) => {
      if (!data.password) {
        throw new Error('Password is required');
      }

      const isInternalUser = ['admin', 'support'].includes(data.role);

      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: isInternalUser,
          user_metadata: {
            name: data.name,
            role: data.role,
          },
        });

        if (authError) {
          if (authError.message?.includes("already registered")) {
            throw new Error("Email already registered");
          }
          throw authError;
        }

        data.id = authData.user!.id;
      } catch (error: any) {
        throw new Error(error.message || "Failed to create auth user");
      }
      
      context.metadata = {
        ...context.metadata,
        tempPassword: data.password,
        isInternalUser,
      };
      
      delete (data as any).password;
      
      data.email_verified =  isInternalUser;

      return data
    },

    afterCreate: async (createdUser, _, context) => {
      const tempPassword = context.metadata?.tempPassword;
      const isInternalUser = context.metadata?.isInternalUser;

      if (!tempPassword) {
        throw new Error("Missing temp password for verification link");
      }

      try {
        if (isInternalUser) {
          await sendInternalUserCredentialsEmail(createdUser, tempPassword);
        } else {
          await sendVerificationEmail(createdUser, tempPassword);
        }
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    },
  },
});

async function sendVerificationEmail(user: UserBackendFormProps, tempPassword: string) {
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email: user.email,
    password: tempPassword,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
      data: {
        role: user.role,
      },
    },
  });

  if (linkError || !linkData) {
    console.error('Failed to generate verification link:', linkError);
    throw new Error('Failed to generate verification link');
  }

  const verificationUrl = linkData.properties?.action_link;

  await sendEmail({
    to: user.email,
    subject: 'Verify your email - Kletch',
    html: confirmationLinkEmail({
      username: user.name,
      url: verificationUrl,
    }),
  });

  console.log(`Verification email sent to ${user.role}: ${user.email}`);
}

async function sendInternalUserCredentialsEmail(user: UserBackendFormProps, tempPassword: string) {
  const roleLabel = user.role === 'admin' ? 'Administrator' : 'Support Team Member';
  await sendEmail({
    to: user.email,
    subject: `Welcome to Kletch ${roleLabel} Portal`,
    html: internalUserCredentialsEmail({
      name: user.name,
      email: user.email,
      tempPassword,
    }),
  });

  console.log(`Credentials email sent to ${user.role}: ${user.email}`);
}

export const { GET, POST, PUT, } = handlers;