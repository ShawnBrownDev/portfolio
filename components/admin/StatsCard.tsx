'use client';

import { useEffect, useState } from 'react';
import { Layout, Eye, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/contexts/NotificationContext';

interface ProjectStats {
  totalProjects: number;
  totalViews: number;
  githubProjects: number;
}

export function StatsCard() {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    totalViews: 0,
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
          totalViews: 0, // You can implement view tracking later
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
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 animate-pulse">
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-8 bg-[#333] rounded w-1/3"></div>
              <div className="h-4 bg-[#333] rounded w-2/3"></div>
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
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: stats.totalViews,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Github,
      label: 'GitHub Projects',
      value: stats.githubProjects,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-white font-medium">{item.label}</h3>
                <p className="text-gray-400">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 