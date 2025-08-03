import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-10 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold">
              Shawn Brown
            </Link>
            <p className="text-gray-400 mt-2">
              &copy; {new Date().getFullYear()} Shawn Brown. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/ShawnBrownDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;