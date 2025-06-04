import { ExperienceItem } from '@/lib/experience';

interface TimelineItemProps {
  item: ExperienceItem;
  isLast: boolean;
  index: number;
}

const TimelineItem = ({ item, isLast, index }: TimelineItemProps) => {
  const isStart = index % 2 === 0;
  const timelineBoxClass = isStart ? "timeline-start" : "timeline-end";

  return (
    <li>
      {!isStart && <hr />}
      <div className="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.698a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
      </div>
      <div className={`${timelineBoxClass} timeline-box bg-gray-800 p-4 rounded-lg`}>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          {item.company && (
            <span className="text-gray-400">{item.company}</span>
          )}
          {item.period && (
            <p className="text-sm text-gray-500 mt-1">{item.period}</p>
          )}
          {item.description && (
            <p className="text-gray-300 mt-2">{item.description}</p>
          )}
        </div>
      </div>
      {isStart && !isLast && <hr />}
    </li>
  );
};

export default TimelineItem;