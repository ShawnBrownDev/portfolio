'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkillProgression {
  skill_name: string;
  level: number;
  months_experience: number;
}

interface SkillProgressBarProps {
  skill: SkillProgression;
  onClick?: () => void;
}

const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ skill, onClick }) => {
  const progressPercentage = Math.min((skill.level / 10) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-lg p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{skill.skill_name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-400">Level {skill.level}</span>
          <span className="text-xs text-slate-400">{skill.months_experience}mo</span>
        </div>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default SkillProgressBar; 