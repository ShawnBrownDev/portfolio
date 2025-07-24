'use client';

import { useEffect, useState } from 'react';
import { Layout, Eye, Github, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/contexts/NotificationContext';

interface ProjectStats {
  totalProjects: number;
  publishedProjects: number;
  unpublishedProjects: number;
  githubProjects: number;
}

export function StatsCard() {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    publishedProjects: 0,
    unpublishedProjects: 0,
    githubProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) {
        showNotification('error', 'Supabase client is not configured.');
        return;
      }

      try {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;

        const stats = {
          totalProjects: projects?.length || 0,
          publishedProjects: projects?.filter(p => p.is_published)?.length || 0,
          unpublishedProjects: projects?.filter(p => !p.is_published)?.length || 0,
          githubProjects: projects?.filter(p => p.githuburl)?.length || 0
        };

        setStats(stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
        showNotification('error', 'Failed to fetch project statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [showNotification]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-700 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: Layout,
      label: 'Total Projects',
      value: stats.totalProjects,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Eye,
      label: 'Published',
      value: stats.publishedProjects,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: TrendingUp,
      label: 'Unpublished',
      value: stats.unpublishedProjects,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      icon: Github,
      label: 'GitHub Projects',
      value: stats.githubProjects,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg mb-1">Portfolio Statistics</h3>
        <p className="text-gray-400 text-sm">Overview of your portfolio content</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
              <div className="text-gray-400 text-sm font-medium">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 