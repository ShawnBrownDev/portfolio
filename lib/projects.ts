import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Omit<Project, 'id' | 'created_at'>;
export type Category = Database['public']['Tables']['categories']['Row'];

export async function getProjects(): Promise<(Project & { categories: Category[] })[]> {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check your environment variables.');
  }

  try {
    // First, get all projects with their categories
    const { data: projects, error: projectsError } = await supabase
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

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return [];
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

    return transformedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check your environment variables.');
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function addProjectCategories(projectId: string, categoryIds: string[]): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check your environment variables.');
  }

  try {
    const { error } = await supabase
      .from('project_categories')
      .insert(
        categoryIds.map(categoryId => ({
          project_id: projectId,
          category_id: categoryId
        }))
      );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error adding project categories:', error);
    throw error;
  }
}

export async function addProject(
  project: Omit<ProjectInsert, 'user_id'>, 
  categoryIds: string[] = []
): Promise<{ data: Project | null; error: any }> {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check your environment variables.');
  }

  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No authenticated session found');
    }

    // Generate a unique ID for the project
    const id = crypto.randomUUID();

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, id, user_id: session.user.id }])
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    // If we have categories, add them
    if (categoryIds.length > 0) {
      await addProjectCategories(id, categoryIds);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<Omit<Project, 'id'>>,
  categoryIds: string[]
): Promise<{ error: Error | null }> {
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }

  try {
    // Start a transaction by using RPC
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        title: projectData.title,
        description: projectData.description,
        image: projectData.image,
        githuburl: projectData.githuburl,
        demourl: projectData.demourl,
        additionalimages: projectData.additionalimages,
        challenges: projectData.challenges,
        solutions: projectData.solutions,
        impact: projectData.impact,
        tags: projectData.tags
      })
      .eq('id', id);

    if (projectError) {
      console.error('Error updating project:', projectError);
      throw projectError;
    }

    // Delete existing categories
    const { error: deleteError } = await supabase
      .from('project_categories')
      .delete()
      .eq('project_id', id);

    if (deleteError) {
      console.error('Error deleting existing categories:', deleteError);
      throw deleteError;
    }

    // Add new categories if any are provided
    if (categoryIds.length > 0) {
      const { error: insertError } = await supabase
        .from('project_categories')
        .insert(
          categoryIds.map(categoryId => ({
            project_id: id,
            category_id: categoryId
          }))
        );

      if (insertError) {
        console.error('Error inserting new categories:', insertError);
        throw insertError;
      }
    }

    return { error: null };
  } catch (error) {
    console.error('Error in updateProject:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
} 