"use client";

import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { skills, Skill, Category } from '@/lib/skills';

const AnimatedSkills = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const controls = useAnimation();
  const ref = useRef(null);

  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter((skill: Skill) => 
        skill.category.includes(selectedCategory as Category)
      );

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Full Stack Expertise</h2>
          <p className="text-gray-400">Comprehensive development capabilities across the entire stack</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 px-4">
          {[
            { id: 'all', label: 'All Skills' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'database', label: 'Database' },
            { id: 'mobile', label: 'Mobile' },
            { id: 'devops', label: 'DevOps' },
            { id: 'tools', label: 'Tools' }
          ].map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id as Category | 'all')}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ 
            minHeight: '600px',
            contain: 'layout style paint'
          }}
        >
          {filteredSkills.map((skill: Skill) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-lg p-6 relative overflow-hidden group"
              style={{ 
                minHeight: '200px',
                contain: 'layout style paint'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <skill.icon className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                </div>
                <p className="text-gray-400">{skill.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  {skill.category.map((cat, index) => (
                     <span
                       key={index}
                       className="text-xs px-2 py-1 rounded-full bg-gray-700 text-white-300"
                     >
                       {cat}
                     </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedSkills; 