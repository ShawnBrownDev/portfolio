import { FaJs, FaReact, FaNodeJs, FaDocker, FaGitAlt, FaAws } from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiNextdotjs, SiTailwindcss, SiMongodb, SiJest, SiCypress, SiTensorflow, SiPytorch, SiFlutter } from 'react-icons/si';
import { IconType } from 'react-icons';

export type Category = 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'ai-ml' | 'testing' | 'tools';

export interface Skill {
  name: string;
  icon: IconType;
  category: Category[];
  description: string;
}

export const skills: Skill[] = [
  {
    name: 'Next.js',
    icon: SiNextdotjs,
    category: ['frontend', 'backend'],
    description: 'Server-side rendering, static site generation, and full-stack framework capabilities',
  },
  {
    name: 'React',
    icon: FaReact,
    category: ['frontend'],
    description: 'Component-based UI development with powerful state management',
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
    category: ['frontend', 'backend'],
    description: 'Type-safe JavaScript development for enhanced code quality and maintainability',
  },
  {
    name: 'Node.js',
    icon: FaNodeJs,
    category: ['backend'],
    description: 'Server-side JavaScript runtime for scalable backend applications',
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    category: ['database'],
    description: 'Advanced relational database with robust features and scalability',
  },
  {
    name: 'MongoDB',
    icon: SiMongodb,
    category: ['database'],
    description: 'NoSQL database for flexible document storage and scalability',
  },
  {
    name: 'Supabase',
    icon: SiSupabase,
    category: ['backend', 'database'],
    description: 'Open-source Firebase alternative with real-time capabilities and built-in authentication',
  },
  {
    name: 'Docker',
    icon: FaDocker,
    category: ['devops'],
    description: 'Container platform for consistent development and deployment environments',
  },
  {
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
    category: ['frontend'],
    description: 'Utility-first CSS framework for rapid and maintainable UI development',
  },
  {
    name: 'React Native',
    icon: FaReact,
    category: ['mobile', 'frontend'],
    description: 'Cross-platform mobile app development with React ecosystem',
  },
  {
    name: 'Git',
    icon: FaGitAlt,
    category: ['tools'],
    description: 'Distributed version control system for collaborative development',
  },
  {
    name: 'VS Code',
    icon: FaReact, // Using React icon as placeholder since VS Code icon not available
    category: ['tools'],
    description: 'Powerful code editor with extensive plugin ecosystem',
  },
];