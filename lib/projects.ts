export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: 'project-one',
    title: 'Uplink AI',
    description: 'A modern AI-powered document management platform built with Next.js and Supabase, featuring secure authentication, real-time processing, and intelligent document analysis for streamlined team collaboration.',
    image: '/images/uplinkai.png',
    tags: ['Next.js', 'Supabase', 'tailwindcss', 'TypeScript'],
    demoUrl: 'https://uplink-ai.vercel.app/',
    githubUrl: 'https://github.com/ShawnBrownDev/uplink-ai',
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