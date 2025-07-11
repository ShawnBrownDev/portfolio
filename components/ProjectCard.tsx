"use client";

import { Project, Category } from '@/lib/projects';
import Image from 'next/image';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProjectCardProps {
  project: Project & { categories: Category[] };
  onViewMore: (project: Project) => void;
}

const ProjectCard = ({ project, onViewMore }: ProjectCardProps) => {
  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map((category) => (
            <Badge key={category.id} variant="secondary" className="bg-gray-700">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="default"
            onClick={() => onViewMore(project)}
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