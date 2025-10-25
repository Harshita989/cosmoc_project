'use client';

import { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { AIChat } from '@/components/AIChatSimple';
import { FileExplorer } from '@/components/FileExplorer';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, MessageSquare, FileText, Lightbulb } from 'lucide-react';
import { useUser, RedirectToSignIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [activeFile, setActiveFile] = useState('main.js');
  const { isSignedIn, user } = useUser();

 
  const [files, setFiles] = useState({
    'main.js': `// Welcome to AI Coding Companion!
// This is your main JavaScript file

function greetUser(name) {
  return \`Hello, \${name}! Welcome to coding!\`;
}

// Try asking the AI: "Explain this function" or "How can I improve this code?"
console.log(greetUser("Student"));`,
    'hackathon-template.js': `// 🚀 Hackathon Starter Template
// Perfect for rapid prototyping and MVP development

class HackathonApp {
  constructor() {
    this.data = [];
    this.init();
  }

  async init() {
    console.log('🚀 Starting hackathon app...');
    await this.loadData();
    this.setupEventListeners();
    this.render();
  }

  async loadData() {
    try {
      // Simulate API call
      const response = await fetch('/api/data');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = this.getMockData();
    }
  }

  getMockData() {
    return [
      { id: 1, name: 'Feature 1', completed: false },
      { id: 2, name: 'Feature 2', completed: true },
      { id: 3, name: 'Feature 3', completed: false }
    ];
  }

  setupEventListeners() {
    // Add your event listeners here
    document.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    console.log('Click handled:', event.target);
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = \`
      <div class="hackathon-app">
        <h1>🏆 My Hackathon Project</h1>
        <div class="features">
          \${this.data.map(item => \`
            <div class="feature \${item.completed ? 'completed' : ''}">
              <span>\${item.name}</span>
              <button onclick="toggleFeature(\${item.id})">
                \${item.completed ? '✅' : '⏳'}
              </button>
            </div>
          \`).join('')}
        </div>
      </div>
    \`;
  }
}

// Initialize the app
const app = new HackathonApp();

// Helper functions
function toggleFeature(id) {
  const feature = app.data.find(item => item.id === id);
  if (feature) {
    feature.completed = !feature.completed;
    app.render();
  }
}`,
    'auth-example.js': `// 🔐 Authentication Example
// Perfect for hackathon projects requiring user accounts

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('authToken');
  }

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return { success: true, user: this.currentUser };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(email, password, name) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return { success: true, user: this.currentUser };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Usage example
const auth = new AuthManager();

// Login form handler
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = await auth.login(email, password);
  
  if (result.success) {
    console.log('Login successful:', result.user);
    // Redirect to dashboard or update UI
  } else {
    console.error('Login failed:', result.error);
    // Show error message
  }
}

// Check if user is already logged in
if (auth.isAuthenticated()) {
  console.log('User is logged in:', auth.getCurrentUser());
} else {
  console.log('User needs to log in');
}`,
    'api-example.js': `// 🌐 API Integration Example
// Common patterns for hackathon projects

class APIClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': \`Bearer \${this.token}\` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Usage examples
const api = new APIClient();

// Fetch user data
async function fetchUserData() {
  try {
    const user = await api.get('/user/profile');
    console.log('User data:', user);
    return user;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

// Create a new post
async function createPost(title, content) {
  try {
    const post = await api.post('/posts', { title, content });
    console.log('Post created:', post);
    return post;
  } catch (error) {
    console.error('Failed to create post:', error);
  }
}

// Update user settings
async function updateSettings(settings) {
  try {
    const updated = await api.put('/user/settings', settings);
    console.log('Settings updated:', updated);
    return updated;
  } catch (error) {
    console.error('Failed to update settings:', error);
  }
}

// Delete a resource
async function deleteResource(id) {
  try {
    await api.delete(\`/resources/\${id}\`);
    console.log('Resource deleted successfully');
  } catch (error) {
    console.error('Failed to delete resource:', error);
  }
}`,
    'styles.css': `/* 🎨 Hackathon CSS Styles */
/* Quick and effective styling for rapid prototyping */

:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --dark-bg: #1f2937;
  --light-bg: #f9fafb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: var(--light-bg);
}

.hackathon-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hackathon-app h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.feature {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.feature.completed {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-left: 4px solid var(--secondary-color);
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .hackathon-app {
    padding: 1rem;
  }
  
  .hackathon-app h1 {
    font-size: 2rem;
  }
  
  .feature {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}`,
    'README.md': `# 🚀 AI Coding Companion

## Features
- 🤖 AI-powered code assistance
- 📚 Educational explanations
- 🚀 Hackathon helpers
- 💡 Smart code completions

## Getting Started
1. Open a file in the editor
2. Ask questions in the AI chat
3. Get instant help and explanations!

## Hackathon Templates
- **hackathon-template.js** - Complete app structure
- **auth-example.js** - User authentication
- **api-example.js** - API integration patterns

## Learning Resources
- Switch to "AI Chat" tab for interactive help
- Use "Tips" tab for hackathon-specific guidance
- Check "Docs" tab for comprehensive documentation

Happy coding! 🎉`

  });
 if (!isSignedIn) return <RedirectToSignIn />;
  const updateFile = (filename: string, content: string) => {
    setFiles(prev => ({ ...prev, [filename]: content }));
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.firstName || "Developer"} 👋
        </h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
          <FileExplorer 
            files={files} 
            activeFile={activeFile} 
            onFileSelect={setActiveFile}
            onFileUpdate={updateFile}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Docs
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 flex flex-col m-0 overflow-hidden">
              <CodeEditor 
                filename={activeFile}
                content={files[activeFile as keyof typeof files] || ''}
                onChange={(content) => updateFile(activeFile, content)}
              />
            </TabsContent>

            <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
              <AIChat 
                files={files}
                activeFile={activeFile}
                onFileUpdate={updateFile}
                onFileSelect={setActiveFile}
              />
            </TabsContent>

            <TabsContent value="docs" className="flex-1 m-0 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Documentation</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <h3>Getting Started</h3>
                  <p>Welcome to AI Coding Companion! This tool is designed specifically for students and hackathon developers.</p>
                  
                  <h3>Features</h3>
                  <ul>
                    <li><strong>AI Code Assistance:</strong> Get help with syntax, logic, and best practices</li>
                    <li><strong>Educational Explanations:</strong> Understand code concepts with detailed explanations</li>
                    <li><strong>Hackathon Helpers:</strong> Quick solutions for common hackathon challenges</li>
                    <li><strong>Smart Completions:</strong> AI-powered code suggestions</li>
                  </ul>

                  <h3>How to Use</h3>
                  <ol>
                    <li>Select a file from the sidebar to edit</li>
                    <li>Type your code in the editor</li>
                    <li>Switch to AI Chat tab to ask questions</li>
                    <li>Get instant help and explanations!</li>
                  </ol>

                  <h3>Code Editor Features</h3>
                  <ul>
                    <li><strong>Syntax Highlighting:</strong> Support for JavaScript, TypeScript, Python, Java, C++, CSS, HTML, JSON, and Markdown</li>
                    <li><strong>Auto-completion:</strong> Intelligent code suggestions</li>
                    <li><strong>Error Detection:</strong> Real-time error highlighting</li>
                    <li><strong>Multi-file Support:</strong> Work with multiple files simultaneously</li>
                    <li><strong>File Management:</strong> Create, edit, rename, and delete files</li>
                  </ul>

                  <h3>AI Chat Capabilities</h3>
                  <ul>
                    <li><strong>Code Explanations:</strong> Get detailed explanations of how code works</li>
                    <li><strong>Debugging Help:</strong> Assistance with finding and fixing errors</li>
                    <li><strong>Learning Support:</strong> Educational explanations for programming concepts</li>
                    <li><strong>Hackathon Templates:</strong> Quick starter templates for common projects</li>
                    <li><strong>Best Practices:</strong> Guidance on writing clean, efficient code</li>
                  </ul>

                  <h3>Keyboard Shortcuts</h3>
                  <ul>
                    <li><strong>Ctrl+S:</strong> Save file</li>
                    <li><strong>Ctrl+Z:</strong> Undo</li>
                    <li><strong>Ctrl+Y:</strong> Redo</li>
                    <li><strong>Ctrl+F:</strong> Find in file</li>
                    <li><strong>Ctrl+/:</strong> Toggle comment</li>
                    <li><strong>Tab:</strong> Indent code</li>
                    <li><strong>Shift+Tab:</strong> Unindent code</li>
                  </ul>

                  <h3>Troubleshooting</h3>
                  <p>If you encounter any issues:</p>
                  <ul>
                    <li>Check the browser console (F12) for error messages</li>
                    <li>Refresh the page (Ctrl+F5)</li>
                    <li>Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)</li>
                    <li>Check your internet connection for AI chat functionality</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="flex-1 m-0 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Hackathon Tips & Tricks</h2>
                
                <div className="grid gap-4 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">🚀 Quick Start Templates</h3>
                    <p className="text-blue-800 dark:text-blue-200">Ask the AI for starter templates for React, Node.js, Python, or any framework you're using!</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100">💡 Common Patterns</h3>
                    <p className="text-green-800 dark:text-green-200">Need help with authentication, API calls, or data structures? The AI knows common patterns!</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">🐛 Debug Help</h3>
                    <p className="text-purple-800 dark:text-purple-200">Stuck on an error? Paste your code and error message in the AI chat for instant debugging help!</p>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100">📚 Learning Mode</h3>
                    <p className="text-orange-800 dark:text-orange-200">Ask "Explain this code" or "How does this work?" to get educational explanations!</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">🎯 Hackathon Strategy</h3>
                    <div className="grid gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>1. Plan Your MVP:</strong> Focus on core functionality first
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>2. Use Templates:</strong> Start with proven patterns and modify
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>3. Test Early:</strong> Validate your idea with users quickly
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>4. Keep It Simple:</strong> Don't over-engineer your solution
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">⚡ Time-Saving Tips</h3>
                    <div className="grid gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Copy-Paste Templates:</strong> Use the provided code templates
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>AI Assistance:</strong> Ask the AI for quick solutions
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Focus on Demo:</strong> Make sure your demo works perfectly
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Documentation:</strong> Keep notes of what you built
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">🛠️ Common Hackathon Tech Stacks</h3>
                    <div className="grid gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Frontend:</strong> React, Vue.js, Next.js, HTML/CSS/JS
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Backend:</strong> Node.js, Python (Flask/Django), Express.js
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Database:</strong> MongoDB, PostgreSQL, Firebase
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>APIs:</strong> REST APIs, GraphQL, Third-party APIs
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">🎨 Presentation Tips</h3>
                    <div className="grid gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Demo First:</strong> Show your working product immediately
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Tell a Story:</strong> Explain the problem and your solution
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Keep It Short:</strong> 2-3 minutes max for demo
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Prepare Backup:</strong> Have screenshots if demo fails
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}