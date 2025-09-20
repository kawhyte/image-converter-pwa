import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
    <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
    <p className="text-muted-foreground mb-4 max-w-md">
      An unexpected error occurred while processing your images. Please try again.
    </p>
    {error && (
      <details className="mb-4 text-left">
        <summary className="cursor-pointer text-sm text-muted-foreground">
          Error details
        </summary>
        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-w-md">
          {error.message}
        </pre>
      </details>
    )}
    <button
      onClick={resetError}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);