import React from 'react';

// Badge component following Single Responsibility Principle
// Only responsible for displaying status/category information

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) => {
  // Strategy Pattern: Different styles for different variants
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium rounded-full
    border transition-colors
    ${variants[variant]}
    ${sizes[size]}
  `;

  return (
    <span className={`${baseClasses} ${className}`.trim()}>
      {dot && (
        <span className="w-1.5 h-1.5 bg-current rounded-full" />
      )}
      {children}
    </span>
  );
};

// Specialized badge for difficulty
interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className
}) => {
  const variantMap = {
    easy: 'success' as const,
    medium: 'warning' as const,
    hard: 'danger' as const
  };

  return (
    <Badge 
      variant={variantMap[difficulty]} 
      size="sm" 
      dot
      className={className}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
};

// Specialized badge for complexity
interface ComplexityBadgeProps {
  complexity: string;
  type: 'time' | 'space';
  className?: string;
}

export const ComplexityBadge: React.FC<ComplexityBadgeProps> = ({
  complexity,
  type,
  className
}) => {
  // Determine variant based on complexity
  const getVariant = (): BadgeProps['variant'] => {
    if (complexity.includes('O(1)') || complexity.includes('O(log')) {
      return 'success';
    }
    if (complexity.includes('O(n)')) {
      return 'info';
    }
    if (complexity.includes('O(n²)') || complexity.includes('O(n×')) {
      return 'warning';
    }
    if (complexity.includes('O(2^') || complexity.includes('exponential')) {
      return 'danger';
    }
    return 'default';
  };

  const prefix = type === 'time' ? 'T:' : 'S:';

  return (
    <Badge 
      variant={getVariant()} 
      size="sm" 
      className={`font-mono ${className}`}
    >
      {prefix} {complexity}
    </Badge>
  );
};

export default Badge;
