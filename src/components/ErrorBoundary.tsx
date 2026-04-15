import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#002349',
            padding: '40px',
            fontFamily: 'monospace',
          }}
        >
          <p style={{ color: '#C29B40', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Runtime Error
          </p>
          <pre
            style={{
              color: '#fff',
              fontSize: '13px',
              maxWidth: '700px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'rgba(255,255,255,0.07)',
              padding: '24px',
              lineHeight: 1.6,
            }}
          >
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
