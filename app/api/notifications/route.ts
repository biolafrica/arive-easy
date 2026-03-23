import { createCRUDHandlers } from '@/utils/server/crudFactory';
import { NotificationBase } from '@/type/pages/dashboard/notification';
import { requireAuth } from '@/utils/server/authMiddleware';
import { NextRequest } from 'next/server';

const handlers = createCRUDHandlers<NotificationBase>({
  table: 'notifications',
  requiredFields: ['user_id', 'type', 'title', 'message'],
  defaultSort: { field: 'created_at', order: 'desc' },
  middleware: {
    auth: async (req: NextRequest) => {
      const user = await requireAuth();
      return user ? { userId: user.id, role: user.app_metadata.role } : null;
    },
    permissions: async (action, context) => {
      const role = context.auth?.role;
      const userId = context.auth?.userId;

      if (!userId) return false;

      switch (role) {
        case 'admin':
          return true;
        case 'user':
        case 'seller':
          return ['create', 'read', 'list', 'update', 'delete'].includes(action);
        default:
          return false;
      }
    },

  },
});

export const { GET, PUT } = handlers; 