import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button component props following Interface Segregation Principle
 * ISP: Separates different button concerns
 */
interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

interface LoadingButtonProps extends BaseButtonProps {
  loading?: boolean;
  loadingText?: string;
}

interface VariantButtonProps extends LoadingButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export interface ButtonProps extends VariantButtonProps {}

/**
 * Button Component following Composition Pattern
 * Single Responsibility: Only renders button with consistent styling
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}) => {
  // Strategy Pattern: Different styles for different variants
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const computedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ].join(' ');

  const isDisabled = disabled || loading;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      className={computedClassName}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
      )}
      {loading ? (loadingText || children) : children}
    </button>
  );
};

/**
 * Icon Button Component - Composition over inheritance
 * Single Responsibility: Button specifically for icons
 */
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ComponentType<{ className?: string }>;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  'aria-label': ariaLabel,
  size = 'md',
  ...props
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Button 
      {...props} 
      size={size} 
      className={`p-2 ${props.className || ''}`}
      aria-label={ariaLabel}
    >
      <Icon className={iconSizes[size]} />
    </Button>
  );
};

/**
 * Button Group Component - Composition Pattern
 * Single Responsibility: Groups buttons with consistent spacing
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  const orientationStyles = {
    horizontal: 'flex items-center space-x-2',
    vertical: 'flex flex-col space-y-2',
  };

  return (
    <div className={`${orientationStyles[orientation]} ${className}`}>
      {children}
    </div>
  );
};

export default Button;
