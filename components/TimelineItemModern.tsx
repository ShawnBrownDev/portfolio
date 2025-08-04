'use client';

import React from 'react';
import { ExperienceItem } from '@/lib/experience';
import { motion } from 'framer-motion';
import { Calendar, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineItemProps {
  item: ExperienceItem;
  isLast: boolean;
  index: number;
}

const TimelineItemModern: React.FC<TimelineItemProps> = ({ item, isLast, index }) => {
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
        


        {/* Content Card */}
        <div className="mt-8 bg-slate-900/50 border border-slate-800/50 rounded-lg p-5 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg">
          <div className="text-center mb-4">
            {/* Period Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1.5 mb-3">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">{item.period}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2">
              {item.title}
            </h3>
            
            {/* Company */}
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>{item.company}</span>
            </div>
          </div>
          
          {/* Description */}
          {item.description && (
            <p className="text-slate-300 text-sm leading-relaxed text-center">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineItemModern; 