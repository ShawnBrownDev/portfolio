'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Building2, ChevronDown, ChevronUp
} from 'lucide-react';
import { EnhancedExperience } from '@/types/timeline';

interface InteractiveTimelineItemProps {
  experience: EnhancedExperience;
  isLast: boolean;
  index: number;
}

const InteractiveTimelineItem: React.FC<InteractiveTimelineItemProps> = ({ 
  experience, 
  isLast, 
  index
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-blue-600 text-white">
            💼
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
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-800/50 p-4"
            >
              <div className="text-center text-slate-400 text-sm">
                <p>Experience details coming soon...</p>
                <p className="mt-2 text-xs">This will include skills, projects, and achievements</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveTimelineItem; 