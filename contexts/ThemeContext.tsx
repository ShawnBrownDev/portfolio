'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'default' | 'matrix' | 'monokai' | 'cyberpunk' | 'dracula' | 'nord';

// Gradient definitions for themes that use them
const gradients = {
  cyberpunk: {
    primary: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500',
    secondary: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500',
  },
  nord: {
    primary: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    secondary: 'bg-gradient-to-r from-green-400 via-teal-500 to-blue-500',
  }
} as const;

// Animation classes for different themes
const animations = {
  default: {
    hover: 'transition-all duration-300 ease-in-out',
    pulse: 'animate-pulse',
    glow: 'animate-glow',
  },
  matrix: {
    hover: 'transition-all duration-200 ease-in-out hover:text-green-300',
    pulse: 'animate-matrix-pulse',
    glow: 'animate-matrix-glow',
  },
  cyberpunk: {
    hover: 'transition-all duration-150 ease-in-out hover:text-pink-300',
    pulse: 'animate-neon-pulse',
    glow: 'animate-neon-glow',
  }
} as const;

export const themeColors = {
  default: {
    terminal: {
      bg: 'bg-gray-900',
      text: 'text-green-400',
      error: 'text-red-400',
      prompt: 'text-green-400',
      selection: 'selection:bg-blue-500/30',
      cursor: 'border-green-400',
    },
    main: {
      background: 'bg-zinc-900',
      text: 'text-zinc-100',
      primary: 'text-blue-500',
      secondary: 'text-purple-400',
      accent: 'text-amber-400',
      muted: 'text-zinc-400',
      border: 'border-zinc-800',
      card: 'bg-zinc-800/50 backdrop-blur-sm',
      hover: 'hover:bg-zinc-800 hover:shadow-lg',
      focus: 'focus:ring-2 focus:ring-blue-500/50',
      selection: 'selection:bg-blue-500/20',
      shadow: 'shadow-xl shadow-black/20',
    }
  },
  matrix: {
    terminal: {
      bg: 'bg-black',
      text: 'text-green-500',
      error: 'text-red-500',
      prompt: 'text-green-300',
      selection: 'selection:bg-green-500/30',
      cursor: 'border-green-300',
    },
    main: {
      background: 'bg-[#0a1a0a]',
      text: 'text-green-100',
      primary: 'text-green-400',
      secondary: 'text-emerald-400',
      accent: 'text-lime-400',
      muted: 'text-green-700',
      border: 'border-green-900',
      card: 'bg-[#0f2f0f]/50 backdrop-blur-sm',
      hover: 'hover:bg-[#0f2f0f] hover:shadow-lg hover:shadow-green-900/20',
      focus: 'focus:ring-2 focus:ring-green-500/50',
      selection: 'selection:bg-green-500/20',
      shadow: 'shadow-xl shadow-green-900/30',
    }
  },
  monokai: {
    terminal: {
      bg: 'bg-[#272822]',
      text: 'text-[#F8F8F2]',
      error: 'text-[#F92672]',
      prompt: 'text-[#A6E22E]',
      selection: 'selection:bg-[#75715E]/30',
      cursor: 'border-[#A6E22E]',
    },
    main: {
      background: 'bg-[#1e1f1c]',
      text: 'text-[#F8F8F2]',
      primary: 'text-[#66D9EF]',
      secondary: 'text-[#FD971F]',
      accent: 'text-[#A6E22E]',
      muted: 'text-[#75715E]',
      border: 'border-[#49483E]',
      card: 'bg-[#272822]/50 backdrop-blur-sm',
      hover: 'hover:bg-[#272822] hover:shadow-lg',
      focus: 'focus:ring-2 focus:ring-[#66D9EF]/50',
      selection: 'selection:bg-[#75715E]/20',
      shadow: 'shadow-xl shadow-black/20',
    }
  },
  cyberpunk: {
    terminal: {
      bg: 'bg-[#0D0221]',
      text: 'text-[#FF2A6D]',
      error: 'text-[#D1F7FF]',
      prompt: 'text-[#05FFA1]',
      selection: 'selection:bg-[#FF2A6D]/30',
      cursor: 'border-[#05FFA1]',
    },
    main: {
      background: 'bg-[#0D0221]',
      text: 'text-[#D1F7FF]',
      primary: 'text-[#05FFA1]',
      secondary: 'text-[#FF2A6D]',
      accent: 'text-[#FFB238]',
      muted: 'text-[#3B2E40]',
      border: 'border-[#FF2A6D]',
      card: 'bg-[#1A1A3A]/50 backdrop-blur-sm',
      hover: 'hover:bg-[#1A1A3A] hover:shadow-lg hover:shadow-[#FF2A6D]/20',
      focus: 'focus:ring-2 focus:ring-[#05FFA1]/50',
      selection: 'selection:bg-[#FF2A6D]/20',
      shadow: 'shadow-xl shadow-[#FF2A6D]/20',
    }
  },
  dracula: {
    terminal: {
      bg: 'bg-[#282A36]',
      text: 'text-[#F8F8F2]',
      error: 'text-[#FF5555]',
      prompt: 'text-[#50FA7B]',
      selection: 'selection:bg-[#44475A]',
      cursor: 'border-[#50FA7B]',
    },
    main: {
      background: 'bg-[#282A36]',
      text: 'text-[#F8F8F2]',
      primary: 'text-[#BD93F9]',
      secondary: 'text-[#FF79C6]',
      accent: 'text-[#50FA7B]',
      muted: 'text-[#6272A4]',
      border: 'border-[#44475A]',
      card: 'bg-[#44475A]/50 backdrop-blur-sm',
      hover: 'hover:bg-[#44475A] hover:shadow-lg',
      focus: 'focus:ring-2 focus:ring-[#BD93F9]/50',
      selection: 'selection:bg-[#44475A]/20',
      shadow: 'shadow-xl shadow-[#282A36]/40',
    }
  },
  nord: {
    terminal: {
      bg: 'bg-[#2E3440]',
      text: 'text-[#D8DEE9]',
      error: 'text-[#BF616A]',
      prompt: 'text-[#A3BE8C]',
      selection: 'selection:bg-[#4C566A]',
      cursor: 'border-[#A3BE8C]',
    },
    main: {
      background: 'bg-[#2E3440]',
      text: 'text-[#D8DEE9]',
      primary: 'text-[#88C0D0]',
      secondary: 'text-[#81A1C1]',
      accent: 'text-[#A3BE8C]',
      muted: 'text-[#4C566A]',
      border: 'border-[#3B4252]',
      card: 'bg-[#3B4252]/50 backdrop-blur-sm',
      hover: 'hover:bg-[#3B4252] hover:shadow-lg',
      focus: 'focus:ring-2 focus:ring-[#88C0D0]/50',
      selection: 'selection:bg-[#4C566A]/20',
      shadow: 'shadow-xl shadow-[#2E3440]/40',
    }
  }
} as const;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof themeColors[Theme];
  animations: typeof animations[keyof typeof animations];
  gradients: typeof gradients;
  isDark: boolean;
  toggleTheme: () => void;
  nextTheme: () => void;
  previousTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme-specific classes to body with smooth transitions
    document.body.className = `
      theme-${theme} 
      ${themeColors[theme].main.background} 
      transition-colors duration-300 ease-in-out
      ${themeColors[theme].main.text}
      ${themeColors[theme].main.selection}
    `.trim();
  }, [theme]);

  const isDark = ['default', 'matrix', 'monokai', 'cyberpunk', 'dracula', 'nord'].includes(theme);

  const toggleTheme = () => {
    const themes = Object.keys(themeColors) as Theme[];
    const currentIndex = themes.indexOf(theme);
    setTheme(currentIndex === themes.length - 1 ? themes[0] : themes[currentIndex + 1]);
  };

  const nextTheme = () => {
    const themes = Object.keys(themeColors) as Theme[];
    const currentIndex = themes.indexOf(theme);
    setTheme(currentIndex === themes.length - 1 ? themes[0] : themes[currentIndex + 1]);
  };

  const previousTheme = () => {
    const themes = Object.keys(themeColors) as Theme[];
    const currentIndex = themes.indexOf(theme);
    setTheme(currentIndex === 0 ? themes[themes.length - 1] : themes[currentIndex - 1]);
  };

  const value = {
    theme,
    setTheme,
    colors: themeColors[theme],
    animations: animations[theme as keyof typeof animations] || animations.default,
    gradients,
    isDark,
    toggleTheme,
    nextTheme,
    previousTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 