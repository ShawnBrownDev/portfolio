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
  const { data, error } = await (supabase as any)
    .from('experiences')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }

  return (data as ExperienceItem[]) || [];
};

export const addExperience = async (experience: ExperienceItemInput): Promise<ExperienceItem | null> => {
  const { data, error } = await (supabase as any)
    .from('experiences')
    .insert([experience])
    .select()
    .single();

  if (error) {
    console.error('Error adding experience:', error);
    return null;
  }

  return data as ExperienceItem;
};

export const updateExperience = async (id: string, experience: Partial<ExperienceItemInput>): Promise<ExperienceItem | null> => {
  const { data, error } = await (supabase as any)
    .from('experiences')
    .update(experience)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating experience:', error);
    return null;
  }

  return data as ExperienceItem;
};

export const deleteExperience = async (id: string): Promise<boolean> => {
  const { error } = await (supabase as any)
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting experience:', error);
    return false;
  }

  return true;
};