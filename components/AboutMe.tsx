import { experiences } from '@/lib/experience';
import TimelineItem from './TimelineItem';

const AboutMe = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-medium mb-12 text-white">
          About Me
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* Bio Section */}
          <div className="space-y-12">
            <div className="space-y-8">
              <p className="text-lg leading-relaxed text-slate-200">
              I am a full stack developer with 4 years of experience in designing and building scalable web applications.
                My approach goes beyond just writing code; I focus on creating robust, efficient, and maintainable
                solutions that solve real-world problems and provide tangible business value.
            </p>
              <p className="text-lg leading-relaxed text-slate-200">
                I am deeply passionate about learning new technologies and continuously improving my skills to stay
                ahead in the ever-evolving tech landscape. I thrive on tackling complex challenges and am committed to
                delivering high-quality software that makes a difference.
            </p>
            </div>

            {/* Tech Focus Areas */}
            <div className="space-y-5">
              <h3 className="text-base text-white tracking-wide">
                TECHNICAL FOCUS
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {[
                  'Full Stack Development',
                  'React & Next.js',
                  'TypeScript',
                  'Tailwind CSS',
                  'UI/UX Design'
                ].map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-1.5 text-sm bg-[#0A0F1E] text-slate-200 rounded-[4px] border border-slate-800/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div>
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
    </section>
  );
};

export default AboutMe;