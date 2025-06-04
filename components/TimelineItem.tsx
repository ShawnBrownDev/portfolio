import { ExperienceItem } from '@/lib/experience';

interface TimelineItemProps {
  item: ExperienceItem;
  isLast: boolean;
}

const TimelineItem = ({ item, isLast }: TimelineItemProps) => {
  return (
    <div className="flex">
      {/* Timeline Line and Dot */}
      <div className="flex flex-col items-center mr-4">
        <div className="w-3 h-3 bg-white rounded-full mt-1.5"></div>
        {!isLast && <div className="w-px h-full bg-gray-700 mt-1"></div>}
      </div>

      {/* Timeline Content */}
      <div className="pb-8">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          {item.company && (
            <span className="text-gray-400">{item.company}</span>
          )}
        </div>
        {item.period && (
          <p className="text-sm text-gray-500 mt-1">{item.period}</p>
        )}
        {item.description && (
          <p className="text-gray-300 mt-2">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;