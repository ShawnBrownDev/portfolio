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
  const [isInstalled, setIsInstalled] = useState(false);

  // Add initial message on component mount, only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isInstalled) {
      // Add both messages in a single update
      setOutput([
        { type: 'output', text: 'Welcome to the interactive terminal!' },
        { type: 'output', text: 'Run `sb install` to get started and unlock commands.' }
      ]);
    }
  }, [isInstalled]); // Add isInstalled to dependency array


  const simulateInstall = async () => {
    setOutput(prev => [...prev, { type: 'output', text: 'Installing...' }]);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(res => setTimeout(res, 200)); // simulate delay
      setOutput(prev => [
        ...prev.slice(0, -1),
        { type: 'output', text: `Installing... ${i}%` }
      ]);
    }
    setIsInstalled(true);
    setOutput(prev => [
      ...prev.slice(0, -1),
      { type: 'output', text: '✅ Installation complete. You can now use the following commands:' },
      { type: 'output', text: '- github: Display GitHub contribution graph' },
      { type: 'output', text: '- ask: List questions you can add after ask <question>' },
      { type: 'output', text: '- clear: Clear the terminal output' },
    ]);
  };
  

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
    setInput('');
  
    const [cmd, ...args] = command.trim().split(' ');
  
    if (!isInstalled && cmd !== 'sb' && cmd !== '') {
      setOutput(prev => [...prev, { type: 'error', text: '⚠️ Please run sb install first.' }]);
      return;
    }
  
    if (cmd === 'sb' && args[0] === 'install') {
      if (isInstalled) {
        setOutput(prev => [...prev, { type: 'output', text: 'Already installed.' }]);
      } else {
        await simulateInstall();
      }
      return;
    }
  
    switch (cmd) {
      case 'help':
        setOutput(prev => [
          ...prev,
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '- github: Display GitHub contribution graph' },
          { type: 'output', text: '- ask: List questions you can add after ask <question>' },
          { type: 'output', text: '- clear: Clear the terminal output' },
        ]);
        break;
      case 'clear':
        setOutput([]);
        break;
      case 'echo':
        setOutput(prev => [...prev, { type: 'output', text: args.join(' ') }]);
        break;
      case 'github': // Handle github command
        if (contributionData) {
          setOutput(prev => [...prev, { type: 'output', text: 'Fetching GitHub contributions...' }]);
          // Render the contribution grid or a summary
           setOutput(prev => [...prev, { type: 'output', text: renderContributionGrid(contributionData.contributions) }]);
        } else if (loading) {
             setOutput(prev => [...prev, { type: 'output', text: 'Already fetching data...' }]);
        } else {
             setOutput(prev => [...prev, { type: 'output', text: 'Fetching GitHub contributions for the first time...' }]);
             const data = await fetchContributions();
             if (data) {
                  setOutput(prev => [...prev, { type: 'output', text: renderContributionGrid(data.contributions) }]);
             }
        }
        break; // Added missing break
      case 'ask':
        const question = args.join(' ').trim();
        if (question) {
          // Function to extract keywords (lowercase, remove punctuation)
          const extractKeywords = (text: string): string[] => {
            return text.toLowerCase().match(/\b\w+\b/g) || [];
          };

          const userKeywords = extractKeywords(question); // Extract keywords once
          // console.log('User keywords:', userKeywords); // Log user keywords
          let bestMatch: QnaItem | null = null;
          let maxMatches = 0;

          qna.forEach(item => {
            const qnaKeywords = extractKeywords(item.question);
            // console.log(`QNA item: ${item.question}`, 'Keywords:', qnaKeywords); // Log QNA keywords
            const commonKeywords = userKeywords.filter(keyword => qnaKeywords.includes(keyword));
            // console.log('Common keywords:', commonKeywords, 'Matches:', commonKeywords.length); // Log common keywords and count
            if (commonKeywords.length > maxMatches) {
              maxMatches = commonKeywords.length;
              bestMatch = item;
            }
          });

          // console.log('Best match:', bestMatch ? bestMatch!.question : 'None', 'Max matches:', maxMatches); // Log best match and count with non-null assertion

          // Check if a best match was found and has more than 4 common keywords
          if (bestMatch && maxMatches >= 4) {
            setOutput(prev => [...prev, { type: 'output', text: bestMatch!.answer }]);
          } else {
            setOutput(prev => [...prev, { type: 'output', text: 'Sorry, my program doesn\'t know the question you are asking' }]);
          }
        } else {
          // If no question is provided, list available questions
          const availableQuestions = qna.map(item => `- ${item.question}`);
          setOutput(prev => [
            ...prev,
            { type: 'output', text: 'Here are some questions you can ask:' },
            ...availableQuestions.map(q => ({ type: 'output' as const, text: q }))
          ]);
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
      className="bg-gray-900 text-green-400 font-mono p-3 overflow-y-auto w-full h-full text-sm"
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