export interface SkillProgression {
  skill_name: string;
  level: number;
  months_experience: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface EnhancedExperience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  period: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  skill_progressions?: SkillProgression[];
  projects?: Project[];
  technologies_focus?: string[];
}

export interface TimelineFilters {
  skillName?: string;
  technology?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}