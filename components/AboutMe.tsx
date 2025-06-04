import { experiences } from '@/lib/experience';
import TimelineItem from './TimelineItem';

const AboutMe = () => {
  return (
    <section id="about" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-12">About Me</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bio Section */}
          <div className="space-y-6">
            <p className="text-lg text-gray-300">
              I am a full stack developer with 8+ years of experience in designing and building scalable web applications.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-md">
                <span className="text-xl font-bold">JS</span>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-md">
                <span className="text-xl font-bold">TS</span>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8M8 12h8"></path>
                </svg>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                  <line x1="12" y1="22" x2="12" y2="15.5"></line>
                  <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                </svg>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                </svg>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <TimelineItem 
                key={experience.id}
                item={experience}
                isLast={index === experiences.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;