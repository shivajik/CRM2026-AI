import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background" data-testid="error-boundary">
          <div className="max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="error-title">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6" data-testid="error-message">
              We encountered an unexpected error. Please try refreshing the page or go back to the home page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} data-testid="button-retry">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" onClick={this.handleGoHome} data-testid="button-go-home">
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
