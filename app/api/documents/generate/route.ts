import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { documentGenerator } from '@/utils/server/documentGenerator';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // change to if not admin later
    if (!user || user.user_metadata?.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, documentType } = body;

    if (!applicationId || !documentType) {
      return NextResponse.json(
        { error: 'applicationId and documentType are required' },
        { status: 400 }
      );
    }

    const result = await documentGenerator.generateDocument({
      applicationId,
      documentType,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      etchPacketEid: result.etchPacketEid,
    });
  } catch (error) {
    console.error('E-signature sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send document for signature' },
      { status: 500 }
    );
  }
}