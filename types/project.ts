export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image: string;
  demourl: string | null;
  githuburl: string | null;
  videourl: string | null; // YouTube, Vimeo, Loom, or direct video URL
  video_file: string | null; // Uploaded video file URL
  additionalimages: string[] | null;
  challenges: string[] | null;
  solutions: string[] | null;
  impact: string | null;
  tags: string[] | null;
  is_published: boolean;
  created_at: string;
} 