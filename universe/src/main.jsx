import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('FATAL REACT ERROR:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: '#0a0505',
          color: '#ff4d4d',
          padding: '20px',
          fontFamily: 'monospace',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          border: '5px solid #ff0000'
        }}>
          <h1 style={{ margin: 0, fontSize: '20px' }}>⚠️ FATAL REACT ERROR DETECTED</h1>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{this.state.error?.message || String(this.state.error)}</p>
          <pre style={{
            background: '#ff000018',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ff4d4d33',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error?.stack || 'No stack trace available'}
          </pre>
          <pre style={{
            background: '#fff0000d',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ffff0033',
            color: '#ffcc00',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}>
            Component Stack: {this.state.info?.componentStack || 'No component stack trace'}
          </pre>
          <button
            onClick={() => window.location.reload(true)}
            style={{
              padding: '10px 20px',
              background: '#ff4d4d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              alignSelf: 'start'
            }}
          >
            Force Hard Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global window error listener for non-React uncaught exceptions
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const errorContainer = document.getElementById('global-error-overlay');
    if (errorContainer) {
      errorContainer.style.display = 'flex';
      const msg = document.getElementById('global-error-message');
      const stack = document.getElementById('global-error-stack');
      if (msg) msg.innerText = event.message || String(event.error);
      if (stack) stack.innerText = event.error?.stack || 'No stack trace';
      return;
    }

    const div = document.createElement('div');
    div.id = 'global-error-overlay';
    Object.assign(div.style, {
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      background: '#0a0505',
      color: '#ff4d4d',
      padding: '20px',
      fontFamily: 'monospace',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      border: '5px solid #ff3b30'
    });
    div.innerHTML = `
      <h1 style="margin: 0; font-size: 20px;">⚠️ UNCAUGHT WINDOW ERROR</h1>
      <p id="global-error-message" style="margin: 0; font-weight: bold;">${event.message || String(event.error)}</p>
      <pre id="global-error-stack" style="background: #ff000018; padding: 12px; border-radius: 4px; border: 1px solid #ff4d4d33; font-size: 12px; white-space: pre-wrap;">${event.error?.stack || 'No stack trace available'}</pre>
      <button onclick="window.location.reload(true)" style="padding: 10px 20px; background: #ff4d4d; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; align-self: start;">Force Hard Reload</button>
    `;
    document.body.appendChild(div);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
