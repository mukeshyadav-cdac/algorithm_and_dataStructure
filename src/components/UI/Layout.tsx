import React, { ReactNode } from 'react';

/**
 * Layout Props
 */
interface LayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main Layout Component
 * Provides consistent layout structure for the application
 */
export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
