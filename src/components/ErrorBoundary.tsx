import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {

    state: ErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(error: ErrorBoundaryState): { hasError: boolean, error: ErrorBoundaryState } {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ error, errorInfo });
    }

    render(): React.ReactNode {
        const { hasError, errorInfo, error } = this.state;

        if (hasError) {
            return (<>
                <h1>{error?.message}</h1>
                <details>
                    {error?.stack}
                    {errorInfo?.componentStack}
                </details>
            </>)
        } else {
            return this.props.children;
        }
    }

}
