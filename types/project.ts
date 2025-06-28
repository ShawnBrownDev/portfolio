export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  githuburl: string | null;
  demourl: string | null;
  challenges: string[] | null;
  solutions: string[] | null;
  impact: string | null;
  tags: string[] | null;
  additionalimages: string[] | null;
} 