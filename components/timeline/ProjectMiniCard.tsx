'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

interface ProjectMiniCardProps {
  project: Project;
}

const ProjectMiniCard: React.FC<ProjectMiniCardProps> = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-700/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-white">{project.name}</h4>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      
      {project.description && (
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {project.description}
        </p>
      )}
      
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full"
            >
              <Code className="w-2.5 h-2.5" />
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-1">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectMiniCard; 