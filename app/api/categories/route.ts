import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/supabase/supa-schema';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(categories || [], { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500, headers: corsHeaders }
    );
  }
} 