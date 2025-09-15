import React, { createContext, useContext, ReactNode } from 'react';
import { useAlgorithmVisualizer } from '../hooks';
import { algorithms } from '../constants';

/**
 * Algorithm Context Type
 */
type AlgorithmContextType = ReturnType<typeof useAlgorithmVisualizer>;

/**
 * Algorithm Context
 */
const AlgorithmContext = createContext<AlgorithmContextType | null>(null);

/**
 * Algorithm Context Provider Props
 */
interface AlgorithmProviderProps {
  children: ReactNode;
}

/**
 * Algorithm Context Provider
 * Provides global access to algorithm visualization functionality
 */
export const AlgorithmProvider: React.FC<AlgorithmProviderProps> = ({ children }) => {
  const algorithmVisualizer = useAlgorithmVisualizer(algorithms);

  return (
    <AlgorithmContext.Provider value={algorithmVisualizer}>
      {children}
    </AlgorithmContext.Provider>
  );
};

/**
 * Custom hook to use Algorithm Context
 * Throws error if used outside of AlgorithmProvider
 */
export const useAlgorithmContext = (): AlgorithmContextType => {
  const context = useContext(AlgorithmContext);
  
  if (!context) {
    throw new Error('useAlgorithmContext must be used within an AlgorithmProvider');
  }
  
  return context;
};

/**
 * HOC for components that need algorithm context
 */
export const withAlgorithmContext = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <AlgorithmProvider>
      <Component {...props} ref={ref} />
    </AlgorithmProvider>
  ));
};
