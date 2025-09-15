import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Button component following Composition Pattern
// Single Responsibility: Only renders buttons with consistent styling

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}, ref) => {
  // Strategy Pattern: Different styles for different variants
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 shadow-lg',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-30
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    transform hover:scale-105 active:scale-95
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
  `;

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      className={`${baseClasses} ${className}`.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {loading ? (loadingText || children) : children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
