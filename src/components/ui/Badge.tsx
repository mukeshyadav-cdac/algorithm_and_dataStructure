import React from 'react';

/**
 * Badge component props following ISP
 * ISP: Separates basic badge from variant-specific properties
 */
interface BaseBadgeProps {
  children: React.ReactNode;
  className?: string;
}

interface VariantBadgeProps extends BaseBadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

interface DotBadgeProps extends VariantBadgeProps {
  dot?: boolean;
}

export interface BadgeProps extends DotBadgeProps {}

/**
 * Badge Component
 * Single Responsibility: Displays status/category information consistently
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  dot = false,
}) => {
  // Strategy Pattern: Different styles for different variants
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const computedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ].join(' ');

  return (
    <span className={computedClassName}>
      {dot && (
        <span className="w-1.5 h-1.5 mr-1.5 bg-current rounded-full" />
      )}
      {children}
    </span>
  );
};

/**
 * Complexity Badge - Specialized Badge for algorithm complexity
 * Composition Pattern: Built on top of base Badge
 */
interface ComplexityBadgeProps {
  complexity: string;
  type: 'time' | 'space';
  className?: string;
}

export const ComplexityBadge: React.FC<ComplexityBadgeProps> = ({
  complexity,
  type,
  className,
}) => {
  // Strategy Pattern: Different colors based on complexity severity
  const getVariant = (complexityStr: string): BadgeProps['variant'] => {
    if (complexityStr.includes('O(1)') || complexityStr.includes('O(log')) {
      return 'success';
    }
    if (complexityStr.includes('O(n)')) {
      return 'info';
    }
    if (complexityStr.includes('O(n²)') || complexityStr.includes('O(n×')) {
      return 'warning';
    }
    if (complexityStr.includes('O(2^') || complexityStr.includes('exponential')) {
      return 'danger';
    }
    return 'default';
  };

  const variant = getVariant(complexity);
  const prefix = type === 'time' ? 'T:' : 'S:';

  return (
    <Badge variant={variant} size="sm" className={className}>
      <span className="font-mono">
        {prefix} {complexity}
      </span>
    </Badge>
  );
};

/**
 * Difficulty Badge - Specialized Badge for algorithm difficulty
 * Composition Pattern: Built on top of base Badge
 */
interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className,
}) => {
  const variantMap: Record<string, BadgeProps['variant']> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  };

  return (
    <Badge 
      variant={variantMap[difficulty]} 
      size="sm" 
      className={className}
      dot
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
};

/**
 * Status Badge - Specialized Badge for runtime/execution status
 * Composition Pattern: Built on top of base Badge
 */
interface StatusBadgeProps {
  status: 'ready' | 'loading' | 'error' | 'success' | 'simulated';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const statusConfig = {
    ready: { variant: 'success' as const, text: 'Ready' },
    loading: { variant: 'warning' as const, text: 'Loading' },
    error: { variant: 'danger' as const, text: 'Error' },
    success: { variant: 'success' as const, text: 'Success' },
    simulated: { variant: 'info' as const, text: 'Simulated' },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant} 
      size="sm" 
      className={className}
      dot
    >
      {config.text}
    </Badge>
  );
};

export default Badge;
