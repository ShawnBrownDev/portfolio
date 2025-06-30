'use client';

import React from 'react';
import { ExperienceItem } from '@/lib/experience';
import { motion } from 'framer-motion';

interface TimelineItemProps {
  item: ExperienceItem;
  isLast: boolean;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative flex items-start mb-12 last:mb-0"
    >
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-2.5 top-3 w-[1px] h-[calc(100%+24px)] bg-blue-500/20" />
      )}

      {/* Timeline Node */}
      <div className="relative z-10">
        <div className="w-5 h-5 rounded-full bg-[#0A0F1E] border border-blue-500/20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/30" />
        </div>
      </div>

      {/* Content */}
      <div className="ml-6 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base text-white">
            {item.title}
          </h3>
          <span className="text-sm text-slate-200 bg-[#0A0F1E] px-3 py-0.5 rounded-[4px]">
            {item.period}
          </span>
        </div>
        
        <span className="block text-sm text-slate-300 mt-1.5">
          {item.company}
        </span>
      </div>
    </motion.div>
  );
};

export default TimelineItem;