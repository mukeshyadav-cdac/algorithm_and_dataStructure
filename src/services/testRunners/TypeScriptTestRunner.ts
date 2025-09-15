import { TestCase, TestResult } from '../../types';
import { JavaScriptTestRunner } from './JavaScriptTestRunner';

/**
 * TypeScript test runner that transpiles TypeScript to JavaScript for execution
 */
export class TypeScriptTestRunner extends JavaScriptTestRunner {
  constructor(algorithmId: string) {
    super(algorithmId);
    this.languageName = 'TypeScript';
  }

  canExecute(): boolean {
    return true; // Can execute by transpiling to JavaScript
  }

  protected async prepareCode(code: string): Promise<string> {
    // Simple TypeScript to JavaScript transpilation
    // In a real implementation, you might use the TypeScript compiler API
    const jsCode = this.transpileToJavaScript(code);
    
    // Validate the resulting JavaScript
    return super.prepareCode(jsCode);
  }

  /**
   * Simple TypeScript to JavaScript transpilation
   * Removes type annotations and interfaces
   */
  private transpileToJavaScript(tsCode: string): string {
    let jsCode = tsCode;
    
    // Remove type annotations from parameters and return types
    jsCode = jsCode.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+)?/g, '');
    
    // Remove interface declarations (basic removal)
    jsCode = jsCode.replace(/interface\s+\w+\s*{[^}]*}/g, '');
    
    // Remove type assertions
    jsCode = jsCode.replace(/as\s+\w+/g, '');
    
    // Remove generic type parameters
    jsCode = jsCode.replace(/<[^>]+>/g, '');
    
    // Remove export/import type statements (basic)
    jsCode = jsCode.replace(/import\s+type\s+.*?;/g, '');
    jsCode = jsCode.replace(/export\s+type\s+.*?;/g, '');
    
    // Clean up extra whitespace
    jsCode = jsCode.replace(/\s+/g, ' ').trim();
    
    return jsCode;
  }

  /**
   * Validates TypeScript-specific syntax
   */
  protected validateTypeScriptCode(code: string): void {
    // Check for basic TypeScript patterns
    const hasTypes = /:\s*\w+/.test(code);
    const hasInterfaces = /interface\s+\w+/.test(code);
    const hasGenerics = /<[^>]+>/.test(code);
    
    if (!hasTypes && !hasInterfaces && !hasGenerics) {
      console.warn('Code appears to be plain JavaScript rather than TypeScript');
    }
  }
}
