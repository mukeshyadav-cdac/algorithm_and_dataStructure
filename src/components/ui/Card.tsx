import React from 'react';

/**
 * Card component props following Interface Segregation
 * ISP: Separates basic card props from extended functionality
 */
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
}

interface InteractiveCardProps extends BaseCardProps {
  onClick?: () => void;
  hoverable?: boolean;
}

interface BorderCardProps extends InteractiveCardProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
}

export interface CardProps extends BorderCardProps {}

/**
 * Main Card Component
 * Single Responsibility: Provides consistent card layout and styling
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default',
}) => {
  // Strategy Pattern: Different styles for different variants
  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white border border-gray-200 shadow-lg',
    flat: 'bg-gray-50',
  };

  const interactionStyles = onClick || hoverable 
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5' 
    : '';

  const baseStyles = 'rounded-lg overflow-hidden';
  
  const computedClassName = [
    baseStyles,
    variantStyles[variant],
    interactionStyles,
    className
  ].join(' ');

  const CardElement = onClick ? 'button' : 'div';

  return (
    <CardElement 
      className={computedClassName}
      onClick={onClick}
      {...(onClick && { type: 'button' })}
    >
      {children}
    </CardElement>
  );
};

/**
 * Card Header Component - Composition Pattern
 * Single Responsibility: Provides consistent card header styling
 */
interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Card Content Component - Composition Pattern
 * Single Responsibility: Provides consistent card content padding
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  noPadding = false,
}) => {
  const paddingStyles = noPadding ? '' : 'p-6';
  
  return (
    <div className={`${paddingStyles} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Footer Component - Composition Pattern
 * Single Responsibility: Provides consistent card footer styling
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  actions,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {children}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Statistics Card - Specialized Card Component
 * Composition Pattern: Built using base Card components
 */
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card variant="elevated" className={className}>
      <CardContent>
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className={`mt-2 text-sm ${trendColors[trend.direction]}`}>
                {trend.value}
              </div>
            )}
          </div>
          {Icon && (
            <div className="ml-4 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Card;
