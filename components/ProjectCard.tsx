"use client";

import { Project, Category } from '@/lib/projects';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import SimpleImage from './SimpleImage';

interface ProjectCardProps {
  project: Project & { categories: Category[] };
  onViewMore?: (project: Project) => void;
  isFirst?: boolean;
  handleTogglePublished?: () => void;
  isToggling?: boolean;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const ProjectCard = ({
  project,
  onViewMore,
  isFirst = false,
  handleTogglePublished,
  isToggling = false,
  onDelete,
  onUpdate,
}: ProjectCardProps) => {
  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {project.image && (
          <SimpleImage
            src={project.image}
            alt={project.title}
            fill
            className="transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {/* Draft badge and publish icon */}
        {!project.is_published && (
          <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">Draft</span>
            {handleTogglePublished && (
              <button
                onClick={handleTogglePublished}
                disabled={isToggling}
                title="Publish Project"
                className="ml-1 p-1 rounded hover:bg-yellow-200/40 transition-colors"
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-700" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-500 hover:text-green-600" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map((category: Category) => (
            <Badge key={category.id} variant="secondary" className="bg-gray-700">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="default"
            onClick={() => onViewMore?.(project)}
          >
            View More
          </Button>
          <div className="flex gap-2">
            {project.demourl && (
              <a
                href={project.demourl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                Demo
              </a>
            )}
            {project.githuburl && (
              <a
                href={project.githuburl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;