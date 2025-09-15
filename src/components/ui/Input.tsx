import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Base Input Props following ISP
 * ISP: Separates basic input functionality
 */
interface BaseInputProps {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Extended Input Props for validation and styling
 * ISP: Adds validation and styling concerns
 */
interface ExtendedInputProps extends BaseInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Full Input Props with advanced features
 * ISP: Complete input interface
 */
export interface InputProps extends ExtendedInputProps {
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
  onRightIconClick?: () => void;
}

/**
 * Input Component using forwardRef for form libraries
 * Single Responsibility: Handles text input with consistent styling
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  disabled = false,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  type = 'text',
  size = 'md',
  error = false,
  helperText,
  label,
  required = false,
  min,
  max,
  step,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
}, ref) => {
  // Strategy Pattern: Different styles for different sizes
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const baseStyles = `
    w-full rounded-lg border bg-white transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
  `;

  const statusStyles = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';

  const iconPadding = {
    left: LeftIcon ? 'pl-10' : '',
    right: RightIcon ? 'pr-10' : '',
  };

  const computedClassName = [
    baseStyles,
    statusStyles,
    sizeStyles[size],
    iconPadding.left,
    iconPadding.right,
    className
  ].join(' ');

  const inputId = React.useId();

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={computedClassName}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          required={required}
          min={min}
          max={max}
          step={step}
          aria-invalid={error}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
        />
        
        {RightIcon && (
          <div 
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
            }`}
            onClick={onRightIconClick}
          >
            <RightIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </div>
        )}
      </div>
      
      {helperText && (
        <div id={`${inputId}-helper`} className="mt-2 flex items-center">
          {error && <AlertCircle className="h-4 w-4 text-red-500 mr-1" />}
          <span className={`text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
            {helperText}
          </span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Number Input Component - Specialized for numeric inputs
 * Composition Pattern: Built on top of base Input
 */
interface NumberInputProps extends Omit<InputProps, 'type' | 'leftIcon' | 'rightIcon'> {
  onValueChange?: (value: number | null) => void;
  allowNegative?: boolean;
  allowDecimal?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  onValueChange,
  onChange,
  allowNegative = true,
  allowDecimal = true,
  ...props
}, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Call original onChange if provided
    if (onChange) {
      onChange(event);
    }
    
    // Parse and validate number
    if (onValueChange) {
      if (value === '') {
        onValueChange(null);
        return;
      }
      
      const numValue = parseFloat(value);
      
      if (!isNaN(numValue)) {
        // Apply validation rules
        if (!allowNegative && numValue < 0) {
          return; // Don't update if negative not allowed
        }
        
        onValueChange(numValue);
      }
    }
  };

  return (
    <Input
      {...props}
      ref={ref}
      type="number"
      onChange={handleChange}
      step={allowDecimal ? 'any' : '1'}
    />
  );
});

NumberInput.displayName = 'NumberInput';

/**
 * Search Input Component - Specialized for search functionality
 * Composition Pattern: Built on top of base Input
 */
interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onClear,
  showClearButton = true,
  onChange,
  ...props
}) => {
  const [query, setQuery] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    
    if (onChange) {
      onChange(event);
    }
    
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <Input
      {...props}
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={props.placeholder || 'Search...'}
      rightIcon={showClearButton && query ? 
        (() => <button onClick={handleClear}>✕</button>) as React.ComponentType<{ className?: string }> : 
        undefined
      }
      onRightIconClick={showClearButton && query ? handleClear : undefined}
    />
  );
};

export default Input;
