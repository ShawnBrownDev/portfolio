'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-yellow-600/30 rounded-full flex items-center justify-center">
          <Trophy className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-yellow-200 truncate">
          {achievement.title}
        </h4>
        {achievement.description && (
          <p className="text-xs text-yellow-300/80 mt-1 leading-relaxed">
            {achievement.description}
          </p>
        )}
        {achievement.date && (
          <span className="text-xs text-yellow-400/60 mt-1 block">
            {achievement.date}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementBadge; 