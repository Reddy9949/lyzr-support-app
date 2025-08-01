import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  Mail, 
 
  BookOpen, 
 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Clock,
  Users,
  Zap
} from 'lucide-react'

const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I create my first AI agent?",
      answer: "Navigate to the Dashboard and click 'Create Agent'. Fill in the agent details including name, description, tone, and personality. Then upload your knowledge base files (PDFs, TXT, DOCX) to train your agent. Once created, you can test it and generate embed code for your website."
    },
    {
      question: "What file formats are supported for knowledge base uploads?",
      answer: "We support PDF, TXT, and DOCX file formats. Files are automatically processed and indexed to train your AI agent. Maximum file size is 10MB per file, and you can upload multiple files to build a comprehensive knowledge base."
    },
    {
      question: "How do I embed the chat widget on my website?",
      answer: "After creating an agent, go to the agent details page and copy the provided embed code. Paste this JavaScript snippet into your website's HTML, typically before the closing </body> tag. The widget will automatically appear and connect to your specific agent."
    },
    {
      question: "Can I customize the appearance of the chat widget?",
      answer: "Yes! The chat widget is fully customizable. You can modify colors, position, size, and styling through CSS. The widget is responsive and works on both desktop and mobile devices."
    },
    {
      question: "How does ticket management work?",
      answer: "When your AI agent encounters queries it can't handle confidently (confidence score < 0.7), it automatically creates a support ticket. These tickets can be managed through the dashboard, where human agents can provide manual responses and update ticket status."
    },
    {
      question: "What analytics are available?",
      answer: "You can track agent performance, user interactions, response confidence scores, ticket creation rates, and user satisfaction metrics. Analytics help you understand how well your agents are performing and identify areas for improvement."
    },
    {
      question: "Is there an API available?",
      answer: "Yes! We provide a comprehensive REST API for all platform features. You can manage agents, send chat messages, handle tickets, and access analytics programmatically. API documentation is available at /docs endpoint."
    },
    {
      question: "How do I configure Supabase integration?",
      answer: "Update your .env file with your Supabase project URL and anon key. Create the required database tables (agents, tickets, chat_sessions) and set up a storage bucket named 'knowledge-base' for file uploads. Detailed setup instructions are in the README."
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Support Center
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get help with your Lyzr Support Platform. Find answers, contact support, 
              and access resources to make the most of your AI agents.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Comprehensive guides and API reference
            </p>
            <a 
              href="http://localhost:8000/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
            >
              View API Docs <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help from our support team
            </p>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 text-sm mb-4">
              Connect with other developers and users
            </p>
            <a 
              href="https://github.com/lyzr-ai/lyzr-support-app/discussions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center gap-1"
            >
              Join Community <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get up and running in minutes
            </p>
            <Link 
              to="/dashboard"
              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
            >
              Create Agent
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about the Lyzr Support Platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Still Need Help?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our support team is here to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Get detailed help via email. We typically respond within 24 hours.
              </p>
              <a 
                href="mailto:support@lyzr.ai"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                support@lyzr.ai
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time for immediate assistance.
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Start Live Chat
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Call</h3>
              <p className="text-gray-600 mb-4">
                Book a one-on-one session with our technical team.
              </p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Additional Resources
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore more ways to get help and learn about the platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a 
              href="https://github.com/lyzr-ai/lyzr-support-app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                GitHub Repository
              </h3>
              <p className="text-gray-600 text-sm">
                Access source code, report issues, and contribute to the project.
              </p>
            </a>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Video Tutorials
              </h3>
              <p className="text-gray-600 text-sm">
                Step-by-step video guides for common tasks and setup.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Best Practices
              </h3>
              <p className="text-gray-600 text-sm">
                Learn how to optimize your AI agents for better performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support