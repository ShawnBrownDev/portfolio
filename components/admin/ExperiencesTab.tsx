"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getExperiences, addExperience, updateExperience, deleteExperience, ExperienceItem, ExperienceItemInput } from '@/lib/experience';
import { useNotification } from '@/contexts/NotificationContext';

const ExperiencesTab = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { showNotification } = useNotification();

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      showNotification('error', 'Error fetching experiences');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const [formData, setFormData] = useState<ExperienceItemInput>({
    title: '',
    company: '',
    period: '',
    description: '',
    order_index: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      title: '',
      company: '',
      period: '',
      description: '',
      order_index: experiences.length
    });
  };

  const handleEdit = (experience: ExperienceItem) => {
    setEditingId(experience.id);
    setIsAdding(false);
    setFormData({
      title: experience.title,
      company: experience.company,
      period: experience.period,
      description: experience.description || '',
      order_index: experience.order_index
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateExperience(editingId, formData);
        showNotification('success', 'Experience updated successfully');
        setEditingId(null);
      } else if (isAdding) {
        await addExperience(formData);
        showNotification('success', 'Experience added successfully');
        setIsAdding(false);
      }
      setFormData({ title: '', company: '', period: '', description: '', order_index: 0 });
      fetchExperiences();
    } catch (error) {
      showNotification('error', 'Error saving experience');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', company: '', period: '', description: '', order_index: 0 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id);
        showNotification('success', 'Experience deleted successfully');
        if (editingId === id) {
          setEditingId(null);
          setFormData({ title: '', company: '', period: '', description: '', order_index: 0 });
        }
        fetchExperiences();
      } catch (error) {
        showNotification('error', 'Error deleting experience');
      }
    }
  };

  const handleChange = (field: keyof ExperienceItemInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading experiences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Experience Management</h2>
          <p className="text-gray-400 mt-1">Manage your professional experience timeline</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus size={16} />
          Add Experience
        </Button>
      </div>

      {/* Add New Experience Form */}
      {isAdding && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Add New Experience</h3>
            <p className="text-gray-400 text-sm">Fill in the experience details below</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Senior Developer"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="e.g., Tech Company"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Period</label>
                <Input
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  placeholder="e.g., 2020-2023"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Display Order</label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
                  placeholder="Display order"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Optional description of your role and achievements"
                rows={3}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Save size={16} />
                Add Experience
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                <X size={16} />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Experiences List */}
      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-200">
            {editingId === experience.id ? (
              // Edit Mode - Inline Form
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white">Edit Experience</h3>
                  <p className="text-gray-400 text-sm">Update the experience details below</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., Senior Developer"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="e.g., Tech Company"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Period</label>
                    <Input
                      value={formData.period}
                      onChange={(e) => handleChange('period', e.target.value)}
                      placeholder="e.g., 2020-2023"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Display Order</label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
                      placeholder="Display order"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Optional description of your role and achievements"
                    rows={3}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Save size={16} />
                    Update Experience
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode - Display Card
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-white">{experience.title}</h3>
                    <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                      Order: {experience.order_index}
                    </span>
                  </div>
                  <p className="text-gray-300 font-medium">{experience.company}</p>
                  <p className="text-sm text-gray-400 mt-1">{experience.period}</p>
                  {experience.description && (
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">{experience.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                    className="flex items-center gap-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                    className="flex items-center gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {experiences.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No experiences yet</h3>
          <p className="text-gray-400 mb-4">Add your first experience to start building your timeline</p>
          <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Add Your First Experience
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExperiencesTab; 