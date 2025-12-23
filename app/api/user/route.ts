import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { sendEmail } from "@/utils/server/sendEmail";
import { UserBackendFormProps } from "@/type/user";

const handlers = createCRUDHandlers<UserBackendFormProps>({
  table: "users",
  requiredFields: ["email", "name", "role"],
  
  hooks: {
    beforeCreate: async (data, context) => {

      console.log("context", context)
      console.log('data received before create', data)

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

      console.log("upgraded context", context)
      
      delete (data as any).password;
      
      data.email_verified = false;

      return data
    },

    afterCreate: async (createdUser, body, context) => {

      console.log("context after create", context)
      console.log('body received after create', body)
      console.log('created user after create', createdUser)

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

      console.log('linkData Generated', linkData)

      if (linkError || !linkData) {
        console.error("Failed to generate verification link:", linkError);
        throw new Error("Failed to generate verification link");
      }

      const verificationUrl = linkData.properties?.action_link;
      console.log('verification url Generated', verificationUrl)

      await sendEmail({
        to: createdUser.email,
        subject: "Verify your email - Ariveasy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to Ariveasy!</h1>
            <p>Hi ${createdUser.name},</p>
            <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
            <a href="${verificationUrl}" 
               style="display: inline-block; margin: 20px 0; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
              Verify Email Address
            </a>
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              ${verificationUrl}
            </p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 24 hours.
            </p>
          </div>
        `,
      }).catch(error => {
        console.error("Failed to send verification email:", error);
      });
    
    },
  },
});


export async function PATCH(request: Request) {
  const { userId, email_verified } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ email_verified, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
  
  return Response.json({ data });
}

export const { GET, POST, PUT, DELETE } = handlers;