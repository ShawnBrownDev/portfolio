'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Globe, Github, Eye, EyeOff } from 'lucide-react';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import ProjectForm from '@/components/ProjectForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toggleProjectPublishedStatus } from '@/lib/projects';
import { useNotification } from '@/contexts/NotificationContext';

interface ProjectCardProps {
  project: Project;
  handleTogglePublished: (project: Project) => void;
  isToggling: boolean;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function ProjectCard({ project, handleTogglePublished, isToggling, onDelete, onUpdate }: ProjectCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  return (
    <>
      <Card className="bg-[#1a1a1a] border border-[#333] overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {!project.is_published && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
              Draft
            </div>
          )}
      </div>
        <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 pr-2">{project.title}</h3>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleTogglePublished(project)}
                disabled={isToggling}
                title={project.is_published ? 'Unpublish' : 'Publish'}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                {project.is_published ? <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 hover:text-white"
                onClick={handleEdit}
            >
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 hover:text-red-400"
              onClick={() => onDelete(project.id)}
            >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {project.description}
          </p>
        {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {project.tags.map((tag, index) => (
                <Badge
                key={index}
                  variant="secondary"
                  className="bg-[#333] text-white text-xs"
              >
                {tag}
                </Badge>
            ))}
          </div>
          )}
        </div>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl bg-[#1a1a1a] border border-[#333] text-white">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Make changes to your project here. Click update when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={project}
            mode="edit"
            onClose={() => setShowEditDialog(false)}
            onSuccess={() => {
              setShowEditDialog(false);
              if (onUpdate) onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 