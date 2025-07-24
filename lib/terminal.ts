export interface Command {
  name: string;
  description: string;
  category: 'core' | 'customization' | 'utility' | 'realtime';
  usage?: string;
  examples?: string[];
}

export const INSTALL_STEPS = [
  { 
    name: 'Setting up terminal', 
    duration: 600,
    details: [
      'Initializing components',
      'Loading command system'
    ]
  },
  { 
    name: 'Connecting to GitHub', 
    duration: 800,
    details: [
      'Establishing API connection',
      'Testing data access'
    ]
  },
  { 
    name: 'Finalizing setup', 
    duration: 400,
    details: [
      'Enabling commands',
      'Ready to use'
    ]
  }
];

export const COMMANDS: Command[] = [
  {
    name: 'github',
    description: 'Display GitHub contribution graph',
    category: 'core',
    usage: 'github',
    examples: ['github']
  },
  {
    name: 'profile',
    description: 'Show GitHub profile information',
    category: 'core',
    usage: 'profile',
    examples: ['profile']
  },
  {
    name: 'repos',
    description: 'List recent repositories',
    category: 'core',
    usage: 'repos',
    examples: ['repos']
  },
  {
    name: 'stats',
    description: 'Show detailed contribution statistics',
    category: 'core',
    usage: 'stats',
    examples: ['stats']
  },
  {
    name: 'summary',
    description: 'Quick overview of recent contributions',
    category: 'core',
    usage: 'summary',
    examples: ['summary']
  },
  {
    name: 'refresh',
    description: 'Manually refresh all GitHub data',
    category: 'realtime',
    usage: 'refresh',
    examples: ['refresh']
  },
  {
    name: 'auto',
    description: 'Toggle auto-refresh (every 5 minutes)',
    category: 'realtime',
    usage: 'auto',
    examples: ['auto']
  },
  {
    name: 'theme',
    description: 'Show/change current theme settings',
    category: 'customization',
    usage: 'theme [list|set <theme-name>]',
    examples: ['theme', 'theme list', 'theme set matrix']
  },
  {
    name: 'ask',
    description: 'List available questions or ask specific ones',
    category: 'utility',
    usage: 'ask [question]',
    examples: ['ask', 'ask what are your features']
  },
  {
    name: 'clear',
    description: 'Clear the terminal output',
    category: 'utility',
    usage: 'clear',
    examples: ['clear']
  },
  {
    name: 'history',
    description: 'Show command history',
    category: 'utility',
    usage: 'history',
    examples: ['history']
  },
  {
    name: 'help',
    description: 'Show available commands and usage',
    category: 'utility',
    usage: 'help [command]',
    examples: ['help', 'help github']
  }
];



export const PROGRESS_BAR_WIDTH = 30;

export const createProgressBar = (progress: number) => {
  const filled = Math.floor(PROGRESS_BAR_WIDTH * (progress / 100));
  const empty = PROGRESS_BAR_WIDTH - filled;
  return `[${'█'.repeat(filled)}${'-'.repeat(empty)}] ${progress}%`;
};

export const LOADING_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];