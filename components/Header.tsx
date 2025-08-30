import React from 'react';
import { BookOpenIcon, InstallIcon } from './icons';

interface HeaderProps {
    onInstallClick: () => void;
    showInstallButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onInstallClick, showInstallButton }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 mr-3 text-indigo-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
              Bible Scholar
            </h1>
        </div>
        {showInstallButton && (
            <button
                onClick={onInstallClick}
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105 animate-fade-in"
                title="Install App"
                aria-label="Install Bible Scholar App"
            >
                <InstallIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Install</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;