// Parsing utilities following Single Responsibility Principle (SRP)

/**
 * Parse array input from string
 * SRP: Only handles array parsing
 */
export const parseArrayInput = (input: string): number[] => {
  try {
    // Remove brackets and split by comma
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
    console.warn('Failed to parse array input:', input);
    return [];
  }
};

/**
 * Format array for display
 * SRP: Only handles array formatting
 */
export const formatArray = (arr: (number | string)[]): string => {
  if (arr.length === 0) return '[]';
  return `[${arr.join(', ')}]`;
};

/**
 * Validate array input
 * SRP: Only validates arrays
 */
export const validateArrayInput = (input: string): { valid: boolean; error?: string } => {
  try {
    const parsed = parseArrayInput(input);
    if (parsed.length === 0 && input.trim() !== '[]') {
      return { valid: false, error: 'Invalid array format' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Parse parameter from string based on type
 * SRP: Only handles parameter parsing
 */
export const parseParameter = (value: string, type: string): unknown => {
  switch (type) {
    case 'number':
      const num = parseFloat(value);
      if (isNaN(num)) throw new Error('Invalid number');
      return num;
    
    case 'array':
      return parseArrayInput(value);
    
    case 'boolean':
      return value.toLowerCase() === 'true';
    
    case 'string':
    default:
      return value;
  }
};
