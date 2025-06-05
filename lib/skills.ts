import { FaJs, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiNextdotjs } from 'react-icons/si';
import { IconType } from 'react-icons';

export interface Skill {
  name: string;
  icon: IconType;
  category: 'frontend' | 'backend' | 'database' | 'devops';
  description: string;
}

export const skills: Skill[] = [
  {
    name: 'Next.js',
    icon: SiNextdotjs,
    category: 'frontend',
    description: 'Server-side rendering and static site generation',
  },
  {
    name: 'React',
    icon: FaReact,
    category: 'frontend',
    description: 'Component-based UI development',
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
    category: 'frontend',
    description: 'Type-safe JavaScript development',
  },
  {
    name: 'Node.js',
    icon: FaNodeJs,
    category: 'backend',
    description: 'Server-side JavaScript runtime',
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    category: 'database',
    description: 'Advanced relational database',
  },
  {
    name: 'Supabase',
    icon: SiSupabase,
    category: 'backend',
    description: 'Open source Firebase alternative',
  },
  {
    name: 'Docker',
    icon: FaDocker,
    category: 'devops',
    description: 'Containerization and deployment',
  },
];