export interface Command {
  name: string;
  description: string;
  category: 'core' | 'customization' | 'utility';
  usage?: string;
  examples?: string[];
}

export const INSTALL_STEPS = [
  { 
    name: 'Checking system compatibility', 
    duration: 800,
    details: [
      'Verifying Node.js version',
      'Checking package dependencies',
      'Validating system requirements'
    ]
  },
  { 
    name: 'Installing core dependencies', 
    duration: 1200,
    details: [
      'Setting up terminal engine',
      'Installing GitHub API client',
      'Configuring data handlers'
    ]
  },
  { 
    name: 'Configuring environment', 
    duration: 1000,
    details: [
      'Loading environment variables',
      'Setting up cache storage',
      'Initializing state manager'
    ]
  },
  { 
    name: 'Setting up GitHub integration', 
    duration: 1500,
    details: [
      'Establishing API connection',
      'Fetching user profile',
      'Setting up webhooks'
    ]
  },
  { 
    name: 'Initializing terminal features', 
    duration: 900,
    details: [
      'Loading command handlers',
      'Setting up auto-completion',
      'Configuring history manager'
    ]
  },
  { 
    name: 'Running final checks', 
    duration: 600,
    details: [
      'Verifying installations',
      'Testing connections',
      'Optimizing performance'
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