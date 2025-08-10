"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, colors } = useTheme();

  // Debug the state
  useEffect(() => {
    console.log('isOpen state changed to:', isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' }
  ];

  const themes = [
    { value: 'default', label: 'Default', icon: Monitor },
    { value: 'matrix', label: 'Matrix', icon: Moon },
    { value: 'monokai', label: 'Monokai', icon: Sun }
  ] as const;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">SB</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 cursor-pointer",
                    colors.main.text,
                    "hover:" + colors.main.accent.split("text-")[1]
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Theme Toggle */}
            <div className="hidden md:flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "transition-all duration-200 p-2 rounded-lg",
                    colors.main.muted,
                    "hover:" + colors.main.text.split("text-")[1]
                  )}>
                    {theme === 'default' && <Monitor size={20} />}
                    {theme === 'matrix' && <Moon size={20} />}
                    {theme === 'monokai' && <Sun size={20} />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {themes.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        "flex items-center space-x-2 cursor-pointer",
                        theme === value && "bg-blue-500 text-white"
                      )}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  console.log('Button clicked! Current isOpen:', isOpen);
                  setIsOpen(!isOpen);
                  console.log('Setting isOpen to:', !isOpen);
                }}
                className={cn(
                  "transition-all duration-200 p-2 rounded-lg",
                  colors.main.muted,
                  "hover:" + colors.main.text.split("text-")[1],
                  isOpen && "bg-white bg-opacity-10"
                )}
                aria-label="Toggle mobile menu"
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
        </div>
      </header>

      {/* Mobile Menu - Bottom Sheet */}
      <>
        {/* Test - Remove all classes and use pure inline styles */}
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            display: isOpen ? 'block' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9998
          }}
        />
        
        {/* Bottom Sheet Menu */}
        <div 
          style={{
            display: isOpen ? 'block' : 'none',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: theme === 'matrix' ? '#0d1117' : theme === 'monokai' ? '#272822' : '#ffffff',
            color: theme === 'matrix' ? '#00ff00' : theme === 'monokai' ? '#f8f8f2' : '#000000',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -10px 25px rgba(0,0,0,0.3)',
            maxHeight: '60vh',
            overflowY: 'auto',
            borderTop: theme === 'matrix' ? '1px solid #30363d' : theme === 'monokai' ? '1px solid #49483e' : '1px solid #e5e7eb'
          }}
        >
          {/* Handle */}
          <div style={{display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '8px'}}>
            <div style={{
              width: '48px', 
              height: '4px', 
              backgroundColor: theme === 'matrix' ? '#6e7681' : theme === 'monokai' ? '#75715e' : '#d1d5db',
              borderRadius: '2px'
            }}></div>
          </div>
          
          {/* Navigation Links */}
          <div style={{padding: '0 24px 16px 24px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    backgroundColor: theme === 'matrix' ? '#21262d' : theme === 'monokai' ? '#3e3d32' : '#f9fafb',
                    color: theme === 'matrix' ? '#c9d1d9' : theme === 'monokai' ? '#f8f8f2' : '#374151',
                    border: `1px solid ${theme === 'matrix' ? '#30363d' : theme === 'monokai' ? '#49483e' : '#e5e7eb'}`,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            {/* Theme Section */}
            <div style={{
              marginTop: '16px', 
              paddingTop: '12px', 
              borderTop: `1px solid ${theme === 'matrix' ? '#30363d' : theme === 'monokai' ? '#49483e' : '#e5e7eb'}`
            }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme === 'matrix' ? '#8b949e' : theme === 'monokai' ? '#75715e' : '#6b7280',
                marginBottom: '8px',
                paddingLeft: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Theme
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
                {themes.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setTheme(value);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '12px',
                      border: `1px solid ${theme === 'matrix' ? '#30363d' : theme === 'monokai' ? '#49483e' : '#e5e7eb'}`,
                      backgroundColor: theme === value 
                        ? '#3b82f6' 
                        : theme === 'matrix' ? '#21262d' : theme === 'monokai' ? '#3e3d32' : '#f9fafb',
                      color: theme === value 
                        ? '#ffffff' 
                        : theme === 'matrix' ? '#c9d1d9' : theme === 'monokai' ? '#f8f8f2' : '#374151',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Navbar;