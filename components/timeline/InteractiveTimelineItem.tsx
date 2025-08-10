'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Building2, ChevronDown, ChevronUp, 
  TrendingUp, Trophy, Code, Target, ExternalLink 
} from 'lucide-react';
import { EnhancedExperience } from '@/types/timeline';
import SkillProgressBar from './SkillProgressBar';
import ProjectMiniCard from './ProjectMiniCard';

interface InteractiveTimelineItemProps {
  experience: EnhancedExperience;
  isLast: boolean;
  index: number;
  onSkillClick?: (skillName: string) => void;
}

const InteractiveTimelineItem: React.FC<InteractiveTimelineItemProps> = ({ 
  experience, 
  isLast, 
  index,
  onSkillClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'projects' | 'achievements'>('skills');

  const hasSkills = experience.skill_progressions && experience.skill_progressions.length > 0;
  const hasProjects = experience.projects && experience.projects.length > 0;
  const hasAchievements = experience.achievements && experience.achievements.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex-shrink-0 w-80"
    >
      <div className="relative">
        {/* Timeline Line */}
        {!isLast && (
          <div className="absolute top-6 left-full w-8 h-0.5 bg-gradient-to-r from-blue-600/60 to-transparent z-0" />
        )}

        {/* Experience Type Icon */}
        <div className="absolute top-2 left-2 z-10">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            experience.experience_type === 'work' ? 'bg-blue-600 text-white' :
            experience.experience_type === 'learning' ? 'bg-green-600 text-white' :
            experience.experience_type === 'project' ? 'bg-purple-600 text-white' :
            'bg-yellow-600 text-white'
          }`}>
            {experience.experience_type === 'work' ? '💼' :
             experience.experience_type === 'learning' ? '📚' :
             experience.experience_type === 'project' ? '🚀' : '🏆'}
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div 
          className="mt-8 bg-slate-900/50 border border-slate-800/50 rounded-lg overflow-hidden hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
          whileHover={{ y: -2 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header Section */}
          <div className="p-5">
            <div className="text-center mb-4">
              {/* Period Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1.5 mb-3">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-300">{experience.period}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {experience.title}
              </h3>
              
              {/* Company */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>{experience.company}</span>
              </div>
            </div>
            
            {/* Description */}
            {experience.description && (
              <p className="text-slate-300 text-sm leading-relaxed text-center mb-4">
                {experience.description}
              </p>
            )}

            {/* Quick Stats */}
            <div className="flex justify-center gap-4 text-xs">
              {hasSkills && (
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{experience.skill_progressions?.length} skills</span>
                </div>
              )}
              {hasProjects && (
                <div className="flex items-center gap-1 text-purple-400">
                  <Code className="w-3 h-3" />
                  <span>{experience.projects?.length} projects</span>
                </div>
              )}
              {hasAchievements && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Trophy className="w-3 h-3" />
                  <span>{experience.achievements?.length} achievements</span>
                </div>
              )}
            </div>

            {/* Expand/Collapse Button */}
            <div className="flex justify-center mt-4">
              <motion.button
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                animate={{ rotate: isExpanded ? 180 : 0 }}
              >
                <ChevronDown className="w-4 h-4" />
                <span>{isExpanded ? 'Less' : 'Explore'}</span>
              </motion.button>
            </div>
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-800/50"
              >
                {/* Tabs */}
                <div className="flex border-b border-slate-800/50">
                  {hasSkills && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('skills');
                      }}
                      className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'skills' 
                          ? 'text-blue-400 border-b-2 border-blue-400' 
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Skills Growth
                    </button>
                  )}
                  {hasProjects && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('projects');
                      }}
                      className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'projects' 
                          ? 'text-blue-400 border-b-2 border-blue-400' 
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Projects
                    </button>
                  )}
                  {hasAchievements && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('achievements');
                      }}
                      className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'achievements' 
                          ? 'text-blue-400 border-b-2 border-blue-400' 
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Impact
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {activeTab === 'skills' && hasSkills && (
                      <motion.div
                        key="skills"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-3"
                      >
                        {experience.skill_progressions?.map((skill) => (
                          <SkillProgressBar 
                            key={skill.id} 
                            skill={skill} 
                            onClick={() => onSkillClick?.(skill.skill_name)}
                          />
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'projects' && hasProjects && (
                      <motion.div
                        key="projects"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-3"
                      >
                        {experience.projects?.map((project) => (
                          <ProjectMiniCard key={project.id} project={project} />
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'achievements' && hasAchievements && (
                      <motion.div
                        key="achievements"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-2"
                      >
                        {experience.achievements?.map((achievement) => (
                          <AchievementBadge key={achievement.id} achievement={achievement} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveTimelineItem; 