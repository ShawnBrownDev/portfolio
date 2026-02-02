import { supabase } from './supabase';

export interface ExperienceItem {
  id: string;
  user_id: string;
  title: string;
  company: string;
  period: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceItemInput {
  title: string;
  company: string;
  period: string;
  description?: string;
  order_index?: number;
}

export const getExperiences = async (): Promise<ExperienceItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }

  return (data as ExperienceItem[]) || [];
};

export const addExperience = async (experience: ExperienceItemInput): Promise<ExperienceItem | null> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Adding experience for user:', user.id);
    console.log('Experience data:', experience);

    const experienceWithUserId = {
      ...experience,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('experiences')
      .insert([experienceWithUserId])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Successfully added experience:', data);
    return data as ExperienceItem;
  } catch (error) {
    console.error('Error in addExperience:', error);
    throw error;
  }
};

export const updateExperience = async (id: string, experience: Partial<ExperienceItemInput>): Promise<ExperienceItem | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('experiences')
    .update(experience)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating experience:', error);
    throw error;
  }

  return data as ExperienceItem;
};

export const deleteExperience = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }

  return true;
};