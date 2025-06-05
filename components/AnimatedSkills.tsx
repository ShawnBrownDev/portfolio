"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaJs, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiNextdotjs } from 'react-icons/si';
import { IconType } from 'react-icons';
import { skills, Skill } from '@/lib/skills';

const AnimatedSkills = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
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
    : skills.filter((skill: Skill) => skill.category === selectedCategory);

  return (
    <section className="py-20 bg-gray-900/50">
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

        <div className="flex justify-center gap-4 mb-12">
          {['all', 'frontend', 'backend', 'database', 'devops'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredSkills.map((skill: Skill) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <skill.icon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">{skill.name}</h3>
                  </div>
                  <p className="text-gray-400">{skill.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {skill.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedSkills; 