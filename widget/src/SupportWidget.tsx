import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react';
import { WidgetConfig } from './index';

interface SupportWidgetProps {
  config: WidgetConfig;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

const SupportWidget: React.FC<SupportWidgetProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { text: message, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = { 
      text: '', 
      sender: 'bot', 
      timestamp: new Date(),
      isLoading: true 
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Get agent ID from config or URL params
      const urlParams = new URLSearchParams(window.location.search);
      const agentId = config.agentId || urlParams.get('agent-id') || 'default';

      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          message: message,
          user_session: generateSessionId(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Remove loading message and add bot response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        }];
      });

      // Show ticket notification if one was created
      if (data.ticket_created) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: 'I\'ve created a support ticket for your question. Our team will get back to you soon!',
            sender: 'bot',
            timestamp: new Date()
          }]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message and add error response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
          sender: 'bot',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
          style={{ backgroundColor: config.primaryColor }}
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96 flex flex-col">
          {/* Header */}
          <div 
            className="p-4 rounded-t-lg text-white flex justify-between items-center"
            style={{ backgroundColor: config.primaryColor }}
          >
            <div>
              <h3 className="font-semibold">{config.title}</h3>
              <p className="text-sm opacity-90">{config.subtitle}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  style={message.sender === 'user' ? { backgroundColor: config.primaryColor } : {}}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Typing...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-3 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.primaryColor }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
          style={{ backgroundColor: config.primaryColor }}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default SupportWidget; 