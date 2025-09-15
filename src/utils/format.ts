// Formatting utilities following Single Responsibility Principle (SRP)

/**
 * Number formatting utilities
 * SRP: Only handles number formatting
 */
export const formatNumber = {
  /**
   * Format execution time
   */
  executionTime: (ms: number): string => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  },

  /**
   * Format memory usage
   */
  memory: (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  },

  /**
   * Format large numbers with appropriate suffixes
   */
  compact: (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    return `${(num / 1000000000).toFixed(1)}B`;
  },

  /**
   * Format percentage
   */
  percentage: (value: number, total: number, decimals = 1): string => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(decimals)}%`;
  },

  /**
   * Format complexity notation
   */
  complexity: (notation: string): string => {
    return notation
      .replace(/\*/, '×')
      .replace(/\^(\d+)/g, '<sup>$1</sup>')
      .replace(/log\(/g, 'log(')
      .replace(/O\(/g, 'O(');
  },
};

/**
 * String formatting utilities
 * SRP: Only handles string transformations
 */
export const formatString = {
  /**
   * Convert camelCase to Title Case
   */
  toTitleCase: (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, match => match.toUpperCase())
      .trim();
  },

  /**
   * Convert string to kebab-case
   */
  toKebabCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
  },

  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Format code for display
   */
  formatCode: (code: string, language: string): string => {
    // Basic code formatting - could be enhanced with a proper formatter
    return code
      .trim()
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  },
};

/**
 * Array formatting utilities
 * SRP: Only handles array display formatting
 */
export const formatArray = {
  /**
   * Parse string input to number array
   */
  parseNumbers: (input: string): number[] => {
    try {
      const cleaned = input.replace(/[\[\]]/g, '');
      return cleaned
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => {
          const num = parseFloat(item);
          if (isNaN(num)) throw new Error(`Invalid number: ${item}`);
          return num;
        });
    } catch (error) {
      throw new Error(`Invalid array format: ${input}`);
    }
  },

  /**
   * Format array for display
   */
  display: (arr: (number | string)[], maxItems = 10): string => {
    if (arr.length === 0) return '[]';
    
    const displayItems = arr.slice(0, maxItems);
    const formatted = displayItems.map(item => 
      typeof item === 'number' ? formatNumber.compact(item) : item
    );
    
    const result = `[${formatted.join(', ')}]`;
    
    if (arr.length > maxItems) {
      return `${result.slice(0, -1)}, ...${arr.length - maxItems} more]`;
    }
    
    return result;
  },

  /**
   * Format 2D array for display
   */
  display2D: (matrix: (number | string)[][]): string => {
    if (matrix.length === 0) return '[]';
    
    const maxRows = 5;
    const displayRows = matrix.slice(0, maxRows);
    
    const formatted = displayRows.map(row => formatArray.display(row, 5));
    
    let result = `[\n  ${formatted.join(',\n  ')}\n]`;
    
    if (matrix.length > maxRows) {
      result = result.slice(0, -2) + `,\n  ...${matrix.length - maxRows} more rows\n]`;
    }
    
    return result;
  },
};

/**
 * Date and time formatting utilities
 * SRP: Only handles date/time formatting
 */
export const formatTime = {
  /**
   * Format date for display
   */
  date: (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  },

  /**
   * Format time for display
   */
  time: (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  },

  /**
   * Format relative time (e.g., "2 minutes ago")
   */
  relative: (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return formatTime.date(date);
  },

  /**
   * Format duration in milliseconds to human readable
   */
  duration: (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  },
};
