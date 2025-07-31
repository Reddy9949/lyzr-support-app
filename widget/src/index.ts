import React from 'react';
import ReactDOM from 'react-dom/client';
import SupportWidget from './SupportWidget';
import './index.css';

// Widget configuration interface
export interface WidgetConfig {
  apiUrl?: string;
  agentId?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  title?: string;
  subtitle?: string;
}

// Initialize the widget
export function initSupportWidget(config: WidgetConfig = {}) {
  const defaultConfig: WidgetConfig = {
    apiUrl: 'http://localhost:8000',
    agentId: 'default',
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#3b82f6',
    title: 'Need Help?',
    subtitle: 'Chat with our support team',
    ...config,
  };

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'lyzr-support-widget';
  document.body.appendChild(widgetContainer);

  // Render the widget
  const root = ReactDOM.createRoot(widgetContainer);
  root.render(
    <React.StrictMode>
      <SupportWidget config={defaultConfig} />
    </React.StrictMode>
  );

  return {
    destroy: () => {
      root.unmount();
      if (widgetContainer.parentNode) {
        widgetContainer.parentNode.removeChild(widgetContainer);
      }
    },
  };
}

// Export the widget component for direct use
export { SupportWidget };
export default SupportWidget; 