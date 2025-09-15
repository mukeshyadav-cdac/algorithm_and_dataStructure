import React from 'react';
import { motion } from 'framer-motion';

// Card component following Composition Pattern
// Single Responsibility: Provides consistent card layout

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-white border-2 border-gray-300'
  };

  const baseClasses = `
    rounded-2xl overflow-hidden transition-all duration-200
    ${variants[variant]}
    ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  if (hoverable || onClick) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${className}`.trim()}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  children
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 leading-6">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 leading-5">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
        {actions && (
          <div className="flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  noPadding = false
}) => {
  const paddingClasses = noPadding ? '' : 'px-6 py-4';
  
  return (
    <div className={`${paddingClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`.trim()}>
      {children}
    </div>
  );
};

// Compound component pattern
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
