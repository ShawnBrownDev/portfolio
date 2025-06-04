import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'John Doe | Full Stack Developer',
  description: 'Professional portfolio showcasing my projects and skills as a full stack developer and system architect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={cn(inter.className, "bg-background text-foreground antialiased")}>
        {children}
      </body>
    </html>
  );
}