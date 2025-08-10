import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/supabase/supa-schema';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeUnpublished = url.searchParams.get('includeUnpublished') === 'true';
    

    const supabase = await createSupabaseClient();
    
    // Build the query
    let query = supabase
      .from('projects')
      .select(`
        *,
        categories:project_categories(
          category:categories(
            id,
            name,
            description
          )
        )
      `);

    // If not including unpublished, filter for published only
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    const { data: projects, error: projectsError } = await query;

    if (projectsError) {
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Transform the data to match our expected format
    const transformedProjects = projects.map(project => {
      const categories = project.categories
        ? project.categories
            .map((pc: any) => pc.category)
            .filter(Boolean)
        : [];
      const { categories: _, ...projectWithoutCategories } = project;
      return {
        ...projectWithoutCategories,
        categories
      };
    });

    return NextResponse.json(transformedProjects || [], { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseClient();
    
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseClient();
    
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
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 