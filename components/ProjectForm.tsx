'use client';

import { useState, useEffect } from 'react';
import { addProject, getCategories, updateProject } from '@/lib/projects';
import type { Project, Category } from '@/lib/projects';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNotification } from '@/contexts/NotificationContext';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { TagInput } from './ui/tag-input';
import { TECHNOLOGY_TAGS } from '@/lib/constants';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ProjectFormData = Omit<Project, 'id' | 'user_id' | 'created_at' | 'is_published'> & {
  selectedCategoryIds: string[];
};

interface ProjectFormProps {
  project?: Project;
  onClose?: () => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const initialFormState: Omit<Project, 'id' | 'user_id' | 'created_at' | 'is_published'> & { selectedCategoryIds: string[] } = {
    title: '',
    description: '',
    image: '',
    demourl: null,
    githuburl: null,
    challenges: null,
    solutions: null,
    impact: null,
    additionalimages: null,
    tags: null,
    selectedCategoryIds: []
};

export default function ProjectForm({ project, onClose, onSuccess, mode = 'create' }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(initialFormState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Initialize form with project data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && project) {
      setForm({
        ...project,
        selectedCategoryIds: [], // You'll need to map the categories from your project data
      });
      setPreviewImage(project.image);
    }
  }, [project, mode]);

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };
    loadCategories();
  }, []);

  // Preview main image when URL changes
  useEffect(() => {
    if (form.image) {
      const img = document.createElement('img');
      img.onload = () => setPreviewImage(form.image);
      img.onerror = () => setPreviewImage(null);
      img.src = form.image;
    } else {
      setPreviewImage(null);
    }
  }, [form.image]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'challenges' || name === 'solutions' || name === 'additionalimages') {
      setForm(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setForm(prev => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.includes(categoryId)
        ? prev.selectedCategoryIds.filter(id => id !== categoryId)
        : [...prev.selectedCategoryIds, categoryId]
    }));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      showNotification('error', 'Project title is required');
      return false;
    }
    if (!form.description.trim()) {
      showNotification('error', 'Project description is required');
      return false;
    }
    if (!form.image.trim()) {
      showNotification('error', 'Main image URL is required');
      return false;
    }
    if (form.selectedCategoryIds.length === 0) {
      showNotification('error', 'Please select at least one category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      const { selectedCategoryIds, ...projectData } = form;
      let error;

      if (mode === 'edit' && project) {
        ({ error } = await updateProject(project.id, projectData, selectedCategoryIds));
      } else {
        ({ error } = await addProject(projectData, selectedCategoryIds));
      }
      
      if (error) throw error;

      showNotification('success', `Project ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
      
      if (mode === 'create') {
        setForm(initialFormState);
        setPreviewImage(null);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} project`);
      showNotification('error', err.message || `Failed to ${mode} project`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {mode === 'edit' ? 'Edit Project' : 'Add New Project'}
        </h2>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Form inputs */}
        <div className="space-y-4">
      <div>
            <label className="block text-sm font-medium mb-1 text-white">Project Title *</label>
        <input
          name="title"
              placeholder="Enter project title"
          value={form.title}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
          required
        />
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Description *</label>
        <textarea
          name="description"
              placeholder="Describe your project"
          value={form.description}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors min-h-[120px]"
          required
        />
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Main Image URL *</label>
        <input
          name="image"
              placeholder="Enter image URL"
          value={form.image}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
          required
        />
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Categories *</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map(category => (
            <Badge
              key={category.id}
              variant={form.selectedCategoryIds.includes(category.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-[#333] transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Tags</label>
            <TagInput
              value={form.tags || []}
              onChange={(newTags) => setForm(prev => ({ ...prev, tags: newTags }))}
              placeholder="Add technologies used..."
              suggestions={TECHNOLOGY_TAGS}
        />
      </div>

          <div className="grid grid-cols-2 gap-4">
      <div>
              <label className="block text-sm font-medium mb-1 text-white">Demo URL</label>
        <input
          name="demourl"
                placeholder="https://..."
          value={form.demourl || ''}
          onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
        />
      </div>
      <div>
              <label className="block text-sm font-medium mb-1 text-white">GitHub URL</label>
        <input
          name="githuburl"
                placeholder="https://github.com/..."
          value={form.githuburl || ''}
          onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
        />
            </div>
          </div>
      </div>

        {/* Right column - Additional fields and preview */}
        <div className="space-y-4">
      <div>
            <label className="block text-sm font-medium mb-1 text-white">Challenges</label>
            <textarea
          name="challenges"
              placeholder="List the main challenges (comma-separated)"
          value={form.challenges?.join(', ') || ''}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors min-h-[80px]"
        />
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Solutions</label>
            <textarea
          name="solutions"
              placeholder="List your solutions (comma-separated)"
          value={form.solutions?.join(', ') || ''}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors min-h-[80px]"
        />
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Project Impact</label>
        <textarea
          name="impact"
              placeholder="Describe the project's impact"
          value={form.impact || ''}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors min-h-[80px]"
        />
      </div>

      <div>
            <label className="block text-sm font-medium mb-1 text-white">Additional Images</label>
        <input
          name="additionalimages"
              placeholder="Additional image URLs (comma-separated)"
          value={form.additionalimages?.join(', ') || ''}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Image preview */}
          {previewImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-white">Image Preview</label>
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#333]">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              setForm(initialFormState);
            }
          }}
          disabled={loading}
        >
          {onClose ? 'Cancel' : 'Clear Form'}
        </Button>
      <Button
        type="submit"
        disabled={loading}
          className="bg-white text-black hover:bg-gray-100"
      >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'edit' ? 'Updating Project...' : 'Adding Project...'}
            </>
          ) : (
            mode === 'edit' ? 'Update Project' : 'Add Project'
          )}
      </Button>
      </div>
    </form>
  );
}
