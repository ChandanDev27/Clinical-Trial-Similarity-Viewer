import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f2fb] flex items-center justify-center flex-col">
          <div className="text-red-500 text-lg mb-4">
            Something went wrong: {this.state.error.message}
          </div>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-[#652995] text-white rounded-lg hover:bg-[#4a1d6e] transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;