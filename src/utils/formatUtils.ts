/**
 * Formatting utility functions
 */

/**
 * Formats cell values for display
 * @param value - Value to format
 * @returns Formatted string representation
 */
export const formatCellValue = (value: number | string): string => {
  if (typeof value === 'number') {
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    if (value > 999999) return '999k+';
    return value.toString();
  }
  return value.toString();
};

/**
 * Formats execution time for display
 * @param timeMs - Time in milliseconds
 * @returns Formatted time string
 */
export const formatExecutionTime = (timeMs: number): string => {
  if (timeMs < 1) return '<1ms';
  if (timeMs < 1000) return `${Math.round(timeMs)}ms`;
  return `${(timeMs / 1000).toFixed(2)}s`;
};

/**
 * Formats test results summary
 * @param passed - Number of passed tests
 * @param total - Total number of tests
 * @returns Formatted summary string
 */
export const formatTestSummary = (passed: number, total: number): string => {
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
  return `${passed}/${total} (${percentage}%)`;
};

/**
 * Formats algorithm complexity notation
 * @param complexity - Complexity string (e.g., "O(n²)")
 * @returns Formatted complexity with proper symbols
 */
export const formatComplexity = (complexity: string): string => {
  return complexity
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\*/g, '×')
    .replace(/log/g, 'log');
};

/**
 * Capitalizes first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats large numbers with appropriate suffixes
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Formats code for display with proper indentation
 * @param code - Code string to format
 * @param language - Programming language for syntax-specific formatting
 * @returns Formatted code string
 */
export const formatCode = (code: string, language: string = 'javascript'): string => {
  // Basic code formatting - in a real implementation, you might use a proper formatter
  const lines = code.split('\n');
  let indentLevel = 0;
  
  return lines.map(line => {
    const trimmed = line.trim();
    
    // Decrease indent for closing braces/brackets
    if (trimmed.match(/^[\}\]\)]/)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    const formatted = '  '.repeat(indentLevel) + trimmed;
    
    // Increase indent for opening braces/brackets
    if (trimmed.match(/[\{\[\(]$/)) {
      indentLevel++;
    }
    
    return formatted;
  }).join('\n');
};

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Formats JSON for pretty display
 * @param obj - Object to stringify
 * @param indent - Indentation spaces
 * @returns Formatted JSON string
 */
export const formatJSON = (obj: any, indent: number = 2): string => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return obj?.toString() || 'undefined';
  }
};
