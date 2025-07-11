import { useEffect, useState, useCallback } from 'react';
import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { useNotification } from '@/contexts/NotificationContext';
import { toggleProjectPublishedStatus } from '@/lib/projects';

export function SettingsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }
      setProjects(data.filter((p: Project) => !p.is_published));
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleTogglePublished = async (project: Project) => {
    setTogglingId(project.id);
    try {
      const { error } = await toggleProjectPublishedStatus(project.id, true);
      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', 'Project published successfully');
        fetchProjects();
      }
    } catch (error) {
      showNotification('error', 'Failed to update project status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-yellow-400 mb-4">Draft Projects</h2>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-400">No draft projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              handleTogglePublished={() => handleTogglePublished(project)}
              isToggling={togglingId === project.id}
              onDelete={fetchProjects}
              onUpdate={fetchProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
} 