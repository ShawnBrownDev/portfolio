'use client';

import React, { useEffect, useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { qna, QnaItem } from '@/lib/answers';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { COMMANDS, INSTALL_STEPS, LOADING_FRAMES, createProgressBar } from '@/lib/terminal';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: { [year: string]: number };
  contributions: ContributionDay[];
  streaks?: {
    current: number;
    longest: number;
    longestStart: string;
    longestEnd: string;
  };
}

interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  repository: {
    name: string;
  };
}

interface TerminalOutput {
  type: 'command' | 'output' | 'error';
  text: string | JSX.Element;
}

const GitHubContributionsTerminal: React.FC<{ username: string }> = ({ username }) => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [profileData, setProfileData] = useState<GitHubProfile | null>(null);
  const [reposData, setReposData] = useState<GitHubRepo[]>([]);
  const [recentCommits, setRecentCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { theme, colors, setTheme } = useTheme();
  const [loadingFrame, setLoadingFrame] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Add initial message on component mount, only once
  useEffect(() => {
    if (!isInstalled) {
      setOutput([
        { type: 'output', text: 'Welcome to the interactive terminal!' },
        { type: 'output', text: 'Run `sb install` to get started and unlock commands.' }
      ]);
    }
  }, [isInstalled]);

  // Auto-refresh GitHub data every 5 minutes if enabled
  useEffect(() => {
    if (!autoRefresh || !isInstalled) return;

    const interval = setInterval(async () => {
      setOutput(prev => [...prev, { type: 'output', text: '🔄 Auto-refreshing GitHub data...' }]);
      await fetchAllGitHubData();
      setLastRefresh(new Date());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, isInstalled]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchGitHubProfile = async (): Promise<GitHubProfile | null> => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProfileData(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch GitHub profile:', error);
      return null;
    }
  };

  const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReposData(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch GitHub repos:', error);
      return [];
    }
  };

  const fetchRecentCommits = async (): Promise<GitHubCommit[]> => {
    try {
      // Note: This is a simplified approach. GitHub API requires authentication for user events
      // For now, we'll show a message about this limitation
      setOutput(prev => [...prev, { 
        type: 'output', 
        text: 'Note: Recent commits require GitHub authentication. Use "profile" to see public data.' 
      }]);
      return [];
    } catch (error) {
      console.error('Failed to fetch recent commits:', error);
      return [];
    }
  };

  const fetchAllGitHubData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchContributions(),
        fetchGitHubProfile(),
        fetchGitHubRepos(),
        fetchRecentCommits()
      ]);
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateInstall = async () => {
    setOutput(prev => [
      ...prev,
      { type: 'output', text: 'Starting installation process...\n' }
    ]);

    let loadingInterval: NodeJS.Timeout;
    let currentProgress = 0;

    try {
      // Start loading animation
      loadingInterval = setInterval(() => {
        setLoadingFrame(prev => (prev + 1) % LOADING_FRAMES.length);
      }, 80);

      // Show initial progress bar
      setOutput(prev => [
        ...prev,
        { type: 'output', text: `${LOADING_FRAMES[loadingFrame]} Installing...` },
        { type: 'output', text: createProgressBar(0) }
      ]);

      // Process each installation step
      for (let i = 0; i < INSTALL_STEPS.length; i++) {
        const step = INSTALL_STEPS[i];
        
        // Process sub-steps
        for (const detail of step.details) {
          await sleep(step.duration / step.details.length);
          currentProgress = ((i * step.details.length + step.details.indexOf(detail) + 1) / 
                           (INSTALL_STEPS.reduce((sum, s) => sum + s.details.length, 0))) * 100;
          
          // Update progress bar
          setOutput(prev => {
            const newOutput = [...prev];
            // Update the progress bar line
            newOutput[newOutput.length - 1] = { type: 'output', text: createProgressBar(Math.floor(currentProgress)) };
            return newOutput;
          });
        }
      }

      // Clear interval and show completion
      clearInterval(loadingInterval);
      setIsCompleting(true);

      // Update final progress and show completion
      setOutput(prev => {
        const newOutput = [...prev];
        // Update the progress bar to 100%
        newOutput[newOutput.length - 1] = { type: 'output', text: createProgressBar(100) };
        // Add completion message
        newOutput.push(
          { type: 'output', text: '\n✅ Installation complete!' },
          { type: 'output', text: '\nAvailable commands: github, profile, repos, stats, summary, refresh, auto, theme, help' },
          { type: 'output', text: 'Type `help` for detailed command list.\n' }
        );
        return newOutput;
      });

      // Small delay before setting installed
      await sleep(100);
      setIsInstalled(true);
      setIsCompleting(false);
    } catch (error) {
      clearInterval(loadingInterval!);
      setOutput(prev => [
        ...prev,
        { type: 'error', text: '❌ Installation failed. Please try again.' }
    ]);
    }
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

  const calculateStreaks = (contributions: ContributionDay[]) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let longestStart = '';
    let longestEnd = '';
    let tempStart = '';

    contributions.forEach((day, index) => {
      if (day.count > 0) {
        currentStreak++;
        if (currentStreak === 1) tempStart = day.date;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStart = tempStart;
          longestEnd = day.date;
        }
      } else {
        currentStreak = 0;
      }
    });

    return {
      current: currentStreak,
      longest: longestStreak,
      longestStart,
      longestEnd
    };
  };

  const getContributionSummary = (contributions: ContributionDay[]) => {
    const today = new Date();
    const last30Days = contributions.slice(-30).reduce((sum, day) => sum + day.count, 0);
    const thisYear = contributions.filter(day => {
      const date = new Date(day.date);
      return date.getFullYear() === today.getFullYear();
    }).reduce((sum, day) => sum + day.count, 0);

    return { last30Days, thisYear };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        if (args.length > 0) {
          const commandName = args[0].toLowerCase();
          const command = COMMANDS.find(cmd => cmd.name === commandName);
          if (command) {
            const helpOutput: TerminalOutput[] = [
              { type: 'output', text: `📖 Help for '${command.name}':` },
              { type: 'output', text: `Description: ${command.description}` },
              { type: 'output', text: `Usage: ${command.usage || command.name}` }
            ];

            if (command.examples) {
              helpOutput.push({ type: 'output', text: 'Examples:' });
              command.examples.forEach(ex => {
                helpOutput.push({ type: 'output', text: `  $ ${ex}` });
              });
            }

            setOutput(prev => [...prev, ...helpOutput]);
          } else {
            setOutput(prev => [...prev, { 
              type: 'error', 
              text: `Command '${commandName}' not found. Type 'help' to see all commands.` 
            }]);
          }
        } else {
          const categorizedCommands = {
            core: COMMANDS.filter(cmd => cmd.category === 'core'),
            realtime: COMMANDS.filter(cmd => cmd.category === 'realtime'),
            customization: COMMANDS.filter(cmd => cmd.category === 'customization'),
            utility: COMMANDS.filter(cmd => cmd.category === 'utility')
          };

          const helpOutput: TerminalOutput[] = [
            { type: 'output', text: '🚀 Available Commands:' },
            { type: 'output', text: '\n📊 Core Commands:' },
            ...categorizedCommands.core.map(cmd => ({
              type: 'output' as const,
              text: `  • ${cmd.name.padEnd(8)} - ${cmd.description}`
            })),
            { type: 'output', text: '\n🔄 Real-time Features:' },
            ...categorizedCommands.realtime.map(cmd => ({
              type: 'output' as const,
              text: `  • ${cmd.name.padEnd(8)} - ${cmd.description}`
            })),
            { type: 'output', text: '\n🎨 Customization:' },
            ...categorizedCommands.customization.map(cmd => ({
              type: 'output' as const,
              text: `  • ${cmd.name.padEnd(8)} - ${cmd.description}`
            })),
            { type: 'output', text: '\n🔧 Utilities:' },
            ...categorizedCommands.utility.map(cmd => ({
              type: 'output' as const,
              text: `  • ${cmd.name.padEnd(8)} - ${cmd.description}`
            })),
            { type: 'output', text: '\n💡 Tips:' },
            { type: 'output', text: '  • Use Tab for command auto-completion' },
            { type: 'output', text: '  • Use ↑↓ arrows to navigate command history' },
            { type: 'output', text: '  • Type "help <command>" for detailed help on a specific command' },
            { type: 'output', text: '  • Press Esc to clear suggestions' },
            { type: 'output', text: '  • Click anywhere in the terminal to focus' }
          ];

          setOutput(prev => [...prev, ...helpOutput]);
        }
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
        break;
      case 'profile':
        if (profileData) {
          setOutput(prev => [
            ...prev,
            { type: 'output', text: '👤 GitHub Profile:' },
            { type: 'output', text: `Name: ${profileData.name || 'Not set'}` },
            { type: 'output', text: `Username: @${profileData.login}` },
            { type: 'output', text: `Bio: ${profileData.bio || 'No bio set'}` },
            { type: 'output', text: `Public Repos: ${profileData.public_repos}` },
            { type: 'output', text: `Followers: ${profileData.followers}` },
            { type: 'output', text: `Following: ${profileData.following}` },
            { type: 'output', text: `Member since: ${formatDate(profileData.created_at)}` }
          ]);
        } else {
          setOutput(prev => [...prev, { type: 'output', text: 'Fetching GitHub profile...' }]);
          const data = await fetchGitHubProfile();
          if (data) {
            setOutput(prev => [
              ...prev,
              { type: 'output', text: '👤 GitHub Profile:' },
              { type: 'output', text: `Name: ${data.name || 'Not set'}` },
              { type: 'output', text: `Username: @${data.login}` },
              { type: 'output', text: `Bio: ${data.bio || 'No bio set'}` },
              { type: 'output', text: `Public Repos: ${data.public_repos}` },
              { type: 'output', text: `Followers: ${data.followers}` },
              { type: 'output', text: `Following: ${data.following}` },
              { type: 'output', text: `Member since: ${formatDate(data.created_at)}` }
            ]);
          }
        }
        break;
      case 'repos':
        if (reposData.length > 0) {
          setOutput(prev => [
            ...prev,
            { type: 'output', text: '📚 Recent Repositories:' }
          ]);
          
          reposData.slice(0, 5).forEach(repo => {
            setOutput(prev => [
              ...prev,
              { type: 'output', text: `• ${repo.name} (${repo.language || 'N/A'})` },
              { type: 'output', text: `  ${repo.description || 'No description'}` },
              { type: 'output', text: `  ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 📅 ${formatDate(repo.updated_at)}` }
            ]);
          });
        } else {
          setOutput(prev => [...prev, { type: 'output', text: 'Fetching repositories...' }]);
          const data = await fetchGitHubRepos();
          if (data.length > 0) {
            setOutput(prev => [
              ...prev,
              { type: 'output', text: '📚 Recent Repositories:' }
            ]);
            
            data.slice(0, 5).forEach(repo => {
              setOutput(prev => [
                ...prev,
                { type: 'output', text: `• ${repo.name} (${repo.language || 'N/A'})` },
                { type: 'output', text: `  ${repo.description || 'No description'}` },
                { type: 'output', text: `  ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 📅 ${formatDate(repo.updated_at)}` }
              ]);
            });
          }
        }
        break;
      case 'refresh':
        setOutput(prev => [...prev, { type: 'output', text: '🔄 Refreshing all GitHub data...' }]);
        await fetchAllGitHubData();
        setLastRefresh(new Date());
        setOutput(prev => [...prev, { type: 'output', text: '✅ Data refreshed successfully!' }]);
        break;
      case 'auto':
        setAutoRefresh(!autoRefresh);
        setOutput(prev => [
          ...prev, 
          { type: 'output', text: `Auto-refresh ${!autoRefresh ? 'enabled' : 'disabled'}. ${!autoRefresh ? 'Data will refresh every 5 minutes.' : ''}` }
        ]);
        break;
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
          const availableQuestions = COMMANDS.map(cmd => `- ${cmd.name}`);
          setOutput(prev => [
            ...prev,
            { type: 'output', text: 'Here are some questions you can ask:' },
            ...availableQuestions.map(q => ({ type: 'output' as const, text: q }))
          ]);
        }
        break;
      case 'stats':
        if (contributionData) {
          const streaks = calculateStreaks(contributionData.contributions);
          const totalContributions = Object.values(contributionData.total).reduce((a, b) => a + b, 0);
          setOutput(prev => [
            ...prev,
            { type: 'output', text: '📊 GitHub Statistics:' },
            { type: 'output', text: `Total Contributions: ${totalContributions}` },
            { type: 'output', text: `Current Streak: ${streaks.current} days` },
            { type: 'output', text: `Longest Streak: ${streaks.longest} days (${streaks.longestStart} to ${streaks.longestEnd})` },
            { type: 'output', text: `Years Active: ${Object.keys(contributionData.total).length}` }
          ]);
        } else {
          setOutput(prev => [...prev, { type: 'output', text: 'Fetching contribution data first...' }]);
          const data = await fetchContributions();
          if (data) {
            const streaks = calculateStreaks(data.contributions);
            const totalContributions = Object.values(data.total).reduce((a, b) => a + b, 0);
            setOutput(prev => [
              ...prev,
              { type: 'output', text: '📊 GitHub Statistics:' },
              { type: 'output', text: `Total Contributions: ${totalContributions}` },
              { type: 'output', text: `Current Streak: ${streaks.current} days` },
              { type: 'output', text: `Longest Streak: ${streaks.longest} days (${streaks.longestStart} to ${streaks.longestEnd})` },
              { type: 'output', text: `Years Active: ${Object.keys(data.total).length}` }
            ]);
          }
        }
        break;
      case 'history':
        if (commandHistory.length === 0) {
          setOutput(prev => [...prev, { type: 'output', text: 'No command history yet.' }]);
        } else {
          setOutput(prev => [
            ...prev,
            { type: 'output', text: '📜 Command History:' },
            ...commandHistory.map((cmd, i) => ({
              type: 'output' as const,
              text: `${i + 1}. ${cmd}`
            }))
          ]);
        }
        break;
      case 'theme':
        if (args.length > 0) {
          const subCommand = args[0].toLowerCase();
          if (subCommand === 'list') {
            const themeOutput: TerminalOutput[] = [
              { type: 'output', text: '🎨 Available Themes:' },
              { type: 'output', text: '\nDefault Themes:' },
              { type: 'output', text: '  • default  - Modern dark theme with blue accents' },
              { type: 'output', text: '  • matrix   - Classic Matrix-inspired green on black' },
              { type: 'output', text: '  • monokai  - Popular Monokai color scheme' },
              { type: 'output', text: '\nSpecial Themes:' },
              { type: 'output', text: '  • cyberpunk - Neon-futuristic theme with bright accents' },
              { type: 'output', text: '  • dracula   - Dark theme with vibrant colors' },
              { type: 'output', text: '  • nord      - Cold, arctic-inspired color palette' },
              { type: 'output', text: '\nUse "theme set <name>" to switch themes' }
            ];
            setOutput(prev => [...prev, ...themeOutput]);
          } else if (subCommand === 'set' && args[1]) {
            const newTheme = args[1].toLowerCase() as Theme;
            const validThemes = ['default', 'matrix', 'monokai', 'cyberpunk', 'dracula', 'nord'];
            
            if (validThemes.includes(newTheme)) {
              setTheme(newTheme);
              setOutput(prev => [
                ...prev,
                { type: 'output', text: `✨ Theme changed to ${newTheme}` }
              ]);
            } else {
              setOutput(prev => [
                ...prev,
                { type: 'error', text: `Theme '${args[1]}' not found. Use 'theme list' to see available themes.` }
              ]);
            }
          } else {
            setOutput(prev => [
              ...prev,
              { type: 'error', text: 'Invalid theme command. Use: theme [list|set <theme-name>]' }
            ]);
          }
        } else {
          setOutput(prev => [
            ...prev,
            { type: 'output', text: `Current theme: ${theme}` },
            { type: 'output', text: 'Available subcommands:' },
            { type: 'output', text: '  • theme list        - Show all available themes' },
            { type: 'output', text: '  • theme set <name>  - Switch to a different theme' }
          ]);
        }
        break;
      case 'summary':
        if (contributionData) {
          const { last30Days, thisYear } = getContributionSummary(contributionData.contributions);
          setOutput(prev => [
            ...prev,
            { type: 'output', text: '📈 Contribution Summary:' },
            { type: 'output', text: `Last 30 days: ${last30Days} contributions` },
            { type: 'output', text: `This year: ${thisYear} contributions` },
          ]);
        } else {
          setOutput(prev => [...prev, { type: 'output', text: 'Fetching contribution data first...' }]);
          const data = await fetchContributions();
          if (data) {
            const { last30Days, thisYear } = getContributionSummary(data.contributions);
            setOutput(prev => [
              ...prev,
              { type: 'output', text: '📈 Contribution Summary:' },
              { type: 'output', text: `Last 30 days: ${last30Days} contributions` },
              { type: 'output', text: `This year: ${thisYear} contributions` },
            ]);
          }
        }
        break;
      case '':
        // Do nothing for empty command
        break;
      default:
        setOutput(prev => [...prev, { type: 'error', text: `Command not found: ${cmd}` }]);
    }
  };

  const getCommandSuggestions = (input: string): string[] => {
    const inputLower = input.toLowerCase().trim();
    if (!inputLower) return [];
    
    return COMMANDS
      .filter(cmd => cmd.name.startsWith(inputLower) || 
                    cmd.description.toLowerCase().includes(inputLower))
      .map(cmd => cmd.name);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setInput(newInput);
    
    // Only show suggestions if installed
    if (isInstalled) {
      const newSuggestions = getCommandSuggestions(newInput);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedSuggestion(-1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (suggestions.length > 0) {
        const suggestion = suggestions[selectedSuggestion === -1 ? 0 : selectedSuggestion];
        setInput(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (showSuggestions) {
        setSelectedSuggestion(prev => 
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (showSuggestions) {
        setSelectedSuggestion(prev => 
          prev >= suggestions.length - 1 ? -1 : prev + 1
        );
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (event.key === 'Enter') {
      if (showSuggestions && selectedSuggestion !== -1) {
        setInput(suggestions[selectedSuggestion]);
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        if (input.trim()) {
          setCommandHistory(prev => [...prev, input]);
          setHistoryIndex(-1);
        }
      handleCommand(input);
        setSuggestions([]);
        setShowSuggestions(false);
    }
    } else if (event.key === 'Escape') {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  // Add this function to calculate dropdown position
  const updateDropdownPosition = () => {
    if (!inputRef.current || !terminalRef.current) return;
    
    const inputBottom = inputRef.current.getBoundingClientRect().bottom;
    const terminalBottom = terminalRef.current.getBoundingClientRect().bottom;
    const spaceBelow = terminalBottom - inputBottom;
    
    // If space below is less than 160px (max dropdown height), position above
    setDropdownPosition(spaceBelow < 160 ? 'top' : 'bottom');
  };

  // Add effect to update position when showing suggestions
  useEffect(() => {
    if (showSuggestions) {
      updateDropdownPosition();
    }
  }, [showSuggestions, output.length]);

  return (
    <div
      ref={terminalRef}
      className={`${colors.terminal.bg} ${colors.terminal.text} font-mono p-3 overflow-y-auto w-full h-full text-sm transition-colors duration-300 rounded-lg border ${colors.main.border} relative`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-1">
      {output.map((line, index) => (
          <div 
            key={index} 
            className={`${line.type === 'error' ? colors.terminal.error : ''} ${
              line.type === 'command' ? 'opacity-90' : ''
            } ${isCompleting ? 'transition-opacity duration-300' : ''}`}
          >
          {line.text}
        </div>
      ))}
      </div>

      <div className="flex items-center mt-2 relative">
        <span className={`mr-2 ${colors.terminal.prompt}`}>$</span>
        <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
            className={`w-full bg-transparent outline-none ${colors.terminal.text}`}
          value={input}
          onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          disabled={loading}
        />
          
          {/* Suggestions dropdown with dynamic positioning */}
          {isInstalled && showSuggestions && (
            <div 
              className={`absolute left-0 right-0 ${
                dropdownPosition === 'top' 
                  ? 'bottom-full mb-1' 
                  : 'top-full mt-1'
              } ${colors.terminal.bg} border ${colors.main.border} rounded-md overflow-hidden z-10 max-h-32 overflow-y-auto`}
              style={{ maxHeight: '160px' }}
            >
              {suggestions.map((suggestion, index) => {
                const command = COMMANDS.find(cmd => cmd.name === suggestion);
                return (
                  <div
                    key={suggestion}
                    className={`px-3 py-2 cursor-pointer ${
                      index === selectedSuggestion ? colors.main.hover : ''
                    }`}
                    onClick={() => {
                      setInput(suggestion);
                      setSuggestions([]);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    <span className={colors.terminal.prompt}>{suggestion}</span>
                    {command && (
                      <span className="ml-2 opacity-60 text-xs">
                        {command.description}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {loading && <div className="text-gray-400 mt-2">Loading...</div>}
      {autoRefresh && lastRefresh && (
        <div className="text-gray-500 text-xs mt-2">
          Auto-refresh enabled • Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default GitHubContributionsTerminal; 