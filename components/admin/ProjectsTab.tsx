'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/admin/ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, Globe } from 'lucide-react';
import ProjectForm from '@/components/projects/ProjectForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotification } from '@/contexts/NotificationContext';
import { publishAllProjects, toggleProjectPublishedStatus } from '@/lib/projects';

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [publishingAll, setPublishingAll] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects?includeUnpublished=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }

      setProjects(data);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
      showNotification('error', error.message || 'Failed to delete project');
    }
  };

  const handleTogglePublished = async (project: Project) => {
    setTogglingId(project.id);
    try {
      const { error } = await toggleProjectPublishedStatus(project.id, !project.is_published);
      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', `Project ${project.is_published ? 'unpublished' : 'published'} successfully`);
        fetchProjects();
      }
    } catch (error) {
      showNotification('error', 'Failed to update project status');
    } finally {
      setTogglingId(null);
    }
  };

  const handlePublishAll = async () => {
    setPublishingAll(true);
    try {
      const { error } = await publishAllProjects();
      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', 'All projects published successfully');
        fetchProjects();
      }
    } catch (error) {
      showNotification('error', 'Failed to publish all projects');
    } finally {
      setPublishingAll(false);
    }
  };

  const publishedProjects = projects.filter(p => p.is_published);

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

      {/* Published Projects Section */}
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
      ) : publishedProjects.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 text-center">
          <h3 className="text-white font-medium mb-2">No published projects yet</h3>
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
          {publishedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              handleTogglePublished={() => handleTogglePublished(project)}
              isToggling={togglingId === project.id}
              onDelete={handleDelete}
              onUpdate={fetchProjects}
            />
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl bg-[#1a1a1a] border border-[#333] text-white">
          <DialogTitle className="sr-only">Add New Project</DialogTitle>
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