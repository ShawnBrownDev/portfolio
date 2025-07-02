import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

type ProjectWithCategories = Database['public']['Tables']['projects']['Row'] & {
  project_categories: Array<{
    category_id: string;
    categories: {
      id: string;
      name: string;
    };
  }>;
};

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json(
        { error: 'Database client not initialized' },
        { status: 500 }
      );
    }

    console.log('Fetching projects from Supabase...');
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          category_id,
          categories (
            id,
            name
          )
        )
      `)
      .returns<ProjectWithCategories[]>();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Successfully fetched projects:', data?.length);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database client not initialized' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single()
      .returns<Database['public']['Tables']['projects']['Row']>();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database client not initialized' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 