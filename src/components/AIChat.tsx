'use client';

import { useState } from 'react';
import { Send, Bot, User, Lightbulb, Code, BookOpen, Zap, Rocket, Shield, Database } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding companion for students and hackathon developers! 🚀\n\nI can help you with:\n• **Code explanations** - Understanding how code works\n• **Debugging** - Finding and fixing errors\n• **Learning** - Programming concepts and best practices\n• **Hackathon projects** - Quick templates and solutions\n\nWhat would you like to work on today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    {
      icon: <Code className="w-4 h-4" />,
      text: "Explain this code",
      prompt: "Can you explain how this code works step by step?"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Improve this code",
      prompt: "How can I improve this code? What are some best practices I should follow?"
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      text: "Learn concepts",
      prompt: "I'm new to programming. Can you explain the basic concepts I need to know?"
    },
    {
      icon: <Bot className="w-4 h-4" />,
      text: "Debug help",
      prompt: "I'm getting an error. Can you help me debug this issue?"
    },
    {
      icon: <Rocket className="w-4 h-4" />,
      text: "Hackathon template",
      prompt: "Give me a React starter template for a hackathon project"
    },
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Auth help",
      prompt: "How do I implement user authentication in my app?"
    }
  ];

  // Gemini API call function
//   const callGeminiAPI = async (message: string): Promise<string> => {
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
//       if (!apiKey || apiKey === 'your_gemini_api_key_here') {
//         console.log('No Gemini API key found, using simulated response');
//         return generateAIResponse(message);
//       }

//       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: `You are an AI coding companion for students and hackathon developers. Provide helpful, educational responses about programming, debugging, and building projects. Be encouraging and explain concepts clearly.

// User question: ${message}`
//             }]
//           }],
//           generationConfig: {
//             temperature: 0.7,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 1024,
//           }
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`Gemini API error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.candidates && data.candidates[0] && data.candidates[0].content) {
//         return data.candidates[0].content.parts[0].text;
//       } else {
//         throw new Error('Invalid response format from Gemini API');
//       }
//     } catch (error) {
//       console.error('Gemini API Error:', error);
//       // Fallback to simulated response
//       return generateAIResponse(message);
//     }
//   };
const callGeminiAPI = async (message: string): Promise<string> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.log("⚠️ Gemini API key missing. Using fallback response.");
      return generateAIResponse(message);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI coding companion. Provide clear step-by-step responses.\n\nUser: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini raw response:", data);

    // ✅ Safe parsing
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ I couldn't generate a response. Try again.";

    return aiText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return generateAIResponse(message);
  }
};

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    console.log('Sending message:', messageText);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Calling Gemini API for:', messageText);
      const aiResponseText = await callGeminiAPI(messageText);
      console.log('Received response from Gemini:', aiResponseText);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      console.log('Response added to messages');
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    if (!userInput || userInput.trim().length === 0) {
      return "I didn't receive your message. Could you please try again?";
    }
    
    const input = userInput.toLowerCase().trim();
    
    // Handle greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hello! 👋 I'm your AI coding companion! I'm here to help you with:\n\n• **Code explanations** - Understanding how code works\n• **Debugging** - Finding and fixing errors\n• **Learning** - Programming concepts and best practices\n• **Hackathon projects** - Quick templates and solutions\n\nWhat would you like to work on today?`;
    }
    
    if (input.includes('explain') || input.includes('how does')) {
      return `Great question! Let me break this down for you:

**Code Explanation:**
- This code demonstrates fundamental programming concepts
- Each line has a specific purpose and follows programming best practices
- The structure follows a logical flow that makes it easy to understand and maintain

**Key Concepts:**
- **Variables** store data that can be used throughout your program
- **Functions** are reusable blocks of code that perform specific tasks
- **Control structures** help you make decisions and repeat actions
- **Data types** define what kind of data you're working with

**Learning Tips:**
- Read code from top to bottom, left to right
- Pay attention to variable names - they should be descriptive
- Look for patterns and repetition
- Don't be afraid to experiment!

Would you like me to explain any specific part in more detail?`;
    }
    
    if (input.includes('improve') || input.includes('better')) {
      return `Here are some ways to improve your code:

**Code Quality Best Practices:**
1. **Add meaningful comments** - Explain the "why", not just the "what"
2. **Use descriptive variable names** - userName instead of n
3. **Follow consistent formatting** - Proper indentation and spacing
4. **Handle edge cases** - What happens with unexpected input?
5. **Add error handling** - Make your code more robust
6. **Break down complex logic** - Use smaller, focused functions

**Performance Tips:**
- Use appropriate data structures for your use case
- Avoid unnecessary computations in loops
- Consider time and space complexity
- Profile your code to find bottlenecks

**Security Considerations:**
- Validate all user inputs
- Use parameterized queries for databases
- Implement proper authentication and authorization

Would you like me to show you specific examples of these improvements?`;
    }
    
    if (input.includes('debug') || input.includes('error')) {
      return `I'd be happy to help you debug! Here's my systematic approach:

**Debugging Steps:**
1. **Read the error message carefully** - It often tells you exactly what's wrong
2. **Check the line number** - Look at the specific line mentioned in the error
3. **Verify syntax** - Missing brackets, semicolons, or typos are common issues
4. **Check variable names** - Make sure you're using the right variable names
5. **Test with simple inputs** - Start with basic cases to isolate the problem
6. **Use console.log()** - Add logging to see what's happening

**Common Issues:**
- **Syntax errors** - Missing brackets, semicolons, or typos
- **Undefined variables** - Variables not declared or out of scope
- **Type mismatches** - Trying to use a string as a number
- **Logic errors** - Conditions that don't work as expected
- **Off-by-one errors** - Loop boundaries or array indexing

**Debugging Tools:**
- Browser developer tools
- IDE debugger
- Console logging
- Unit tests

Can you share the specific error message or code you're having trouble with?`;
    }
    
    if (input.includes('learn') || input.includes('beginner')) {
      return `Welcome to programming! Here's a roadmap to get you started:

**Programming Fundamentals:**
1. **Variables and Data Types** - Numbers, strings, booleans, arrays
2. **Control Structures** - If/else statements, loops (for, while)
3. **Functions** - Reusable code blocks that perform specific tasks
4. **Data Structures** - Arrays, objects, lists, stacks, queues
5. **Problem Solving** - Breaking down complex problems into smaller parts

**Learning Path:**
- Start with simple projects (calculator, to-do list)
- Practice regularly - coding is a skill that improves with practice
- Don't be afraid to make mistakes - they're part of learning
- Ask questions and seek help from communities
- Build projects that interest you

**Great First Projects:**
- **Calculator** - Learn basic operations and user input
- **To-do list** - Practice CRUD operations
- **Simple game** - Tic-tac-toe, guessing game
- **Personal website** - HTML, CSS, JavaScript
- **Weather app** - API integration

**Resources:**
- Online tutorials and courses
- Coding communities (Stack Overflow, Reddit)
- Practice platforms (LeetCode, HackerRank)
- Open source projects

What programming language are you interested in learning first?`;
    }
    
    if (input.includes('template') || input.includes('starter')) {
      return `Here's a React starter template perfect for hackathons:

**React App Template:**
\`\`\`jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Hackathon Project</h1>
        <p>Built with React and AI assistance!</p>
      </header>
      <main>
        {data && <div>{JSON.stringify(data)}</div>}
      </main>
    </div>
  );
}

export default App;
\`\`\`

**Quick Setup:**
1. Create React app: \`npx create-react-app my-hackathon-project\`
2. Add this code to \`src/App.js\`
3. Start coding: \`npm start\`

Need a specific template for your hackathon idea?`;
    }
    
    if (input.includes('auth') || input.includes('authentication')) {
      return `Here's how to implement user authentication:

**Simple Authentication Flow:**
\`\`\`javascript
// Authentication service
class AuthService {
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(email, password, name) {
    // Similar implementation for registration
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}
\`\`\`

**React Hook for Auth:**
\`\`\`jsx
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      setUser(JSON.parse(localStorage.getItem('user')));
    }
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
}
\`\`\`

**Security Tips:**
- Never store passwords in plain text
- Use HTTPS in production
- Implement proper session management
- Add rate limiting for login attempts

Need help with a specific authentication method?`;
    }
    
    // Default response for any other input
    return `I understand you're asking about: "${userInput}"

As your AI coding companion, I'm here to help you with:

**🎓 Learning & Education:**
- Code explanations and concept breakdowns
- Programming fundamentals and best practices
- Step-by-step tutorials and guidance
- Beginner-friendly explanations

**🐛 Debugging & Problem Solving:**
- Error analysis and fixing
- Code review and optimization
- Performance improvements
- Security considerations

**🚀 Hackathon & Rapid Development:**
- Quick starter templates and boilerplates
- Common patterns and solutions
- MVP development strategies
- Time-saving tips and tricks

**💡 Best Practices:**
- Clean code principles
- Modern development patterns
- Testing strategies
- Deployment considerations

**Try asking me:**
- "Explain this code"
- "How can I improve this?"
- "Give me a React template"
- "Help me debug this error"
- "I'm new to programming"

Feel free to ask me anything about programming, and I'll do my best to help you learn and grow as a developer! What specific topic would you like to explore?`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Coding Assistant
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your personal coding mentor for students and hackathon developers
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick prompts:</p>
        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                console.log('Quick prompt clicked:', prompt.prompt);
                handleSendMessage(prompt.prompt);
              }}
              className="flex items-center gap-2 p-2 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {prompt.icon}
              {prompt.text}
            </button>
          ))}
        </div>
        {/* Test Button */}
        <div className="mt-2">
          <button
            onClick={() => {
              console.log('Test button clicked');
              handleSendMessage('Hello');
            }}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test: Send "Hello"
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              console.log('Input changed:', e.target.value);
              setInput(e.target.value);
            }}
            onKeyPress={(e) => {
              console.log('Key pressed:', e.key);
              if (e.key === 'Enter') {
                console.log('Enter pressed, calling handleSendMessage');
                handleSendMessage(input);
              }
            }}
            placeholder="Ask me anything about coding, debugging, or learning..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => {
              console.log('Send button clicked, input:', input);
              handleSendMessage(input);
            }}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}