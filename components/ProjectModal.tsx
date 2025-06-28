"use client";

import { useState } from 'react';
import { Project } from '../lib/projects';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const allImages = [project.image, ...(project.additionalimages || [])];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  // Placeholder for image click to pop out
  const handleImageClick = () => {
    // Implement lightbox or larger view here later
    console.log('Image clicked:', allImages[currentImageIndex]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-4 text-white">{project.title}</h3>

        {/* Image Gallery */}
        <div className="mb-4 relative h-64 w-full rounded-md overflow-hidden group">
          <Image 
            src={allImages[currentImageIndex]}
            alt={`${project.title} image ${currentImageIndex + 1}`}
            fill
            className="object-cover cursor-pointer"
            onClick={handleImageClick}
          />

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        <p className="text-gray-300 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-gray-700 text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.challenges && project.challenges.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2 text-white">Challenges:</h4>
            <ul className="list-disc list-inside text-gray-400">
              {project.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}

        {project.solutions && project.solutions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2 text-white">Solutions:</h4>
            <ul className="list-disc list-inside text-gray-400">
              {project.solutions.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
        )}

        {project.impact && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2 text-white">Impact:</h4>
            <p className="text-gray-400">{project.impact}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6 justify-end">
          {project.demourl && (
            <a
              href={project.demourl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          )}

          {project.githuburl && (
            <a
              href={project.githuburl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors border border-input bg-transparent rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal; 