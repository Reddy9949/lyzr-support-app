import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, FileText, Link, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const createAgentSchema = z.object({
  name: z.string().min(2, 'Agent name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tone: z.string().min(1, 'Please select a tone'),
  personality: z.string().min(10, 'Personality must be at least 10 characters'),
})

type CreateAgentFormData = z.infer<typeof createAgentSchema>

interface CreateAgentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([])
  const [newKnowledgeItem, setNewKnowledgeItem] = useState('')
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles])
    },
  })

  const addKnowledgeItem = () => {
    if (newKnowledgeItem.trim()) {
      setKnowledgeBase(prev => [...prev, newKnowledgeItem.trim()])
      setNewKnowledgeItem('')
    }
  }

  const removeKnowledgeItem = (index: number) => {
    setKnowledgeBase(prev => prev.filter((_, i) => i !== index))
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = []
    
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('knowledge-base')
        .upload(fileName, file)
      
      if (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`)
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('knowledge-base')
        .getPublicUrl(fileName)
      
      uploadedUrls.push(publicUrl)
    }
    
    return uploadedUrls
  }

  const onSubmit = async (data: CreateAgentFormData) => {
    if (!user) {
      setError('root', { message: 'You must be logged in to create an agent' })
      return
    }

    setIsLoading(true)
    try {
      // Upload files to Supabase Storage
      const fileUrls = await uploadFiles(uploadedFiles)
      
      // Combine file URLs with knowledge base items
      const allKnowledgeBase = [...fileUrls, ...knowledgeBase]
      
      // Create agent in database
      const { data: agent, error } = await supabase
        .from('agents')
        .insert({
          name: data.name,
          description: data.description,
          tone: data.tone,
          personality: data.personality,
          knowledge_base: allKnowledgeBase,
          user_id: user.id,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // TODO: Call Lyzr API to create the actual agent
      // const lyzrAgent = await createLyzrAgent(data, allKnowledgeBase)
      // await supabase.from('agents').update({ lyzr_agent_id: lyzrAgent.id }).eq('id', agent.id)

      toast.success('Agent created successfully!')
      onSuccess()
    } catch (error: any) {
      setError('root', { message: error.message || 'Failed to create agent' })
      toast.error(error.message || 'Failed to create agent')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Agent</h2>
        <p className="text-gray-600">Configure your AI support agent</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Agent Name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Customer Support Bot"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe what this agent does..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <select
            {...register('tone')}
            id="tone"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a tone</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
          {errors.tone && (
            <p className="mt-1 text-sm text-red-600">{errors.tone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-gray-700">
            Personality
          </label>
          <textarea
            {...register('personality')}
            id="personality"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe the agent's personality and behavior..."
          />
          {errors.personality && (
            <p className="mt-1 text-sm text-red-600">{errors.personality.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Knowledge Base
          </label>
          
          {/* File Upload */}
          <div className="mb-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? 'Drop files here...'
                  : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, TXT, DOCX files
              </p>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Base Items */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Knowledge:</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKnowledgeItem}
                onChange={(e) => setNewKnowledgeItem(e.target.value)}
                placeholder="Add knowledge item or URL..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKnowledgeItem())}
              />
              <button
                type="button"
                onClick={addKnowledgeItem}
                className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Knowledge Base List */}
          {knowledgeBase.length > 0 && (
            <div className="space-y-2">
              {knowledgeBase.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <Link className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeKnowledgeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.root && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {errors.root.message}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </div>
            ) : (
              'Create Agent'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAgentForm 