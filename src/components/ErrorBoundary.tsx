import { Component, type ErrorInfo, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('WebGL experience fallback:', error, info) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
