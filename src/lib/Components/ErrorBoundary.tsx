import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    hasError: boolean;
}


export class ErrorBoundary extends Component<any, ErrorBoundaryState> {

    state: ErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(error: ErrorBoundaryState) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log({ error, errorInfo });
        this.setState({ errorInfo });
    }

    render() {
        const { hasError, errorInfo } = this.state;

        if (hasError) {
            return (
                <details>
                    {errorInfo?.componentStack.toString()}
                    {errorInfo?.toString()}
                </details>
            )
        } else {
            return this.props.children;
        }
    }

}