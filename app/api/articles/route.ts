import { ArticleForm } from "@/type/pages/article";
import { optionalAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";


const articlesHandlers = createCRUDHandlers<ArticleForm>({
  table: 'articles',
  requiredFields: ['title', 'description', 'category', 'image', 'images', 'read_time', 'excerpt'],
  searchFields: ['title'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  },
  middleware:{
    auth: async (request: NextRequest) => {
      const user = await optionalAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.app_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      if (action === 'read' || action === 'list') return true;

      if (!context.auth?.userId) return false;

      const role = context.auth?.role;

      switch (role) {
        case 'admin':
          return true;
        default:
          return action === 'update';
      }
    },

  }
});

export const {GET} = articlesHandlers;