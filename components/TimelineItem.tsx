'use client';

import React from 'react';
import { ExperienceItem } from '@/lib/experience';
import { motion } from 'framer-motion';
import { Calendar, Building2, MapPin } from 'lucide-react';

interface TimelineItemProps {
  item: ExperienceItem;
  isLast: boolean;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      className="relative group"
    >
      {/* Professional Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600/60 via-slate-600/30 to-transparent" />
      
      {/* Professional Timeline Node */}
      <div className="absolute left-5 top-8 w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-slate-900 shadow-lg group-hover:scale-125 transition-all duration-300">
        <div className="absolute inset-0.5 rounded-full bg-blue-400/30 animate-pulse" />
      </div>

      {/* Content Container */}
      <div className="ml-12 mb-10">
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-blue-600/40 transition-all duration-300"
        >
          {/* Professional Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{item.company}</span>
              </div>
            </div>
            
            {/* Professional Period Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-600/30 rounded-lg px-3 py-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300 tracking-wide">{item.period}</span>
            </div>
          </div>

          {/* Professional Description */}
          {item.description && (
            <div className="mb-4">
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          )}

          {/* Professional Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          
          {/* Professional Corner Accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-600/10 to-transparent rounded-xl pointer-events-none" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimelineItem;