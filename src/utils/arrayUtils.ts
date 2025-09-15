/**
 * Array utility functions for algorithm processing
 */

/**
 * Safely parses array input from string
 * @param input - Input string to parse
 * @returns Parsed array or original input
 */
export const parseArrayInput = (input: string): any => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return parsed;
  } catch {
    // Fallback to comma-separated parsing
    return input.split(',').map(x => {
      const trimmed = x.trim();
      const num = parseFloat(trimmed);
      return isNaN(num) ? trimmed : num;
    });
  }
};

/**
 * Validates array input for algorithm parameters
 * @param arr - Array to validate
 * @param type - Expected type ('number' | 'string')
 * @returns Validation result
 */
export const validateArrayInput = (
  arr: any[], 
  type: 'number' | 'string' = 'number'
): { isValid: boolean; error?: string; correctedArray?: any[] } => {
  if (!Array.isArray(arr)) {
    return { isValid: false, error: 'Input must be an array' };
  }

  if (arr.length === 0) {
    return { isValid: false, error: 'Array cannot be empty' };
  }

  const correctedArray = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    
    if (type === 'number') {
      const num = Number(item);
      if (isNaN(num)) {
        return { isValid: false, error: `Item at index ${i} is not a valid number: ${item}` };
      }
      correctedArray.push(num);
    } else {
      correctedArray.push(String(item));
    }
  }

  return { isValid: true, correctedArray };
};

/**
 * Creates a deep clone of an array
 * @param arr - Array to clone
 * @returns Deep cloned array
 */
export const deepCloneArray = <T>(arr: T[]): T[] => {
  return JSON.parse(JSON.stringify(arr));
};

/**
 * Safely gets array element with bounds checking
 * @param arr - Array to access
 * @param index - Index to access
 * @param defaultValue - Default value if index is out of bounds
 * @returns Array element or default value
 */
export const safeArrayAccess = <T>(arr: T[], index: number, defaultValue: T): T => {
  if (index < 0 || index >= arr.length) {
    return defaultValue;
  }
  return arr[index];
};

/**
 * Chunks array into smaller arrays of specified size
 * @param arr - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 */
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Finds all indices of a value in an array
 * @param arr - Array to search
 * @param value - Value to find
 * @returns Array of indices
 */
export const findAllIndices = <T>(arr: T[], value: T): number[] => {
  const indices: number[] = [];
  arr.forEach((item, index) => {
    if (item === value) {
      indices.push(index);
    }
  });
  return indices;
};

/**
 * Generates range array
 * @param start - Start value (inclusive)
 * @param end - End value (exclusive)
 * @param step - Step size
 * @returns Range array
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Shuffles array using Fisher-Yates algorithm
 * @param arr - Array to shuffle
 * @returns Shuffled copy of array
 */
export const shuffleArray = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Groups array elements by a key function
 * @param arr - Array to group
 * @param keyFn - Function to generate grouping key
 * @returns Object with grouped items
 */
export const groupBy = <T, K extends string | number>(
  arr: T[], 
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};
