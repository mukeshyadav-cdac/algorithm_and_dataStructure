import { useState, useCallback } from 'react';
import { Algorithm, Cell, TestResult } from '../types';
import { validateGridDimensions, parseArrayInput } from '../utils';

/**
 * Custom hook for managing algorithm state
 * Implements the State pattern for managing complex state transitions
 */
export const useAlgorithmState = (algorithms: Algorithm[]) => {
  // Core algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [algorithmParams, setAlgorithmParams] = useState<any>({});

  // Grid state
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [grid, setGrid] = useState<Cell[][]>([]);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(300);

  // UI state
  const [showCode, setShowCode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [customCode, setCustomCode] = useState('');

  // Test state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Computed values
  const currentAlgorithm = algorithms[selectedAlgorithm];
  const currentLanguage = currentAlgorithm?.languages[selectedLanguage] || currentAlgorithm?.languages[0];

  /**
   * Handles algorithm selection with state reset
   */
  const handleAlgorithmChange = useCallback((index: number) => {
    if (index >= 0 && index < algorithms.length) {
      setSelectedAlgorithm(index);
      setSelectedLanguage(0);
      setAlgorithmParams(algorithms[index].defaultParams);
      setCustomCode(algorithms[index].languages[0]?.code || '');
      setTestResults([]);
      setShowTests(false);
    }
  }, [algorithms]);

  /**
   * Handles language selection
   */
  const handleLanguageChange = useCallback((index: number) => {
    if (currentAlgorithm && index >= 0 && index < currentAlgorithm.languages.length) {
      setSelectedLanguage(index);
      setCustomCode(currentAlgorithm.languages[index].code);
      setTestResults([]);
    }
  }, [currentAlgorithm]);

  /**
   * Updates grid dimensions with validation
   */
  const updateGridDimensions = useCallback((newRows: number, newCols: number) => {
    const validated = validateGridDimensions(newRows, newCols);
    setRows(validated.rows);
    setCols(validated.cols);
  }, []);

  /**
   * Updates algorithm parameters
   */
  const updateAlgorithmParams = useCallback((paramName: string, value: any) => {
    setAlgorithmParams((prev: any) => {
      const newParams = { ...prev };
      
      // Parse array inputs if needed
      if (typeof value === 'string' && paramName.includes('array')) {
        newParams[paramName] = parseArrayInput(value);
      } else {
        newParams[paramName] = value;
      }
      
      return newParams;
    });
  }, []);

  /**
   * Resets all state to defaults
   */
  const resetState = useCallback(() => {
    const algorithm = algorithms[selectedAlgorithm];
    if (algorithm) {
      setAlgorithmParams(algorithm.defaultParams);
      setCustomCode(algorithm.languages[0]?.code || '');
      setTestResults([]);
      setShowTests(false);
      setIsAnimating(false);
      setIsRunningTests(false);
    }
  }, [algorithms, selectedAlgorithm]);

  /**
   * Toggles animation state
   */
  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);

  /**
   * Updates animation speed with validation
   */
  const updateAnimationSpeed = useCallback((speed: number) => {
    const validSpeed = Math.max(50, Math.min(2000, speed));
    setAnimationSpeed(validSpeed);
  }, []);

  /**
   * State validation
   */
  const validateState = useCallback(() => {
    const errors: string[] = [];
    
    if (selectedAlgorithm < 0 || selectedAlgorithm >= algorithms.length) {
      errors.push('Invalid algorithm selection');
    }
    
    if (currentAlgorithm && (selectedLanguage < 0 || selectedLanguage >= currentAlgorithm.languages.length)) {
      errors.push('Invalid language selection');
    }
    
    if (rows < 2 || rows > 10) {
      errors.push('Invalid row count (must be 2-10)');
    }
    
    if (cols < 2 || cols > 10) {
      errors.push('Invalid column count (must be 2-10)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [selectedAlgorithm, algorithms, currentAlgorithm, selectedLanguage, rows, cols]);

  /**
   * Gets current state snapshot
   */
  const getStateSnapshot = useCallback(() => ({
    selectedAlgorithm,
    selectedLanguage,
    algorithmParams,
    rows,
    cols,
    grid,
    isAnimating,
    animationSpeed,
    showCode,
    showSettings,
    showTests,
    customCode,
    testResults,
    isRunningTests,
    currentAlgorithm,
    currentLanguage
  }), [
    selectedAlgorithm, selectedLanguage, algorithmParams, rows, cols, grid,
    isAnimating, animationSpeed, showCode, showSettings, showTests, customCode,
    testResults, isRunningTests, currentAlgorithm, currentLanguage
  ]);

  return {
    // State values
    selectedAlgorithm,
    selectedLanguage,
    algorithmParams,
    rows,
    cols,
    grid,
    isAnimating,
    animationSpeed,
    showCode,
    showSettings,
    showTests,
    customCode,
    testResults,
    isRunningTests,
    currentAlgorithm,
    currentLanguage,

    // State setters
    setSelectedAlgorithm,
    setSelectedLanguage,
    setAlgorithmParams,
    setRows,
    setCols,
    setGrid,
    setIsAnimating,
    setAnimationSpeed,
    setShowCode,
    setShowSettings,
    setShowTests,
    setCustomCode,
    setTestResults,
    setIsRunningTests,

    // State handlers
    handleAlgorithmChange,
    handleLanguageChange,
    updateGridDimensions,
    updateAlgorithmParams,
    resetState,
    toggleAnimation,
    updateAnimationSpeed,

    // State utilities
    validateState,
    getStateSnapshot
  };
};
