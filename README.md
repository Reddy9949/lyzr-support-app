# Lyzr Support App - Advanced Agent Management Platform

A complete AI agent management platform with React frontend, FastAPI backend, Supabase integration, and embeddable chat widgets.

## 🚀 Features

### **Phase 1: Core Infrastructure** ✅
- **React Frontend**: Modern UI with Vite, TypeScript, and Tailwind CSS
- **FastAPI Backend**: RESTful API with automatic documentation
- **Supabase Integration**: Database, authentication, and file storage
- **Shared Types**: TypeScript types shared between frontend and widget
- **Standalone Widget**: Embeddable chat widget for any website

### **Phase 2: User Flow Implementation** ✅
- **Self-Serve Agent Creation**: Users can create AI agents via dashboard
- **Knowledge Base Upload**: Support for PDF, TXT, DOCX files
- **Agent Customization**: Tone, personality, and behavior settings
- **Widget Code Generation**: One-click embed code for websites
- **Real-time Chat**: Live communication with AI agents

### **Phase 3: Advanced Management** ✅
- **Ticket Management**: Automatic ticket creation for low-confidence responses
- **User Management**: Track user interactions and sessions
- **Agent Analytics**: Monitor performance and usage metrics
- **Multi-agent Support**: Manage multiple AI agents per user

## 🏗️ Project Structure

```
lyzr-support-app/
├── client/           # React frontend (Vite + Tailwind + Supabase)
├── server/           # FastAPI backend (Agent management + Lyzr integration)
├── shared/           # Shared TypeScript types
├── widget/           # Standalone chat widget (Embeddable)
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Supabase** for authentication and database
- **React Hook Form** with Zod validation
- **React Dropzone** for file uploads
- **React Hot Toast** for notifications

### Backend
- **FastAPI** with Python 3.8+
- **Pydantic** for data validation
- **HTTPX** for async HTTP requests
- **Uvicorn** for ASGI server
- **Python-dotenv** for environment management

### Database & Storage
- **Supabase** (PostgreSQL + Auth + Storage)
- **In-memory storage** for development (replace with Supabase in production)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Python 3.8+
- Supabase account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd lyzr-support-app

# Install all dependencies
npm run install:all

# Install Python dependencies
cd server
pip install -r requirements.txt
cd ..
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Create the following tables in your Supabase database:

```sql
-- Agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tone TEXT NOT NULL,
  personality TEXT NOT NULL,
  knowledge_base TEXT[] DEFAULT '{}',
  lyzr_agent_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  question TEXT NOT NULL,
  user_session TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  confidence_score FLOAT,
  manual_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  user_session TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Create a storage bucket named `knowledge-base` for file uploads

### 3. Environment Configuration

Create environment files:

**Client (`client/.env`):**
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:8000
```

**Server (`server/.env`):**
```env
LYZR_API_KEY=your-lyzr-api-key
LYZR_API_URL=https://api.lyzr.ai
DATABASE_URL=your-supabase-database-url
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client    # Frontend (port 3000)
npm run dev:server    # Backend (port 8000)
npm run dev:widget    # Widget (port 3001)
```

## 📱 Usage

### Dashboard Access
- Visit http://localhost:3000/auth to sign up/login
- Access dashboard at http://localhost:3000/dashboard

### Creating Agents
1. Click "Create Agent" in the dashboard
2. Fill in agent details (name, description, tone, personality)
3. Upload knowledge base files (PDF, TXT, DOCX)
4. Add additional knowledge items or URLs
5. Save the agent

### Embedding Widgets
1. Copy the widget code from the agent card
2. Paste it into your website's HTML
3. The widget will automatically connect to your agent

Example widget code:
```html
<script src="http://localhost:3001/lyzr-support-widget.js" agent-id="agent_0001"></script>
```

## 🔌 API Endpoints

### Agent Management
- `POST /api/agents` - Create new agent
- `GET /api/agents` - List all agents
- `GET /api/agents/{id}` - Get specific agent
- `PUT /api/agents/{id}` - Update agent

### Chat
- `POST /api/chat` - Send message to agent

### Ticket Management
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets
- `PUT /api/tickets/{id}` - Update ticket

### Legacy Support
- `POST /api/support` - Create support request
- `GET /api/support` - List support requests

## 🎯 Key Features

### Agent Creation Dashboard
- **Form-based agent creation** with validation
- **File upload support** for knowledge base
- **Real-time preview** of agent settings
- **One-click deployment** to Lyzr platform

### Widget System
- **Plug-and-play embedding** on any website
- **Agent-specific routing** via agent-id parameter
- **Real-time chat** with loading states
- **Automatic ticket creation** for low-confidence responses

### Ticket Management
- **Automatic ticket creation** when confidence < 0.7
- **Manual response system** for human agents
- **Status tracking** (open, in_progress, resolved)
- **Analytics dashboard** for ticket metrics

### User Management
- **Supabase authentication** with email/password
- **User session tracking** for analytics
- **Multi-agent support** per user
- **Usage analytics** and reporting

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist folder to Vercel
```

### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy to Railway or Render
```

### Widget (CDN)
```bash
npm run build:widget
# Upload dist files to CDN
```

## 🔧 Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build all components
- `npm run install:all` - Install all dependencies

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

**Server:**
- `python main.py` - Start development server
- `uvicorn main:app --reload` - Start with auto-reload
- `pytest` - Run tests

**Widget:**
- `npm run dev` - Start development server
- `npm run build` - Build as library

## 📊 Analytics & Monitoring

- **Agent Performance**: Track response quality and user satisfaction
- **Usage Analytics**: Monitor chat volume and user engagement
- **Ticket Metrics**: Analyze support ticket patterns
- **User Behavior**: Understand user interaction patterns

## 🔐 Security

- **Supabase Auth**: Secure user authentication
- **API Key Management**: Secure Lyzr API integration
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Comprehensive data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the API docs at http://localhost:8000/docs
- **Issues**: Report bugs via GitHub issues
- **Discussions**: Join our community discussions

---

**Built with ❤️ for the Lyzr community** 