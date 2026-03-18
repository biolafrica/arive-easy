import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { executeStageCompletion } from '@/utils/server/applicationStageHandlers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const user = await requireAuth();

    //change to admin later
    if (!user || user.user_metadata.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: applicationId } = await params;
    const body = await request.json();
    const { stageType, stageData } = body;

    if (!stageType) {
      return NextResponse.json({ error: 'stageType is required' },{ status: 400 });
    }

    const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');

    const application = await applicationQB.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' },{ status: 404 });
    }

    const result = await executeStageCompletion({
      application,
      stageType,
      stageData,
      userId: user.id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to complete stage' },{ status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.updatedApplication,
    });

  } catch (error) {
    console.error('Stage completion error:', error);
    return NextResponse.json({ error: 'Failed to complete stage' },{ status: 500 });
  }
}