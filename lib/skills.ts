import { FaJs, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiNextdotjs, SiTailwindcss } from 'react-icons/si';
import { IconType } from 'react-icons';

export interface Skill {
  name: string;
  icon: IconType;
  category: ('frontend' | 'backend' | 'database' | 'devops')[];
  description: string;
}

export const skills: Skill[] = [
  {
    name: 'Next.js',
    icon: SiNextdotjs,
    category: ['frontend', 'backend'],
    description: 'Server-side rendering, static site generation, and backend APIs',
  },
  {
    name: 'React',
    icon: FaReact,
    category: ['frontend'],
    description: 'Component-based UI development',
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
    category: ['frontend', 'backend'],
    description: 'Type-safe JavaScript development for both frontend and backend',
  },
  {
    name: 'Node.js',
    icon: FaNodeJs,
    category: ['backend'],
    description: 'Server-side JavaScript runtime',
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    category: ['database'],
    description: 'Advanced relational database',
  },
  {
    name: 'Supabase',
    icon: SiSupabase,
    category: ['backend', 'database'],
    description: 'Open source Firebase alternative with backend and database features',
  },
  {
    name: 'Docker',
    icon: FaDocker,
    category: ['devops'],
    description: 'Containerization and deployment',
  },
  {
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
    category: ['frontend'],
    description: 'Utility-first CSS framework for rapid UI development',
  },
];