'use client';

import { useState, useEffect, useRef } from 'react';
import { addProject, getCategories, updateProject } from '@/lib/projects';
import type { Project, Category } from '@/lib/projects';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNotification } from '@/contexts/NotificationContext';
import { Loader2, X, Upload, Image as ImageIcon, Link } from 'lucide-react';
import Image from 'next/image';
import { TagInput } from './ui/tag-input';
import { TECHNOLOGY_TAGS } from '@/lib/constants';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

type ProjectFormData = Omit<Project, 'id' | 'user_id' | 'created_at' | 'is_published'> & {
  selectedCategoryIds: string[];
};

interface ProjectFormProps {
  project?: Project;
  onClose?: () => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const initialFormState: Omit<Project, 'id' | 'user_id' | 'created_at'> & { selectedCategoryIds: string[] } = {
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
    is_published: false,
    selectedCategoryIds: []
};

export default function ProjectForm({ project, onClose, onSuccess, mode = 'create' }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData & { is_published: boolean }>(
    project ? { ...project, selectedCategoryIds: [], is_published: project.is_published ?? false } : { ...initialFormState, is_published: false }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [additionalImagesInputMode, setAdditionalImagesInputMode] = useState<'url' | 'upload'>('url');
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState(false);
  const additionalImagesFileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useNotification();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<null | (() => void)>(null);

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
    const { name, value, type } = e.target;
    if (name === 'is_published' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, is_published: checked }));
    } else if (name === 'challenges' || name === 'solutions') {
      setForm(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean)
      }));
    } else if (name === 'additionalimages') {
      // Handle additional images as comma-separated URLs
      const urls = value.split(',').map(item => item.trim()).filter(Boolean);
      setForm(prev => ({
        ...prev,
        additionalimages: urls.length > 0 ? urls : null
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

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showNotification('error', 'File too large. Maximum size is 5MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setForm(prev => ({ ...prev, image: data.url }));
      showNotification('success', 'Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      showNotification('error', error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdditionalImagesUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        showNotification('error', `Invalid file type for ${file.name}. Only JPEG, PNG, and WebP images are allowed.`);
        return;
      }
      if (file.size > maxSize) {
        showNotification('error', `File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
    }

    setUploadingAdditionalImages(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        uploadedUrls.push(data.url);
      }

      const currentImages = form.additionalimages || [];
      setForm(prev => ({ 
        ...prev, 
        additionalimages: [...currentImages, ...uploadedUrls]
      }));
      showNotification('success', `${files.length} image(s) uploaded successfully!`);
    } catch (error: any) {
      console.error('Upload error:', error);
      showNotification('error', error.message || 'Failed to upload images');
    } finally {
      setUploadingAdditionalImages(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleAdditionalImagesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleAdditionalImagesUpload(files);
    }
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
      showNotification('error', 'Main image is required');
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
    setShowPublishDialog(true);
  };
    
  const handlePublishChoice = async (publish: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { selectedCategoryIds, ...projectData } = form;
      

      
      let error;
      if (mode === 'edit' && project) {
        ({ error } = await updateProject(project.id, { ...projectData, is_published: publish }, selectedCategoryIds));
      } else {
        ({ error } = await addProject({ ...projectData, is_published: publish }, selectedCategoryIds));
      }
      if (error) throw error;
      showNotification('success', `Project ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
      if (mode === 'create') {
        setForm({ ...initialFormState, is_published: false });
        setPreviewImage(null);
        setAdditionalImagesInputMode('url');
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} project`);
      showNotification('error', err.message || `Failed to ${mode} project`);
    } finally {
      setLoading(false);
      setShowPublishDialog(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
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

          {/* Enhanced Image Input */}
      <div>
            <label className="block text-sm font-medium mb-1 text-white">Main Image *</label>
            
            {/* Input Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={imageInputMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageInputMode('url')}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                URL
              </Button>
              <Button
                type="button"
                variant={imageInputMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageInputMode('upload')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>

            {imageInputMode === 'url' ? (
        <input
          name="image"
              placeholder="Enter image URL"
          value={form.image}
          onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
          required
        />
            ) : (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center hover:border-white transition-colors cursor-pointer"
                     onClick={() => fileInputRef.current?.click()}>
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-white">Uploading...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <div className="text-white">
                        <p className="font-medium">Click to upload image</p>
                        <p className="text-sm text-gray-400">JPEG, PNG, WebP up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {form.image && imageInputMode === 'upload' && (
                  <div className="text-sm text-gray-400">
                    Current image: {form.image.split('/').pop()}
                  </div>
                )}
              </div>
            )}
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
            
            {/* Input Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={additionalImagesInputMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAdditionalImagesInputMode('url')}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                URL
              </Button>
              <Button
                type="button"
                variant={additionalImagesInputMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAdditionalImagesInputMode('upload')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>

            {additionalImagesInputMode === 'url' ? (
              <input
                name="additionalimages"
                placeholder="Additional image URLs (comma-separated)"
                value={form.additionalimages?.join(', ') || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
              />
            ) : (
              <div className="space-y-3">
                <input
                  ref={additionalImagesFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesInputChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center hover:border-white transition-colors cursor-pointer"
                     onClick={() => additionalImagesFileInputRef.current?.click()}>
                  {uploadingAdditionalImages ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-white">Uploading...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <div className="text-white">
                        <p className="font-medium">Click to upload images</p>
                        <p className="text-sm text-gray-400">JPEG, PNG, WebP up to 5MB each</p>
                        <p className="text-xs text-gray-500">You can select multiple files</p>
                      </div>
                    </div>
                  )}
                </div>
                {form.additionalimages && form.additionalimages.length > 0 && additionalImagesInputMode === 'upload' && (
                  <div className="text-sm text-gray-400">
                    Current images: {form.additionalimages.length} uploaded
                  </div>
                )}
              </div>
            )}

            {/* Display current additional images */}
            {form.additionalimages && form.additionalimages.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-2 text-white">Current Additional Images</label>
                <div className="grid grid-cols-2 gap-2">
                  {form.additionalimages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#333]">
                        <Image
                          src={imageUrl}
                          alt={`Additional image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = form.additionalimages?.filter((_, i) => i !== index) || [];
                          setForm(prev => ({ 
                            ...prev, 
                            additionalimages: newImages.length > 0 ? newImages : null 
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              setForm({ ...initialFormState, is_published: false });
              setAdditionalImagesInputMode('url');
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

      {/* Publish confirmation dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="bg-[#1a1a1a] border border-[#333] text-white">
          <DialogHeader>
            <DialogTitle>Publish Project?</DialogTitle>
          </DialogHeader>
          <p>Do you want to publish this project immediately? You can always unpublish it later.</p>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => handlePublishChoice(false)}
            >
              Save as Draft
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => handlePublishChoice(true)}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
