'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectForm from '@/components/ProjectForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotification } from '@/contexts/NotificationContext';

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { showNotification } = useNotification();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }

      setProjects(data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      showNotification('error', error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete project');
      }

      showNotification('success', 'Project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      showNotification('error', error.message || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Projects</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-white text-black hover:bg-gray-100"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 animate-pulse">
              <div className="aspect-video bg-[#333] rounded mb-4"></div>
              <div className="h-6 bg-[#333] rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-[#333] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 text-center">
          <h3 className="text-white font-medium mb-2">No projects yet</h3>
          <p className="text-gray-400 text-sm mb-4">
            Get started by adding your first project to your portfolio.
          </p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-white text-black hover:bg-gray-100"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              onUpdate={fetchProjects}
            />
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl bg-[#1a1a1a] border border-[#333] text-white">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the project details below. Click add when you're done.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            mode="create"
            onClose={() => setShowAddDialog(false)}
            onSuccess={() => {
              setShowAddDialog(false);
              fetchProjects();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 