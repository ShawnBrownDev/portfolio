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
    title: 'Project One',
    description: 'A modern web application built with React and TypeScript',
    image: '/images/project1.png',
    tags: ['React', 'TypeScript', 'Next.js'],
    demoUrl: 'https://demo.example.com/project1',
    githubUrl: 'https://github.com/johndoe/project1',
  },
  {
    id: 'project-two',
    title: 'Project Two',
    description: 'A full-stack application with real-time data processing',
    image: '/images/project2.png',
    tags: ['Node.js', 'MongoDB'],
    demoUrl: 'https://demo.example.com/project2',
    githubUrl: 'https://github.com/johndoe/project2',
  },
  {
    id: 'project-three',
    title: 'Project Three',
    description: 'An AI-powered data analysis and visualization tool',
    image: '/images/project3.png',
    tags: ['Python', 'TensorFlow'],
    demoUrl: 'https://demo.example.com/project3',
    githubUrl: 'https://github.com/johndoe/project3',
  },
];