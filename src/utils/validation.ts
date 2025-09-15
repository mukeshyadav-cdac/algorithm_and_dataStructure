// Validation utilities following Single Responsibility Principle (SRP)

/**
 * Input validation results
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Number validation utilities
 * SRP: Only validates numeric inputs
 */
export const validateNumber = {
  /**
   * Validate if value is a valid number within range
   */
  inRange: (value: number, min?: number, max?: number): ValidationResult => {
    const errors: string[] = [];

    if (isNaN(value)) {
      errors.push('Value must be a valid number');
    } else {
      if (min !== undefined && value < min) {
        errors.push(`Value must be at least ${min}`);
      }
      if (max !== undefined && value > max) {
        errors.push(`Value must be at most ${max}`);
      }
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate positive integer
   */
  positiveInteger: (value: number): ValidationResult => {
    const errors: string[] = [];

    if (isNaN(value)) {
      errors.push('Value must be a valid number');
    } else if (!Number.isInteger(value)) {
      errors.push('Value must be an integer');
    } else if (value <= 0) {
      errors.push('Value must be positive');
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate array size parameters
   */
  arraySize: (size: number, maxSize = 1000): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (isNaN(size) || !Number.isInteger(size)) {
      errors.push('Size must be a valid integer');
    } else if (size <= 0) {
      errors.push('Size must be positive');
    } else if (size > maxSize) {
      errors.push(`Size cannot exceed ${maxSize}`);
    } else if (size > 100) {
      warnings.push('Large arrays may impact performance');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
};

/**
 * Array validation utilities
 * SRP: Only validates array inputs
 */
export const validateArray = {
  /**
   * Validate number array
   */
  numbers: (arr: unknown[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(arr)) {
      errors.push('Value must be an array');
      return { valid: false, errors };
    }

    if (arr.length === 0) {
      warnings.push('Array is empty');
    }

    arr.forEach((item, index) => {
      if (typeof item !== 'number' || isNaN(item)) {
        errors.push(`Item at index ${index} is not a valid number`);
      }
    });

    if (arr.length > 1000) {
      warnings.push('Large arrays may impact performance');
    }

    return { valid: errors.length === 0, errors, warnings };
  },

  /**
   * Validate weights and values arrays for knapsack
   */
  knapsackArrays: (weights: number[], values: number[]): ValidationResult => {
    const errors: string[] = [];

    if (weights.length !== values.length) {
      errors.push('Weights and values arrays must have the same length');
    }

    weights.forEach((weight, index) => {
      if (weight <= 0) {
        errors.push(`Weight at index ${index} must be positive`);
      }
    });

    values.forEach((value, index) => {
      if (value < 0) {
        errors.push(`Value at index ${index} cannot be negative`);
      }
    });

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate sequence for LIS
   */
  sequence: (arr: number[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (arr.length === 0) {
      errors.push('Sequence cannot be empty');
    }

    if (arr.length === 1) {
      warnings.push('Single-element sequence will have LIS length 1');
    }

    const hasNaN = arr.some(x => isNaN(x));
    if (hasNaN) {
      errors.push('All elements must be valid numbers');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
};

/**
 * Algorithm parameter validation
 * SRP: Only validates algorithm-specific parameters
 */
export const validateAlgorithmParams = {
  /**
   * Validate unique paths parameters
   */
  uniquePaths: (m: number, n: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mValidation = validateNumber.positiveInteger(m);
    const nValidation = validateNumber.positiveInteger(n);

    errors.push(...mValidation.errors, ...nValidation.errors);

    if (mValidation.valid && nValidation.valid) {
      if (m * n > 10000) {
        warnings.push('Large grid may impact performance');
      }
      if (m > 20 || n > 20) {
        warnings.push('Grid visualization may be difficult to read');
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  },

  /**
   * Validate coin change parameters
   */
  coinChange: (coins: number[], amount: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const amountValidation = validateNumber.inRange(amount, 0, 10000);
    errors.push(...amountValidation.errors);

    const coinsValidation = validateArray.numbers(coins);
    errors.push(...coinsValidation.errors);

    if (coinsValidation.valid) {
      coins.forEach((coin, index) => {
        if (coin <= 0) {
          errors.push(`Coin at index ${index} must be positive`);
        }
      });

      if (coins.length === 0) {
        errors.push('At least one coin denomination is required');
      }

      if (amount > 1000) {
        warnings.push('Large amounts may impact performance');
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  },

  /**
   * Validate knapsack parameters
   */
  knapsack: (weights: number[], values: number[], capacity: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const arrayValidation = validateArray.knapsackArrays(weights, values);
    errors.push(...arrayValidation.errors);

    const capacityValidation = validateNumber.inRange(capacity, 1, 1000);
    errors.push(...capacityValidation.errors);

    if (arrayValidation.valid && capacityValidation.valid) {
      if (weights.length * capacity > 10000) {
        warnings.push('Large problem size may impact performance');
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  },

  /**
   * Validate climbing stairs parameters
   */
  climbingStairs: (n: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const validation = validateNumber.inRange(n, 1, 50);
    errors.push(...validation.errors);

    if (validation.valid && n > 30) {
      warnings.push('Large values may cause performance issues with recursive approaches');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
};

/**
 * Code validation utilities
 * SRP: Only validates code input
 */
export const validateCode = {
  /**
   * Basic syntax validation for JavaScript
   */
  javascript: (code: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!code.trim()) {
      errors.push('Code cannot be empty');
      return { valid: false, errors };
    }

    // Basic checks
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Mismatched curly braces');
    }

    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Mismatched parentheses');
    }

    // Check for function declaration/expression
    if (!code.includes('function') && !code.includes('=>')) {
      warnings.push('Code should contain a function');
    }

    return { valid: errors.length === 0, errors, warnings };
  },

  /**
   * Check for potentially unsafe code
   */
  safety: (code: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const dangerousPatterns = [
      { pattern: /eval\s*\(/, message: 'eval() is not allowed' },
      { pattern: /Function\s*\(/, message: 'Function constructor is not allowed' },
      { pattern: /window\./, message: 'Window object access is not allowed' },
      { pattern: /document\./, message: 'Document object access is not allowed' },
      { pattern: /localStorage/, message: 'localStorage access is not allowed' },
      { pattern: /sessionStorage/, message: 'sessionStorage access is not allowed' },
    ];

    dangerousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(code)) {
        errors.push(message);
      }
    });

    // Check for infinite loops (basic)
    if (/while\s*\(\s*true\s*\)/.test(code) || /for\s*\(\s*;;\s*\)/.test(code)) {
      warnings.push('Potential infinite loop detected');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
};
