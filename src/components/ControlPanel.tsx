import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Sliders,
  Zap,
  Clock,
  Grid3X3
} from 'lucide-react';
import { AnimationState, ParameterControl, UserPreferences } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';
import { parseParameter, validateArrayInput } from '../utils';

// Control Panel following Single Responsibility Principle
// SRP: Only handles animation and parameter controls

interface ControlPanelProps {
  animationState: AnimationState;
  parameters: Record<string, unknown>;
  paramControls: ParameterControl[];
  preferences: UserPreferences;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onParameterChange: (name: string, value: unknown) => void;
  onPreferenceChange: (key: keyof UserPreferences, value: unknown) => void;
  className?: string;
}

interface ParameterInputProps {
  control: ParameterControl;
  value: unknown;
  onChange: (value: unknown) => void;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  control,
  value,
  onChange
}) => {
  const [inputValue, setInputValue] = React.useState(String(value));
  const [error, setError] = React.useState('');

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    setError('');

    try {
      if (control.type === 'array') {
        const validation = validateArrayInput(newValue);
        if (!validation.valid) {
          setError(validation.error || 'Invalid input');
          return;
        }
      }

      const parsedValue = parseParameter(newValue, control.type);
      
      // Validate number ranges
      if (control.type === 'number') {
        const num = parsedValue as number;
        if (control.min !== undefined && num < control.min) {
          setError(`Minimum value is ${control.min}`);
          return;
        }
        if (control.max !== undefined && num > control.max) {
          setError(`Maximum value is ${control.max}`);
          return;
        }
      }

      onChange(parsedValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {control.label}
        {control.description && (
          <span className="text-gray-500 font-normal ml-1">
            ({control.description})
          </span>
        )}
      </label>
      
      {control.type === 'number' && control.min !== undefined && control.max !== undefined ? (
        // Range slider for numbers with min/max
        <div className="space-y-2">
          <input
            type="range"
            min={control.min}
            max={control.max}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{control.min}</span>
            <span className="font-medium">{String(value)}</span>
            <span>{control.max}</span>
          </div>
        </div>
      ) : (
        // Text input for other types
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={JSON.stringify(control.default)}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
              ${error 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
              }
              ${control.type === 'array' ? 'font-mono text-sm' : ''}
            `}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  animationState,
  parameters,
  paramControls,
  preferences,
  onPlay,
  onPause,
  onReset,
  onParameterChange,
  onPreferenceChange,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const isRunning = animationState.isRunning;
  const progress = animationState.totalSteps > 0 
    ? (animationState.currentStep / animationState.totalSteps) * 100 
    : 0;

  return (
    <div className={`control-panel space-y-4 ${className}`}>
      {/* Animation Controls */}
      <Card>
        <CardHeader
          icon={<Play className="w-5 h-5 text-green-600" />}
          title="Animation Controls"
          subtitle={`Step ${animationState.currentStep}/${animationState.totalSteps}`}
        />
        
        <CardContent>
          <div className="space-y-4">
            {/* Progress bar */}
            {animationState.totalSteps > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Control buttons */}
            <div className="flex gap-3">
              <Button
                onClick={isRunning ? onPause : onPlay}
                variant={isRunning ? 'warning' : 'primary'}
                icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                fullWidth
              >
                {isRunning ? 'Pause' : 'Start'} Animation
              </Button>
              
              <Button
                onClick={onReset}
                variant="secondary"
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Reset
              </Button>
            </div>

            {/* Speed control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Animation Speed
              </label>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={preferences.animationSpeed}
                  onChange={(e) => onPreferenceChange('animationSpeed', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-8">
                  {preferences.animationSpeed}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Parameters */}
      {paramControls.length > 0 && (
        <Card>
          <CardHeader
            icon={<Sliders className="w-5 h-5 text-blue-600" />}
            title="Algorithm Parameters"
            subtitle="Adjust input parameters for the algorithm"
          />
          
          <CardContent>
            <div className="space-y-4">
              {paramControls.map(control => (
                <ParameterInput
                  key={control.name}
                  control={control}
                  value={parameters[control.name] ?? control.default}
                  onChange={(value) => onParameterChange(control.name, value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visual Settings */}
      <Card>
        <CardHeader
          icon={<Settings className="w-5 h-5 text-purple-600" />}
          title="Visual Settings"
          actions={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Basic' : 'Advanced'}
            </Button>
          }
        />
        
        <CardContent>
          <div className="space-y-4">
            {/* Grid size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cell Size
              </label>
              <div className="flex items-center gap-3">
                <Grid3X3 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min={32}
                  max={96}
                  value={preferences.gridConfig.cellSize}
                  onChange={(e) => onPreferenceChange('gridConfig', {
                    ...preferences.gridConfig,
                    cellSize: Number(e.target.value)
                  })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-8">
                  {preferences.gridConfig.cellSize}
                </span>
              </div>
            </div>

            {/* Show labels toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Cell Values
              </label>
              <button
                onClick={() => onPreferenceChange('gridConfig', {
                  ...preferences.gridConfig,
                  showLabels: !preferences.gridConfig.showLabels
                })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${preferences.gridConfig.showLabels ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${preferences.gridConfig.showLabels ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Advanced settings */}
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 pt-4 border-t border-gray-200"
              >
                {/* Color scheme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Scheme
                  </label>
                  <select
                    value={preferences.gridConfig.colorScheme}
                    onChange={(e) => onPreferenceChange('gridConfig', {
                      ...preferences.gridConfig,
                      colorScheme: e.target.value as 'default' | 'colorblind' | 'high_contrast'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="colorblind">Colorblind Friendly</option>
                    <option value="high_contrast">High Contrast</option>
                  </select>
                </div>

                {/* Auto-run tests */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto-run Tests
                  </label>
                  <button
                    onClick={() => onPreferenceChange('autoRunTests', !preferences.autoRunTests)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${preferences.autoRunTests ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${preferences.autoRunTests ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance indicator */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg"
        >
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="font-medium">Animation Running...</span>
        </motion.div>
      )}
    </div>
  );
};

export default ControlPanel;
