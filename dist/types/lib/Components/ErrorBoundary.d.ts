import React, { Component, ErrorInfo } from 'react';
interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    hasError: boolean;
}
export declare class ErrorBoundary extends Component<Record<string, unknown>, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(error: ErrorBoundaryState): {
        hasError: boolean;
        error: ErrorBoundaryState;
    };
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): React.ReactNode;
}
export {};
