"use client";

import { useState } from 'react';
import { projects, Project } from '@/lib/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleViewMore = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-12">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onViewMore={handleViewMore}
            />
          ))}
        </div>

        {/* Modal Placeholder */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={handleCloseModal} 
          />
        )}
      </div>
    </section>
  );
};

export default Projects;