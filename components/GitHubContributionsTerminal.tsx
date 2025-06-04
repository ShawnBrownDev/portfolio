'use client';

import React, { useEffect, useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { qna, QnaItem } from '@/lib/answers';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: { [year: string]: number };
  contributions: ContributionDay[];
}

interface TerminalOutput {
  type: 'command' | 'output' | 'error';
  text: string | JSX.Element;
}

const GitHubContributionsTerminal: React.FC<{ username: string }> = ({ username }) => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the component mounts or output changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Scroll to the bottom of the terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data: ContributionData = await response.json();
      setContributionData(data);
      return data;
    } catch (e: any) {
      console.error("Failed to fetch contributions:", e);
      setError(e.message || 'Failed to fetch contributions.');
      setOutput(prev => [...prev, { type: 'error', text: `Error fetching contributions: ${e.message || 'Unknown error'}` }]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const renderContributionGrid = (contributions: ContributionDay[]) => {
    // Basic grid display (mimicking the calendar view)
    const grid = contributions.map(day => (
      <div
        key={day.date}
        className={`w-3 h-3 m-px rounded-sm 
          ${day.level === 0 ? 'bg-gray-800' :
           day.level === 1 ? 'bg-green-900' :
           day.level === 2 ? 'bg-green-700' :
           day.level === 3 ? 'bg-green-500' :
           'bg-green-400'}
        `}
        title={`${day.date}: ${day.count} contributions`}
      />
    ));

    return <div className="flex flex-wrap py-2">{grid}</div>;
  };

  const handleCommand = async (command: string) => {
    setOutput(prev => [...prev, { type: 'command', text: `$ ${command}` }]);
    setInput(''); // Clear input after command

    const [cmd, ...args] = command.trim().split(' ');

    switch (cmd) {
      case 'help':
        setOutput(prev => [
          ...prev,
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '- help: Show this command list' },
          { type: 'output', text: '- github: Display GitHub contribution graph' },
          { type: 'output', text: '- clear: Clear the terminal output' },
          { type: 'output', text: '- echo <text>: Echo the provided text' },
          { type: 'output', text: '- ask <question>: Get an answer to a predefined question' },
          // Add future game commands here
        ]);
        break;
      case 'github':
        if (contributionData) {
          setOutput(prev => [...prev, { type: 'output', text: renderContributionGrid(contributionData.contributions) }]);
        } else if (!loading) {
           // Fetch if not already loaded or loading
          const data = await fetchContributions();
           if (data) {
             setOutput(prev => [...prev, { type: 'output', text: renderContributionGrid(data.contributions) }]);
           }
        }
        break;
      case 'clear':
        setOutput([]);
        break;
      case 'echo':
        setOutput(prev => [...prev, { type: 'output', text: args.join(' ') }]);
        break;
      case 'ask':
        const question = args.join(' ').trim();
        if (question) {
          // Function to extract keywords (lowercase, remove punctuation)
          const extractKeywords = (text: string): string[] => {
            return text.toLowerCase().match(/\b\w+\b/g) || [];
          };

          const userKeywords = extractKeywords(question); // Extract keywords once
          let bestMatch: QnaItem | null = null;
          let maxMatches = 0;

          qna.forEach(item => {
            const qnaKeywords = extractKeywords(item.question);
            const commonKeywords = userKeywords.filter(keyword => qnaKeywords.includes(keyword));
            if (commonKeywords.length > maxMatches) {
              maxMatches = commonKeywords.length;
              bestMatch = item;
            }
          });

          // Check if a best match was found and has more than 4 common keywords
          if (bestMatch && maxMatches > 4) {
            setOutput(prev => [...prev, { type: 'output', text: bestMatch!.answer }]);
          } else {
            setOutput(prev => [...prev, { type: 'output', text: 'Sorry, my program doesn\'t know the question you are asking' }]);
          }
        } else {
          setOutput(prev => [...prev, { type: 'output', text: 'Please provide a question after the ask command.' }]);
        }
        break;
      case '':
        // Do nothing for empty command
        break;
      default:
        setOutput(prev => [...prev, { type: 'error', text: `Command not found: ${cmd}` }]);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCommand(input);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <div
      ref={terminalRef}
      className="bg-gray-900 text-green-400 font-mono p-4 rounded-md overflow-y-auto w-full h-full text-sm"
      onClick={() => inputRef.current?.focus()} // Focus input when clicking terminal area
    >
      {output.map((line, index) => (
        <div key={index} className={line.type === 'error' ? 'text-red-400' : ''}>
          {line.text}
        </div>
      ))}

      <div className="flex items-center">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none text-green-400"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      {loading && <div className="text-gray-400">Loading...</div>}
    </div>
  );
};

export default GitHubContributionsTerminal; 