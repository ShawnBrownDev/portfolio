"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Monitor, Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme, colors } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const themes = [
    { value: 'default', label: 'Default', icon: Monitor },
    { value: 'matrix', label: 'Matrix', icon: Moon },
    { value: 'monokai', label: 'Monokai', icon: Sun },
  ] as const;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-4",
        isScrolled ? `${colors.main.card} backdrop-blur-sm shadow-sm` : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <Link href="/" className={cn("text-2xl font-bold", colors.main.text)}>
          Shawn Brown
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "text-sm font-medium transition-colors cursor-pointer",
                colors.main.muted,
                "hover:" + colors.main.text.split("text-")[1]
              )}
            >
              {link.label}
            </a>
          ))}

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors cursor-pointer",
                colors.main.muted,
                "hover:" + colors.main.text.split("text-")[1]
              )}>
                <Palette size={20} />
                <span className="hidden sm:inline">Theme</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn("w-40 border", colors.main.card, colors.main.border)}>
              {themes.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center space-x-2 cursor-pointer",
                    theme === value ? cn(colors.main.text, colors.main.card) : cn(colors.main.muted, colors.main.hover)
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "transition-colors",
                colors.main.muted,
                "hover:" + colors.main.text.split("text-")[1]
              )}>
                <Palette size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn("w-40 border", colors.main.card, colors.main.border)}>
              {themes.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center space-x-2 cursor-pointer",
                    theme === value ? cn(colors.main.text, colors.main.card) : cn(colors.main.muted, colors.main.hover)
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        <button
          onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "transition-colors",
              colors.main.muted,
              "hover:" + colors.main.text.split("text-")[1]
            )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className={cn("md:hidden backdrop-blur-sm", colors.main.card)}>
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "text-lg font-medium transition-colors cursor-pointer",
                  colors.main.muted,
                  "hover:" + colors.main.text.split("text-")[1]
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;