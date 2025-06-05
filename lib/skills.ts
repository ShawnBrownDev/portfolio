import { FaJs, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiNextdotjs } from 'react-icons/si';
import { IconType } from 'react-icons';

export interface Skill {
  name: string;
  icon: IconType;
}

export const skills: Skill[] = [
  {
    name: 'JavaScript',
    icon: FaJs,
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
  },
  {
    name: 'React',
    icon: FaReact,
  },
  {
    name: 'Node.js',
    icon: FaNodeJs,
  },
  {
    name: 'SupaBase',
    icon: SiSupabase,
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
  },
  {
    name: 'Next.js',
    icon: SiNextdotjs,
  },
];