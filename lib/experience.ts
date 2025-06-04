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
    title: 'AWS Certified Solutions Architect',
    company: '',
    period: '2025',
  },
  {
    id: 'exp-2',
    title: 'Lead Developer',
    company: 'Globex',
    period: '2020-2023',
  },
  {
    id: 'exp-3',
    title: 'Software Engineer',
    company: 'Acmo Corp',
    period: '2015-2020',
  },
  {
    id: 'exp-4',
    title: 'M.S. in Computer Science',
    company: '',
    period: '',
  },
];