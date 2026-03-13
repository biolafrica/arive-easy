import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { UserBackendFormProps } from "@/type/user";
import { sendEmail } from "@/utils/email/send_email";
import { confirmationLinkEmail } from "@/utils/email/templates/welcome";

const handlers = createCRUDHandlers<UserBackendFormProps>({
  table: "users",
  requiredFields: ["email", "name", "role"],
    searchFields: ['name'],
  
  hooks: {
    beforeCreate: async (data, context) => {
      if (data.password) {
        try {
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: false,
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
      }
      

      context.metadata = {
        ...context.metadata,
        tempPassword: data.password,
      };
      
      delete (data as any).password;
      
      data.email_verified = false;

      return data
    },

    afterCreate: async (createdUser, _, context) => {

      const tempPassword = context.metadata?.tempPassword;

      if (!tempPassword) {
        throw new Error("Missing temp password for verification link");
      }

      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email: createdUser.email,
        password: tempPassword, 
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
          data: {
            role: createdUser.role 
          }
        }
      });

      if (linkError || !linkData) {
        console.error("Failed to generate verification link:", linkError);
        throw new Error("Failed to generate verification link");
      }

      const verificationUrl = linkData.properties?.action_link;

      try {
        await sendEmail({
          to:  createdUser.email,
          subject: 'Verify your email - Kletch',
          html: confirmationLinkEmail({
            username: createdUser.name,
            url:verificationUrl
          }),
        });
      } catch (error) {
        console.error('Failed to verification email:', error);
      }
    
    },
  },
});

export const { GET, POST, PUT, DELETE } = handlers;