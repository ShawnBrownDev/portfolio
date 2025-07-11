'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectsTab } from '@/components/admin/ProjectsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import { UserInfoCard } from '@/components/admin/UserInfoCard';
import { StatsCard } from '@/components/admin/StatsCard';
import { Navbar } from '@/components/admin/Navbar';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardPage() {
  const supabase = createClientComponentClient();

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-black">
        <Navbar supabase={supabase} />
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UserInfoCard />
              <div className="md:col-span-2">
                <StatsCard />
              </div>
            </div>

            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="bg-[#1a1a1a] border border-[#333]">
                <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Unpublished Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <ProjectsTab />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
} 