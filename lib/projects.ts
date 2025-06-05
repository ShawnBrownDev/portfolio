export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  challenges?: string[];
  solutions?: string[];
  impact?: string;
  additionalImages?: string[];
}

export const projects: Project[] = [
  {
    id: 'project-one',
    title: 'Uplink AI',
    description: 'A modern AI-powered document management platform built with Next.js and Supabase, featuring secure authentication, real-time processing, and intelligent document analysis for streamlined team collaboration. Test it with username: test@test.com and password: password',
    image: '/images/uplinkai/uplinkai.png',
    tags: ['Next.js', 'Supabase', 'tailwindcss', 'TypeScript'],
    demoUrl: 'https://uplink-ai.vercel.app/',
    githubUrl: 'https://github.com/ShawnBrownDev/uplink-ai',
    challenges: [
      'Implementing secure authentication and authorization with Supabase.',
      'Handling real-time data updates efficiently.',
      'Integrating external AI services for document analysis.',
      'Optimizing data fetching and rendering performance in Next.js.',
    ],
    solutions: [
      'Utilized Supabase Row Level Security (RLS) and policies for fine-grained access control.',
      'Leveraged Supabase real-time subscriptions for instant data synchronization.',
      'Designed a flexible API layer to interact with various AI APIs and handle responses.',
      'Implemented server-side rendering (SSR) and static site generation (SSG) strategies in Next.js, along with data caching.',
    ],
    impact: 'Enabled streamlined document management and team collaboration with enhanced security and performance.',
    additionalImages: [
      '/images/uplinkai/uplinkai2.png',
      '/images/uplinkai/uplink3.png',
      '/images/uplinkai/uplink4.png',
      '/images/uplinkai/uplink5.png'
    ] 
  },
  // {
  //   id: 'project-two',
  //   title: 'Project Two',
  //   description: 'A full-stack application with real-time data processing',
  //   image: '/images/project2.png',
  //   tags: ['Node.js', 'MongoDB'],
  //   demoUrl: 'https://demo.example.com/project2',
  //   githubUrl: 'https://github.com/johndoe/project2',
  // },
  // {
  //   id: 'project-three',
  //   title: 'Project Three',
  //   description: 'An AI-powered data analysis and visualization tool',
  //   image: '/images/project3.png',
  //   tags: ['Python', 'TensorFlow'],
  //   demoUrl: 'https://demo.example.com/project3',
  //   githubUrl: 'https://github.com/johndoe/project3',
  // },
];