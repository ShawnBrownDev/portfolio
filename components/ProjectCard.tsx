import Image from 'next/image';
import { Project } from '@/lib/projects';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden">
        <div className="w-full h-full bg-gray-700 relative">
          {/* Placeholder for project image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={project.image} 
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-gray-700 text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <p className="text-gray-300 mb-6 flex-grow">{project.description}</p>

        <div className="flex gap-3 mt-auto">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Live Demo
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors border border-input bg-transparent rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;