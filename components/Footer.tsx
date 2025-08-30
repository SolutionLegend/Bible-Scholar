import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300/50 dark:border-gray-700/50 pt-4">
        <p>&copy; {new Date().getFullYear()} Bible Scholar. All Rights Reserved.</p>
        <p className="mt-1">AI-Powered Biblical Learning</p>
      </div>
    </footer>
  );
};

export default Footer;