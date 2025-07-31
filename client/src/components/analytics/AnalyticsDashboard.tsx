import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, MessageCircle, FileText, Activity } from 'lucide-react'
import { Agent } from '../../lib/supabase'

interface AnalyticsData {
  total_agents: number
  total_chats: number
  total_tickets: number
  open_tickets: number
  average_confidence: number
  active_agents: number
}

interface AgentAnalytics {
  agent_id: string
  total_conversations: number
  average_confidence: number
  tickets_created: number
  user_satisfaction: number
  response_time_avg: number
}

interface AnalyticsDashboardProps {
  agents: Agent[]
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ agents }) => {
  const [overviewData, setOverviewData] = useState<AnalyticsData | null>(null)
  const [agentAnalytics, setAgentAnalytics] = useState<Record<string, AgentAnalytics>>({})
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch overview analytics
      const overviewResponse = await fetch('http://localhost:8000/api/analytics/overview')
      const overview = await overviewResponse.json()
      setOverviewData(overview)

      // Fetch analytics for each agent
      const agentAnalyticsData: Record<string, AgentAnalytics> = {}
      for (const agent of agents) {
        try {
          const response = await fetch(`http://localhost:8000/api/agents/${agent.id}/analytics`)
          const analytics = await response.json()
          agentAnalyticsData[agent.id] = analytics
        } catch (error) {
          console.error(`Failed to fetch analytics for agent ${agent.id}:`, error)
        }
      }
      setAgentAnalytics(agentAnalyticsData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 4.0) return 'text-green-600'
    if (satisfaction >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      {overviewData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Agents
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{overviewData.total_agents}</dd>
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
                    <dd className="text-lg font-medium text-gray-900">{overviewData.total_chats}</dd>
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
                    <dd className="text-lg font-medium text-gray-900">{overviewData.open_tickets}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Confidence
                    </dt>
                    <dd className={`text-lg font-medium ${getConfidenceColor(overviewData.average_confidence)}`}>
                      {(overviewData.average_confidence * 100).toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Analytics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Agent Performance</h3>
        </div>
        <div className="p-6">
          {agents.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No agents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create agents to see analytics data.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map((agent) => {
                const analytics = agentAnalytics[agent.id]
                return (
                  <div
                    key={agent.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedAgent === agent.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{agent.name}</h4>
                        <p className="text-sm text-gray-500">{agent.description}</p>
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

                    {analytics && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Conversations</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {analytics.total_conversations}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Confidence</p>
                          <p className={`text-lg font-semibold ${getConfidenceColor(analytics.average_confidence)}`}>
                            {(analytics.average_confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Tickets</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {analytics.tickets_created}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Satisfaction</p>
                          <p className={`text-lg font-semibold ${getSatisfactionColor(analytics.user_satisfaction)}`}>
                            {analytics.user_satisfaction.toFixed(1)}/5
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAgent === agent.id && analytics && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Response Time</span>
                                <span className="text-sm font-medium">{analytics.response_time_avg}s</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Success Rate</span>
                                <span className="text-sm font-medium">
                                  {((1 - analytics.tickets_created / Math.max(analytics.total_conversations, 1)) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h5>
                            <div className="space-y-1">
                              {analytics.average_confidence < 0.7 && (
                                <p className="text-xs text-yellow-600">
                                  • Consider improving knowledge base
                                </p>
                              )}
                              {analytics.user_satisfaction < 4.0 && (
                                <p className="text-xs text-yellow-600">
                                  • Review agent personality settings
                                </p>
                              )}
                              {analytics.response_time_avg > 3.0 && (
                                <p className="text-xs text-yellow-600">
                                  • Optimize response generation
                                </p>
                              )}
                              {analytics.average_confidence >= 0.8 && analytics.user_satisfaction >= 4.0 && (
                                <p className="text-xs text-green-600">
                                  • Agent performing well!
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard 