export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description?: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Started Self Learning',
    company: 'Started to learn programming',
    period: '2019',
  },
   {
    id: 'exp-2',
    title: 'Started to Learn Lua for Fivem (GTA V Mod)',
    company: 'Started to learn Lua for Fivem',
    period: '2019-2020',
  },
  {
    id: 'exp-3',
    title: 'Started My Journey in React.js  ',
    company: 'Started to learn React.js',
    period: '2020-2021',
  }, 
   {
    id: 'exp-4',
    title: 'Started Learning Tailwind CSS',
    company: 'Started to learn Tailwind CSS',
    period: '2021-ongoing',
  }, 
  {
    id: 'exp-5',
    title: 'Started Learning TypeScript',
    company: 'Started to learn TypeScript',
    period: '2021-ongoing',
  },
   {
    id: 'exp-6',
    title: 'Started Learning Next.js',
    company: 'Started to learn Next.js',
    period: '2020-ongoing',
  },
  {
    id: 'exp-7',
    title: 'Start my journey in Freelancing',
    company: 'Freelancing',
    period: '2025-ongoing',
  },
];