'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Globe, Github } from 'lucide-react';
import type { Project } from '@/types/project';
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

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
  onUpdate?: () => void;
}

export function ProjectCard({ project, onDelete, onEdit, onUpdate }: ProjectCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  return (
    <>
      <Card className="bg-[#1a1a1a] border border-[#333] overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
      </div>
        <div className="p-4">
        <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={handleEdit}
            >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-400"
              onClick={() => onDelete(project.id)}
            >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge
                key={index}
                  variant="secondary"
                  className="bg-[#333] text-white"
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