'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectsTab } from '@/components/admin/ProjectsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import ExperiencesTab from '@/components/admin/ExperiencesTab';
import { UserInfoCard } from '@/components/admin/UserInfoCard';
import { StatsCard } from '@/components/admin/StatsCard';
import { Navbar } from '@/components/admin/Navbar';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { createBrowserClient } from '@supabase/ssr';


export default function DashboardPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar supabase={supabase} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your portfolio content and settings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <UserInfoCard />
            <div className="lg:col-span-2">
              <StatsCard />
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <Tabs defaultValue="projects" className="space-y-6">
              <div className="border-b border-gray-800">
                <TabsList className="bg-transparent border-0 p-0 h-auto w-full sm:w-auto">
                  <TabsTrigger 
                    value="projects" 
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg flex-1 sm:flex-none px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    📁 Projects
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg flex-1 sm:flex-none px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    ⚙️ Unpublished
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experiences" 
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg flex-1 sm:flex-none px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    📈 Experience
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="pt-4">
                <TabsContent value="projects" className="mt-0">
                  <ProjectsTab />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <SettingsTab />
                </TabsContent>

                <TabsContent value="experiences" className="mt-0">
                  <ExperiencesTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
} 