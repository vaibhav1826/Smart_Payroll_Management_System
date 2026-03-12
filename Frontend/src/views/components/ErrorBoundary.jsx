import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-card">
                        <div className="error-icon">⚠️</div>
                        <h2>Something went wrong</h2>
                        <p className="text-muted">{this.state.error?.message || 'An unexpected error occurred.'}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
