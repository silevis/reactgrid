import React, { Component, ErrorInfo } from 'react';
interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    hasError: boolean;
}
export declare class ErrorBoundary extends Component<any, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(error: ErrorBoundaryState): {
        hasError: boolean;
        error: ErrorBoundaryState;
    };
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): {} | null | undefined;
}
export {};
