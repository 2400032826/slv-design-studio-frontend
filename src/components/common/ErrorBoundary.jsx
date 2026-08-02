import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-900 font-bold text-2xl">
              ⚠️
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-6">
              An unexpected display error occurred. Please try refreshing the page or navigating back to safety.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary flex-1 py-3 text-sm"
              >
                Reload Page
              </button>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
                className="btn-outline flex-1 py-3 text-sm"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
