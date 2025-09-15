import React, { useState, useEffect } from 'react';
import { RuntimeTestRunnerFactory } from '../../services/testRunners';
import { Zap, AlertTriangle, Book, RefreshCw, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

/**
 * Runtime Status Component
 * Shows which language runtimes are available and provides setup instructions
 */
export const RuntimeStatus: React.FC = () => {
  const [runtimeStatus, setRuntimeStatus] = useState<any>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const factory = RuntimeTestRunnerFactory.getInstance();

  useEffect(() => {
    loadRuntimeStatus();
  }, []);

  const loadRuntimeStatus = () => {
    const status = factory.getRuntimeStatus();
    setRuntimeStatus(status);
  };

  const refreshRuntimes = async () => {
    setRefreshing(true);
    factory.refreshRuntimeDetection();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Give time for detection
    loadRuntimeStatus();
    setRefreshing(false);
  };

  const getStatusIcon = (status: any) => {
    if (status.canExecute) {
      return <Zap className="h-4 w-4 text-green-600" />;
    } else if (status.available === false && status.status.includes('Missing')) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <Book className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: any) => {
    if (status.canExecute) {
      return 'bg-green-50 border-green-200 text-green-800';
    } else if (status.available === false && status.status.includes('Missing')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    } else {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const executableLanguages = Object.entries(runtimeStatus).filter(([, status]: any) => status.canExecute);
  const simulatedLanguages = Object.entries(runtimeStatus).filter(([, status]: any) => !status.canExecute);

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between border-b hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <h3 className="text-lg font-semibold text-gray-800">
            Language Runtime Status
          </h3>
          <span className="text-sm text-gray-500">
            ({executableLanguages.length} executable, {simulatedLanguages.length} simulated)
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            refreshRuntimes();
          }}
          disabled={refreshing}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Refresh runtime detection"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Executable Languages */}
          {executableLanguages.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                Executable Languages
              </h4>
              <div className="grid gap-2">
                {executableLanguages.map(([language, status]: any) => (
                  <div key={language} className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium">{language}</span>
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded">
                          EXECUTABLE
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs">
                      Features: {status.features.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulated Languages */}
          {simulatedLanguages.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Book className="h-4 w-4 text-blue-600" />
                Simulated Languages
              </h4>
              <div className="grid gap-2">
                {simulatedLanguages.map(([language, status]: any) => (
                  <RuntimeLanguageCard 
                    key={language} 
                    language={language} 
                    status={status} 
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Global Instructions */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">
              Enable More Languages 🚀
            </h5>
            <p className="text-xs text-gray-600 mb-2">
              Add runtime support to execute code in additional languages:
            </p>
            <div className="space-y-1 text-xs">
              <div>• <strong>Python:</strong> Include Pyodide for scientific computing</div>
              <div>• <strong>Ruby:</strong> Add Opal.js for elegant syntax</div>
              <div>• <strong>Go:</strong> Compile with TinyGo to WASM</div>
              <div>• <strong>C#:</strong> Use Blazor WASM runtime</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Individual language runtime card component
 */
const RuntimeLanguageCard: React.FC<{
  language: string;
  status: any;
  getStatusIcon: (status: any) => React.ReactNode;
  getStatusColor: (status: any) => string;
}> = ({ language, status, getStatusIcon, getStatusColor }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const canBeEnabled = status.runtimeStatus === 'missing' && status.installInstructions;

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <span className="font-medium">{language}</span>
          <span className="text-xs px-2 py-1 bg-current bg-opacity-20 rounded">
            {status.canExecute ? 'EXECUTABLE' : 'SIMULATED'}
          </span>
          {canBeEnabled && (
            <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
              CAN BE ENABLED
            </span>
          )}
        </div>
        {status.installInstructions && (
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs px-2 py-1 bg-current bg-opacity-20 rounded hover:bg-opacity-30 transition-colors flex items-center gap-1"
          >
            {canBeEnabled ? 'Enable' : 'Info'}
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <div className="mt-1 text-xs">
        Status: {status.status} | Features: {status.features.join(', ')}
      </div>

      {showInstructions && status.installInstructions && (
        <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
          <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
            {status.installInstructions}
          </pre>
        </div>
      )}
    </div>
  );
};
