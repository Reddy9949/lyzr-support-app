import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { Agent } from '../../lib/supabase'

interface Ticket {
  id: string
  agent_id: string
  question: string
  user_session: string
  status: 'open' | 'in_progress' | 'resolved'
  confidence_score?: number
  manual_response?: string
  created_at: string
  updated_at: string
}

interface TicketManagementProps {
  agents: Agent[]
}

const TicketManagement: React.FC<TicketManagementProps> = ({ agents }) => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [manualResponse, setManualResponse] = useState('')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tickets')
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTicketStatus = async (ticketId: string, status: string, manualResponseText?: string) => {
    try {
      const updateResponse = await fetch(`http://localhost:8000/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          manual_response: manualResponseText,
        }),
      })

      if (updateResponse.ok) {
        fetchTickets()
        setSelectedTicket(null)
        setManualResponse('')
      }
    } catch (error) {
      console.error('Failed to update ticket:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown Agent'
  }

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus
    const agentMatch = filterAgent === 'all' || ticket.agent_id === filterAgent
    return statusMatch && agentMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Filter
            </label>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Agents</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Support Tickets ({filteredTickets.length})
          </h3>
        </div>
        <div className="p-6">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterStatus === 'all' && filterAgent === 'all'
                  ? 'No tickets have been created yet.'
                  : 'No tickets match the current filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(ticket.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        {ticket.confidence_score && (
                          <span className="text-xs text-gray-500">
                            Confidence: {(ticket.confidence_score * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {getAgentName(ticket.agent_id)}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{ticket.question}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Session: {ticket.user_session.slice(0, 8)}...</span>
                        <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {selectedTicket?.id === ticket.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-4">
                        {ticket.manual_response && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Manual Response</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {ticket.manual_response}
                            </p>
                          </div>
                        )}

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Add Response</h5>
                          <textarea
                            value={manualResponse}
                            onChange={(e) => setManualResponse(e.target.value)}
                            placeholder="Enter your response..."
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div className="flex space-x-2">
                          {ticket.status !== 'resolved' && (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'resolved', manualResponse)}
                              className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Mark Resolved
                            </button>
                          )}
                          {ticket.status === 'open' && (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'in_progress', manualResponse)}
                              className="px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Mark In Progress
                            </button>
                          )}
                          {ticket.status === 'in_progress' && (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'open', manualResponse)}
                              className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketManagement 