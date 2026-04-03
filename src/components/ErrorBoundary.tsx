import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Here you could also log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
          <div className="text-center" style={{ maxWidth: '600px' }}>
            <Alert variant="danger" className="mb-4">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Something went wrong
              </Alert.Heading>
              <p className="mb-3">
                We're sorry, but something unexpected happened. The application has encountered an error.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-3 text-start">
                  <summary>Error Details</summary>
                  <pre className="mt-2 p-3 bg-light rounded">
                    <code>
                      {this.state.error.toString()}
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </code>
                  </pre>
                </details>
              )}
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" onClick={this.handleReset}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </Button>
                <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reload Page
                </Button>
              </div>
            </Alert>
            
            <div className="mt-4">
              <h6>What you can do:</h6>
              <ul className="text-start">
                <li>Try refreshing the page</li>
                <li>Check your internet connection</li>
                <li>Clear your browser cache</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
