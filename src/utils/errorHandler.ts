// Global Error Handling Utilities

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'ui' | 'api' | 'validation' | 'security' | 'performance';
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;

  private constructor() {
    this.setupGlobalHandlers();
    this.setupNetworkListeners();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        new Error(event.reason),
        { component: 'global', action: 'unhandledRejection' },
        'high',
        'api'
      );
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(
        new Error(event.message),
        { 
          component: 'global', 
          action: 'javascriptError',
          url: event.filename || '',
          line: event.lineno,
          column: event.colno
        },
        'high',
        'ui'
      );
    });
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private createContext(context: Partial<ErrorContext> = {}): ErrorContext {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    };
  }

  handleError(
    error: Error,
    context: Partial<ErrorContext> = {},
    severity: ErrorReport['severity'] = 'medium',
    category: ErrorReport['category'] = 'ui'
  ): void {
    const errorReport: ErrorReport = {
      error,
      context: this.createContext(context),
      severity,
      category
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${severity}] - ${category}`);
      console.error('Error:', error);
      console.log('Context:', errorReport.context);
      console.groupEnd();
    }

    // Add to queue for reporting
    this.errorQueue.push(errorReport);

    // Try to send immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // Show user notification for critical errors
    if (severity === 'critical') {
      this.showUserNotification(error, category);
    }
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) {
      return;
    }

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // In a real app, send to error reporting service
      // await this.sendToErrorService(errors);
      console.log('Would send errors to service:', errors);
    } catch (error) {
      // If sending fails, put errors back in queue
      this.errorQueue.unshift(...errors);
      console.warn('Failed to send error reports:', error);
    }
  }

  private showUserNotification(error: Error, category: string): void {
    const messages = {
      ui: 'Something went wrong with the interface. Please refresh the page.',
      api: 'Unable to connect to our servers. Please check your internet connection.',
      validation: 'The data you entered is invalid. Please check and try again.',
      security: 'A security issue was detected. Please contact support.',
      performance: 'The application is running slowly. Some features may be limited.'
    };

    const message = messages[category] || 'An unexpected error occurred. Please try again.';
    
    // You can integrate with your toast/notification system here
    console.error('User notification:', message);
    
    // For now, we'll use a simple alert in critical cases
    if (category === 'security') {
      alert(message);
    }
  }

  // Utility methods for common error scenarios
  handleAPIError(error: Error, endpoint: string, method: string = 'GET'): void {
    this.handleError(
      error,
      { component: 'api', action: `${method} ${endpoint}` },
      'high',
      'api'
    );
  }

  handleValidationError(error: Error, field: string, component: string): void {
    this.handleError(
      error,
      { component, action: `validation:${field}` },
      'medium',
      'validation'
    );
  }

  handleSecurityError(error: Error, component: string, action: string): void {
    this.handleError(
      error,
      { component, action },
      'critical',
      'security'
    );
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const handleError = (
  error: Error,
  context?: Partial<ErrorContext>,
  severity?: ErrorReport['severity'],
  category?: ErrorReport['category']
) => errorHandler.handleError(error, context, severity, category);

export const handleAPIError = (error: Error, endpoint: string, method?: string) =>
  errorHandler.handleAPIError(error, endpoint, method);

export const handleValidationError = (error: Error, field: string, component: string) =>
  errorHandler.handleValidationError(error, field, component);

export const handleSecurityError = (error: Error, component: string, action: string) =>
  errorHandler.handleSecurityError(error, component, action);