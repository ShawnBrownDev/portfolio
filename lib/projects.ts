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
    description: 'Implement and build projecon to color nunsarment-caatign',
    image: '/images/project1.png',
    tags: ['Svmtc', 'Βipornce', 'Pθracrou'],
    demoUrl: 'https://demo.example.com/project1',
    githubUrl: 'https://github.com/johndoe/project1',
  },
  {
    id: 'project-two',
    title: 'Project Two',
    description: 'Laad experimentaries running for the conduct moditation tack',
    image: '/images/project2.png',
    tags: ['Nevo', 'Mode.io'],
    demoUrl: 'https://demo.example.com/project2',
    githubUrl: 'https://github.com/johndoe/project2',
  },
  {
    id: 'project-three',
    title: 'Project Three',
    description: 'Engagement cusbalrutum-Oily data, and lile gap?',
    image: '/images/project3.png',
    tags: ['Pymorr', 'Dacuer'],
    demoUrl: 'https://demo.example.com/project3',
    githubUrl: 'https://github.com/johndoe/project3',
  },
];