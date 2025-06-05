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
              I am a full stack developer with 4 years of experience in designing and building scalable web applications.
            </p>
          </div>
          {/* Timeline Section */}
          <div className="space-y-4">
            <ul className="timeline timeline-vertical">
              {experiences.map((experience, index) => (
                <TimelineItem 
                  key={experience.id}
                  item={experience}
                  isLast={index === experiences.length - 1}
                  index={index}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;