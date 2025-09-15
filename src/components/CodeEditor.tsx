import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Code, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  Download
} from 'lucide-react';
import { Language, TestResult } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

// Code Editor following Single Responsibility and Strategy patterns
// SRP: Only handles code display and execution
// Strategy: Different languages are different strategies

interface CodeEditorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onRunTests: (language: string) => Promise<TestResult[]>;
  className?: string;
}

interface TestResultsProps {
  results: TestResult[];
  isLoading: boolean;
}

const TestResults: React.FC<TestResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-600">Running tests...</span>
        </div>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === results.length;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-gray-200 pt-4"
    >
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {allPassed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-medium">
            {passedCount}/{results.length} tests passed
          </span>
        </div>
        <Badge 
          variant={allPassed ? 'success' : 'danger'}
          size="sm"
        >
          {allPassed ? 'All Passed' : 'Some Failed'}
        </Badge>
      </div>

      {/* Individual test results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-3 rounded-lg border-l-4 
              ${result.passed 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="font-medium text-sm">
                  {result.description}
                </span>
              </div>
              {result.executionTime && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {result.executionTime.toFixed(2)}ms
                </div>
              )}
            </div>
            
            <div className="text-sm space-y-1">
              <div>Expected: <code className="bg-gray-100 px-1 rounded">{String(result.expected)}</code></div>
              <div>Actual: <code className="bg-gray-100 px-1 rounded">{String(result.actual)}</code></div>
              {result.error && (
                <div className="text-red-600 font-mono text-xs mt-2">
                  {result.error}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  onRunTests,
  className = ''
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentLanguage = languages.find(lang => lang.name.toLowerCase() === selectedLanguage.toLowerCase());

  const handleRunTests = async () => {
    if (!currentLanguage) return;

    setIsRunningTests(true);
    setShowResults(true);

    try {
      const results = await onRunTests(currentLanguage.name);
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
      setTestResults([]);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleCopyCode = async () => {
    if (currentLanguage) {
      await navigator.clipboard.writeText(currentLanguage.code);
    }
  };

  const handleDownloadCode = () => {
    if (!currentLanguage) return;

    const blob = new Blob([currentLanguage.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algorithm.${currentLanguage.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentLanguage) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500">No language selected</div>
      </div>
    );
  }

  return (
    <div className={`code-editor ${className}`}>
      <Card>
        <CardHeader
          icon={<Code className="w-5 h-5 text-blue-600" />}
          title="Code Implementation"
          subtitle={`${currentLanguage.name} implementation with test execution`}
          actions={
            <div className="flex gap-2">
              {/* Language selector */}
              <select
                value={currentLanguage.name}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.name} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>

              {/* Runtime status */}
              <Badge
                variant={
                  currentLanguage.runtimeStatus === 'ready' ? 'success' :
                  currentLanguage.runtimeStatus === 'loading' ? 'warning' : 'danger'
                }
                size="sm"
                dot
              >
                {currentLanguage.runtimeStatus}
              </Badge>
            </div>
          }
        />

        <CardContent noPadding>
          {/* Code display */}
          <div className="relative">
            <SyntaxHighlighter
              language={currentLanguage.extension === 'js' ? 'javascript' : currentLanguage.extension}
              style={tomorrow}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '14px',
                lineHeight: '1.5'
              }}
              showLineNumbers={true}
            >
              {currentLanguage.code}
            </SyntaxHighlighter>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyCode}
                icon={<Copy className="w-4 h-4" />}
              >
                Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownloadCode}
                icon={<Download className="w-4 h-4" />}
              >
                Download
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Ready to test the implementation
              </div>
              <Button
                onClick={handleRunTests}
                loading={isRunningTests}
                loadingText="Running..."
                disabled={currentLanguage.runtimeStatus !== 'ready'}
                icon={<Play className="w-4 h-4" />}
              >
                Run Tests
              </Button>
            </div>
          </div>

          {/* Test Results */}
          <AnimatePresence>
            {showResults && (
              <div className="p-6">
                <TestResults 
                  results={testResults} 
                  isLoading={isRunningTests} 
                />
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;
