"use client";

import { useEffect, useState } from 'react';
import { getExperiences, ExperienceItem } from '@/lib/experience';
import TimelineItem from '@/components/timeline/TimelineItemModern';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AboutMe = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-medium mb-12 text-white text-center">
          About Me
        </h2>

        {/* About Me Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-slate-200 font-light">
              I am a full stack developer with 4 years of experience in designing and building scalable web applications.
              My approach goes beyond just writing code; I focus on creating robust, efficient, and maintainable
              solutions that solve real-world problems and provide tangible business value.
            </p>
            <p className="text-lg leading-relaxed text-slate-200 font-light">
              I am deeply passionate about learning new technologies and continuously improving my skills to stay
              ahead in the ever-evolving tech landscape. I thrive on tackling complex challenges and am committed to
              delivering high-quality software that makes a difference.
            </p>
          </div>

          {/* Technical Expertise */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Technical Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                'Full Stack Development',
                'React & Next.js',
                'TypeScript',
                'Tailwind CSS',
                'UI/UX Design'
              ].map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 text-sm bg-slate-900/80 text-slate-200 rounded-lg border border-slate-700/50 hover:border-blue-600/50 transition-colors font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Experience Section */}
        <div className="mt-20">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Loading experience timeline...</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Experience Section Header */}
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Professional Experience
                  </h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
                </div>
                
                {/* Horizontal Timeline Container */}
                <div className="relative">
                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={() => {
                        const container = document.getElementById('timeline-container');
                        if (container) {
                          container.scrollBy({ left: -400, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="text-sm font-medium">Previous</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        const container = document.getElementById('timeline-container');
                        if (container) {
                          container.scrollBy({ left: 400, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span className="text-sm font-medium">Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Scrollable Timeline */}
                  <div className="relative">
                    <div 
                      id="timeline-container"
                      className="flex gap-8 overflow-x-auto scrollbar-hide pb-8"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {experiences.map((experience, index) => (
                        <TimelineItem 
                          key={experience.id}
                          item={experience}
                          isLast={index === experiences.length - 1}
                          index={index}
                        />
                      ))}
                    </div>
                    

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;