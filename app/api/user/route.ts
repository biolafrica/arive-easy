import { UserBackendFormProps } from "@/type/user";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { sendEmail } from "@/utils/server/sendEmail";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";


const userHandlers = createCRUDHandlers<UserBackendFormProps>({
  table: "users",
  requiredFields: ["email", "name", "role"],
  
  hooks: {
    beforeCreate: async (data, context) => {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          name: data.name,
          role: data.role,
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          throw new Error("Email already registered");
        }
        throw authError;
      }

      data.id = authData.user.id;
      return data;
    },

    afterCreate: async (createdUser, context) => {
      try {
        const emailTemplate = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome to Ariveasy!</h1>
            <p>Hello ${createdUser.name},</p>
            <p>Your account has been successfully created.</p>
            <p><strong>Account Details:</strong></p>
            <ul>
              <li>Email: ${createdUser.email}</li>
              <li>Role: ${createdUser.role}</li>
            </ul>
            <p>You can now access your dashboard:</p>
            <a href="${process.env.NEXT_PUBLIC_API_URL}/${getRoleBasedRedirect(createdUser.role)}" 
               style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
              Go to Dashboard
            </a>
          </div>
        `;

        await sendEmail({
          to: createdUser.email,
          subject: "Welcome to Ariveasy - Account Created Successfully",
          html: emailTemplate,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);

      }
    },
  },
});


function getRoleBasedRedirect(role: string): string {
  const redirectMap = {
    admin: "/admin",
    seller: "/seller-dashboard",
    buyer: "/user-dashboard",
  };
  return redirectMap[role as keyof typeof redirectMap] || "/user-dashboard";
}

export const { POST } = userHandlers;