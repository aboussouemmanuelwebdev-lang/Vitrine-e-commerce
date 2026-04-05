import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-red-50 dark:bg-red-500/10 p-8 rounded-[2.5rem] border border-red-100 dark:border-red-500/20 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
              <AlertCircle className="text-white" size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter">Une erreur est survenue</h1>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                L'application a rencontré un problème inattendu. Cela peut être dû à une image trop lourde ou à un problème de connexion.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <RefreshCcw size={18} />
              <span>Recharger la page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
