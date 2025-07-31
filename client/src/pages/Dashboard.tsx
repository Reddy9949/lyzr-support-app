import React, { useState, useEffect } from 'react'
import { Plus, Settings, Copy, ExternalLink, MessageCircle, Users, FileText, BarChart3, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Agent } from '../lib/supabase'
import CreateAgentForm from '../components/agents/CreateAgentForm'
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard'
import TicketManagement from '../components/tickets/TicketManagement'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [activeTab, setActiveTab] = useState<'agents' | 'analytics' | 'tickets'>('agents')

  useEffect(() => {
    if (user) {
      fetchAgents()
    }
  }, [user])

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setAgents(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch agents')
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyWidgetCode = (agentId: string) => {
    const widgetCode = `<script src="https://yourdomain.com/chat-widget.js" agent-id="${agentId}"></script>`
    navigator.clipboard.writeText(widgetCode)
    toast.success('Widget code copied to clipboard!')
  }

  const handleAgentCreated = () => {
    setShowCreateForm(false)
    fetchAgents()
    toast.success('Agent created successfully!')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Lyzr Support Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showCreateForm ? (
          <CreateAgentForm
            onSuccess={handleAgentCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'agents'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Agents
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tickets'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Tickets
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'agents' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Agents
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">{agents.length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Active Users
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">0</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Open Tickets
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">0</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Chats
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">0</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agents Section */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">Your Agents</h2>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Agent
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {agents.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No agents</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by creating your first AI agent.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Agent
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map((agent) => (
                          <div
                            key={agent.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                              </div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  agent.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {agent.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <span className="text-xs font-medium text-gray-500">Tone:</span>
                                <p className="text-sm text-gray-900 capitalize">{agent.tone}</p>
                              </div>

                              <div>
                                <span className="text-xs font-medium text-gray-500">
                                  Knowledge Base:
                                </span>
                                <p className="text-sm text-gray-900">
                                  {agent.knowledge_base.length} items
                                </p>
                              </div>

                              <div className="flex space-x-2 pt-4">
                                <button
                                  onClick={() => copyWidgetCode(agent.id)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy Code
                                </button>
                                <button
                                  onClick={() => setSelectedAgent(agent)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Settings
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard agents={agents} />
            )}

            {activeTab === 'tickets' && (
              <TicketManagement agents={agents} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 