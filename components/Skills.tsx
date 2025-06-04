"use client";

import { useState } from 'react';
import { skills } from '@/lib/skills';
import { cn } from '@/lib/utils';

// SVG paths for skill icons would normally be here
// Using simplified placeholders for now

const Skills = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Skills</h2>
          <span className="text-gray-400">Featured</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={cn(
                "flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-700",
                activeSkill === skill.name && "ring-2 ring-primary"
              )}
              onMouseEnter={() => setActiveSkill(skill.name)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                {/* This would be replaced with actual skill icons */}
                <span className="text-2xl font-bold">{skill.icon}</span>
              </div>
              <span className="text-sm font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;