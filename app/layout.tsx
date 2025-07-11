import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shawn Brown | Portfolio',
  description: 'Full Stack Developer Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body 
        className={cn(inter.className, "bg-background text-foreground antialiased")}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}