"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/types/project';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import VideoPlayer from '@/components/projects/VideoPlayer';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const allImages = [project.image, ...(project.additionalimages || [])];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  const handleImageClick = () => {
    setLightboxOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-3xl mx-auto relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white z-10 p-1"
          aria-label="Close modal"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white pr-8">{project.title}</h3>

        {/* Image Gallery */}
        <div className="mb-4 relative h-48 sm:h-64 w-full rounded-md overflow-hidden group">
          {allImages[currentImageIndex] && (
            <Image
              src={allImages[currentImageIndex] as string}
              alt={`${project.title} image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
          )}
          {/* Hoverable Lightbox Icon */}
          <button
            type="button"
            onClick={handleImageClick}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/30"
            style={{ pointerEvents: 'auto' }}
            aria-label="View full image"
          >
            <ExternalLink className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-lg" />
          </button>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>

        {/* Video Section */}
        {(project.videourl || project.video_file) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Play size={16} className="text-blue-400" />
              <h4 className="text-lg font-semibold text-white">Project Demo Video</h4>
            </div>
            <VideoPlayer 
              videoUrl={project.video_file || project.videourl!} 
              title={`${project.title} Demo Video`}
              className="w-full"
            />
          </div>
        )}

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-0 max-w-[95vw] sm:max-w-3xl">
            <DialogTitle className="sr-only">Full size image preview</DialogTitle>
            <div className="relative max-h-[85vh] max-w-[90vw] rounded-lg overflow-hidden" style={{ background: 'black' }}>
              {allImages[currentImageIndex] && (
                <Image
                  src={allImages[currentImageIndex] as string}
                  alt="Full size preview"
                  width={800}
                  height={600}
                  className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-sm sm:text-base text-gray-300 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {project.tags?.map((tag: string, index: number) => (
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
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-white">Challenges:</h4>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-1">
              {project.challenges.map((challenge: string, index: number) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}

        {project.solutions && project.solutions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-white">Solutions:</h4>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-1">
              {project.solutions.map((solution: string, index: number) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
        )}

        {project.impact && (
          <div className="mb-4">
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-white">Impact:</h4>
            <p className="text-sm sm:text-base text-gray-400">{project.impact}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end relative">
          {project.demourl && (
            <>
              <a
                href={project.demourl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground rounded-md hover:bg-primary/90 w-full sm:w-auto"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setDemoOpen(true); setIframeError(false); }}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg w-full sm:w-auto border border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                >
                  🚀 Interactive Demo
                </button>
              </div>
              <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
                <DialogContent className="flex flex-col items-center justify-center bg-black bg-opacity-90 p-2 sm:p-0 max-w-[95vw] sm:max-w-3xl min-h-[60vh]">
                  <DialogTitle className="sr-only">Project Demo</DialogTitle>
                  {!iframeError ? (
                    <iframe
                      src={project.demourl}
                      title="Project Demo"
                      className="w-[90vw] h-[60vh] sm:w-[60vw] sm:h-[70vh] rounded-lg border border-gray-700 bg-white"
                      allow="clipboard-write; fullscreen"
                      onError={() => setIframeError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full p-8">
                      <span className="text-red-500 text-lg font-semibold mb-2">Unable to display the demo here.</span>
                      <a
                        href={project.demourl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline text-base"
                      >
                        Open Live Demo in New Tab
                      </a>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}

          {project.githuburl && (
            <a
              href={project.githuburl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors border border-input bg-transparent rounded-md hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
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