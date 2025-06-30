"use client";

import { useState } from 'react';
import { skills, Skill } from '@/lib/skills';
import { cn } from '@/lib/utils';
import React from 'react';

type Category = 'frontend' | 'backend' | 'database' | 'devops';
type DisplayCategory = 'All' | 'Frontend' | 'Backend' | 'Database' | 'DevOps';

// SVG paths for skill icons would normally be here
// Using simplified placeholders for now

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState<DisplayCategory>('All');

  const categories: DisplayCategory[] = ['All', 'Frontend', 'Backend', 'Database', 'DevOps'];

  const normalizeCategory = (category: DisplayCategory): Category | 'all' => {
    return category.toLowerCase() as Category | 'all';
  };

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-medium text-white mb-4">
            Full Stack Expertise
          </h2>
          <p className="text-slate-400 text-lg">
            Comprehensive development capabilities across the entire stack
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-md transition-colors",
                activeCategory === category
                  ? "bg-[#0A0F1E] text-white border border-slate-800"
                  : "text-slate-400 hover:text-slate-300"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills
            .filter(skill => 
              activeCategory === 'All' || 
              skill.category.includes(normalizeCategory(activeCategory) as Category)
            )
            .map((skill) => (
              <div
                key={skill.name}
                className="bg-[#0A0F1E]/50 border border-slate-800/50 rounded-lg p-6 hover:border-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <skill.icon className="w-6 h-6 text-slate-300" />
              </div>
                  <h3 className="text-lg text-white">{skill.name}</h3>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skill.category.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-2 py-1 bg-slate-800/50 text-slate-400 rounded capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;