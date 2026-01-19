import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id: propertyId } = await params; 

    const { data, error } = await supabaseAdmin
      .rpc('increment_offers', { property_id: propertyId });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      views: data
    });
  } catch (error: any) {
    console.error('View tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}