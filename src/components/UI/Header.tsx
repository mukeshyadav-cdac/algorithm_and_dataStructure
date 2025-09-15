import React from 'react';
import { HeaderProps } from '../../types';

/**
 * Header Component
 * Displays the main title and subtitle of the application
 */
export const Header: React.FC<HeaderProps> = ({ 
  title = "Dynamic Programming Algorithm Visualizer",
  subtitle = "Interactive visualization of classic DP algorithms with multi-language support"
}) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <p className="text-gray-600 text-lg">
        {subtitle}
      </p>
    </div>
  );
};
