import { requireAuth } from "@/utils/server/authMiddleware";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (user.app_metadata.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Role' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin.rpc('get_admin_dashboard_analytics');

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Admin dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin analytics', details: error.message },
      { status: 500 }
    );
  }
}