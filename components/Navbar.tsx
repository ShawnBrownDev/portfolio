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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    console.log('Navigating to:', href);
    
    // Close mobile menu first
    setIsOpen(false);
    
    // Wait a bit for the menu to close, then scroll
    setTimeout(() => {
    const element = document.querySelector(href);
      console.log('Found element:', element);
      
    if (element) {
        // Re-enable body scroll for smooth scrolling
        document.body.style.overflow = 'unset';
        document.body.classList.remove('menu-open');
        
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.error('Element not found:', href);
    }
    }, 300); // Wait for menu close animation
  };

  const themes = [
    { value: 'default', label: 'Default', icon: Monitor },
    { value: 'matrix', label: 'Matrix', icon: Moon },
    { value: 'monokai', label: 'Monokai', icon: Sun },
  ] as const;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300 py-4",
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
                "flex items-center space-x-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                colors.main.muted,
                "hover:" + colors.main.text.split("text-")[1],
                isOpen ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
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
              "transition-all duration-200 p-2 rounded-lg",
              colors.main.muted,
              "hover:" + colors.main.text.split("text-")[1],
              isOpen && "bg-white bg-opacity-10"
            )}
        >
          <div className="relative w-6 h-6">
            <span className={cn(
              "absolute top-1/2 left-0 w-6 h-0.5 bg-current transform transition-all duration-200",
              isOpen ? "rotate-45" : "-translate-y-1"
            )} />
            <span className={cn(
              "absolute top-1/2 left-0 w-6 h-0.5 bg-current transform transition-all duration-200",
              isOpen ? "opacity-0" : "opacity-100"
            )} />
            <span className={cn(
              "absolute top-1/2 left-0 w-6 h-0.5 bg-current transform transition-all duration-200",
              isOpen ? "-rotate-45" : "translate-y-1"
            )} />
          </div>
        </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Bottom Sheet */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div className={cn(
            "mobile-menu-container fixed bottom-0 left-0 right-0 z-[70] md:hidden transform transition-transform duration-300 ease-out",
            "w-screen h-auto",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}>
            <div className={cn(
              "rounded-t-3xl shadow-2xl border-t",
              "bg-gray-900 border-gray-700",
              "w-full"
            )}>
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-3">
                <div className="w-16 h-1.5 bg-gray-500 rounded-full opacity-60"></div>
              </div>
              
              {/* Navigation Links */}
              <div className="px-6 pb-8">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                        "block px-4 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 cursor-pointer",
                        "text-white hover:text-white",
                        "bg-gray-800 hover:bg-gray-700 active:scale-98",
                        "border border-gray-600 hover:border-gray-500",
                        "shadow-sm hover:shadow-md"
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
              >
                {link.label}
              </a>
            ))}
                </div>
                
                {/* Theme Section */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4 px-4 uppercase tracking-wide">
                    Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTheme(value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200",
                          "border border-gray-600",
                          theme === value 
                            ? "bg-white text-black shadow-lg scale-105" 
                            : "bg-gray-800 text-white hover:bg-gray-700 hover:scale-102"
                        )}
                      >
                        <Icon size={24} />
                        <span className="text-xs font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </div>
        </>
      )}
    </header>
  );
};

export default Navbar;