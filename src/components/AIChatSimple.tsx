'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fileAction?: {
    type: 'create' | 'modify' | 'explain';
    filename: string;
    content?: string;
    explanation?: string;
  };
}

interface AIChatProps {
  files?: Record<string, string>;
  activeFile?: string;
  onFileUpdate?: (filename: string, content: string) => void;
  onFileSelect?: (filename: string) => void;
}

export function AIChat({ files = {}, activeFile = '', onFileUpdate, onFileSelect }: AIChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding companion! 🚀\n\nI can help you with:\n• Code explanations\n• Debugging help\n• Learning programming\n• Hackathon projects\n• **File manipulation** - Create, modify, and explain code files\n\n**File Commands:**\n• \"Create a React component called Button\"\n• \"Modify main.js to add error handling\"\n• \"Explain the code in hackathon-template.js\"\n• \"Add authentication to auth-example.js\"\n\nWhat would you like to work on today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (messageText: string) => {
    console.log('=== SENDING MESSAGE ===');
    console.log('Message:', messageText);
    
    if (!messageText.trim()) {
      console.log('Empty message, returning');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    console.log('Adding user message:', userMessage);
    setMessages(prev => {
      console.log('Previous messages:', prev);
      const newMessages = [...prev, userMessage];
      console.log('New messages:', newMessages);
      return newMessages;
    });
    
    setInput('');
    setIsLoading(true);

    // Process file manipulation commands
    console.log('Processing file command for:', messageText);
    console.log('Available files:', Object.keys(files));
    console.log('Active file:', activeFile);
    
    const fileAction = processFileCommand(messageText, files);
    console.log('File action result:', fileAction);
    
    // Simulate AI response
    setTimeout(() => {
      console.log('Generating AI response...');
      
      let responseContent = '';
      let fileActionResult = null;
      
      if (fileAction) {
        console.log('File action detected:', fileAction.type);
        responseContent = generateFileActionResponse(fileAction, messageText);
        fileActionResult = fileAction;
        
        // Execute file action
        if (fileAction.type === 'create' && fileAction.content && onFileUpdate) {
          onFileUpdate(fileAction.filename, fileAction.content);
          console.log('Created file:', fileAction.filename);
        } else if (fileAction.type === 'modify' && fileAction.content && onFileUpdate) {
          onFileUpdate(fileAction.filename, fileAction.content);
          console.log('Modified file:', fileAction.filename);
        } else if (fileAction.type === 'explain' && onFileSelect) {
          onFileSelect(fileAction.filename);
          console.log('Selected file for explanation:', fileAction.filename);
        }
      } else {
        console.log('No file action detected, using general response');
        responseContent = generateGeneralResponse(messageText);
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        fileAction: fileActionResult,
      };
      
      console.log('Adding AI response:', aiResponse);
      setMessages(prev => {
        console.log('Adding AI response to messages');
        return [...prev, aiResponse];
      });
      setIsLoading(false);
      console.log('=== MESSAGE SENT SUCCESSFULLY ===');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.value);
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter') {
      console.log('Enter pressed, sending message');
      handleSendMessage(input);
    }
  };

  const handleButtonClick = () => {
    console.log('Send button clicked');
    handleSendMessage(input);
  };

  const handleTestClick = () => {
    console.log('Test button clicked');
    handleSendMessage('Create a React component called TestButton');
  };

  // File command processing functions
  const processFileCommand = (message: string, files: Record<string, string>) => {
    const lowerMessage = message.toLowerCase();
    console.log('Processing command:', lowerMessage);
    
    // Create file commands - more flexible patterns
    if ((lowerMessage.includes('create') || lowerMessage.includes('make') || lowerMessage.includes('build')) && 
        (lowerMessage.includes('file') || lowerMessage.includes('component') || lowerMessage.includes('class'))) {
      const filename = extractFilename(message);
      console.log('Extracted filename for create:', filename);
      if (filename) {
        return {
          type: 'create' as const,
          filename: filename,
          content: generateFileContent(filename, message),
          explanation: `Created new file: ${filename}`
        };
      }
    }
    
    // Modify file commands - more flexible patterns
    if ((lowerMessage.includes('modify') || lowerMessage.includes('change') || lowerMessage.includes('update') || 
         lowerMessage.includes('add') || lowerMessage.includes('edit')) && 
        (lowerMessage.includes('file') || lowerMessage.includes('.js') || lowerMessage.includes('.jsx') || 
         lowerMessage.includes('.py') || lowerMessage.includes('.css'))) {
      const filename = extractFilename(message) || activeFile;
      console.log('Extracted filename for modify:', filename);
      if (filename && files[filename]) {
        return {
          type: 'modify' as const,
          filename: filename,
          content: modifyFileContent(files[filename], message),
          explanation: `Modified file: ${filename}`
        };
      }
    }
    
    // Explain file commands - more flexible patterns
    if ((lowerMessage.includes('explain') || lowerMessage.includes('show') || lowerMessage.includes('tell me about')) && 
        (lowerMessage.includes('file') || lowerMessage.includes('code') || lowerMessage.includes('.js') || 
         lowerMessage.includes('.jsx') || lowerMessage.includes('.py'))) {
      const filename = extractFilename(message) || activeFile;
      console.log('Extracted filename for explain:', filename);
      if (filename && files[filename]) {
        return {
          type: 'explain' as const,
          filename: filename,
          explanation: `Explaining code in: ${filename}`
        };
      }
    }
    
    // Simple create commands without "file" keyword
    if ((lowerMessage.includes('create') || lowerMessage.includes('make')) && 
        (lowerMessage.includes('react') || lowerMessage.includes('component') || lowerMessage.includes('class'))) {
      const filename = extractFilename(message);
      console.log('Extracted filename for simple create:', filename);
      if (filename) {
        return {
          type: 'create' as const,
          filename: filename,
          content: generateFileContent(filename, message),
          explanation: `Created new file: ${filename}`
        };
      }
    }
    
    console.log('No file action pattern matched');
    return null;
  };

  const extractFilename = (message: string): string | null => {
    console.log('Extracting filename from:', message);
    
    // Extract filename from various patterns
    const patterns = [
      /(?:file|component|class)\s+(?:called|named)?\s*([a-zA-Z0-9_-]+\.(?:js|ts|jsx|tsx|py|java|cpp|c|css|html|json|md))/i,
      /([a-zA-Z0-9_-]+\.(?:js|ts|jsx|tsx|py|java|cpp|c|css|html|json|md))/i,
      /(?:create|make|build)\s+(?:a\s+)?(?:react\s+)?(?:component\s+)?(?:called\s+)?([a-zA-Z0-9_-]+)/i,
      /(?:modify|change|update|add|edit)\s+([a-zA-Z0-9_-]+\.(?:js|ts|jsx|tsx|py|java|cpp|c|css|html|json|md))/i,
      /(?:explain|show|tell me about)\s+([a-zA-Z0-9_-]+\.(?:js|ts|jsx|tsx|py|java|cpp|c|css|html|json|md))/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        let filename = match[1];
        console.log('Pattern matched:', pattern, 'Result:', filename);
        
        // Add extension if not present
        if (!filename.includes('.')) {
          if (message.toLowerCase().includes('react') || message.toLowerCase().includes('component')) {
            filename += '.jsx';
          } else if (message.toLowerCase().includes('python')) {
            filename += '.py';
          } else if (message.toLowerCase().includes('css')) {
            filename += '.css';
          } else {
            filename += '.js';
          }
        }
        
        console.log('Final filename:', filename);
        return filename;
      }
    }
    
    console.log('No filename pattern matched');
    return null;
  };

  const generateFileContent = (filename: string, message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) {
      const componentName = filename.replace(/\.(jsx|tsx|js|ts)$/, '');
      return `import React from 'react';

const ${componentName} = ({ children, className = '', ...props }) => {
  return (
    <div className={\`${componentName.toLowerCase()} \${className}\`} {...props}>
      {children}
    </div>
  );
};

export default ${componentName};`;
    }
    
    if (lowerMessage.includes('python')) {
      return `# ${filename}
# Generated by AI Coding Companion

def main():
    print("Hello from ${filename}!")
    
if __name__ == "__main__":
    main()`;
    }
    
    if (lowerMessage.includes('class')) {
      const className = filename.replace(/\.(js|ts)$/, '');
      return `class ${className} {
  constructor() {
    console.log('${className} initialized');
  }
  
  // Add your methods here
}

export default ${className};`;
    }
    
    // Default JavaScript file
    return `// ${filename}
// Generated by AI Coding Companion

console.log('Hello from ${filename}!');

// Add your code here`;
  };

  const modifyFileContent = (currentContent: string, message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('error handling')) {
      return currentContent + `\n\n// Error handling added by AI
try {
  // Your existing code here
} catch (error) {
  console.error('Error occurred:', error);
}`;
    }
    
    if (lowerMessage.includes('authentication') || lowerMessage.includes('auth')) {
      return currentContent + `\n\n// Authentication added by AI
const authenticateUser = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};`;
    }
    
    if (lowerMessage.includes('validation')) {
      return currentContent + `\n\n// Input validation added by AI
const validateInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input provided');
  }
  return input.trim();
};`;
    }
    
    // Default modification - add a comment
    return currentContent + `\n\n// Modified by AI: ${message}`;
  };

  const generateFileActionResponse = (fileAction: any, originalMessage: string): string => {
    switch (fileAction.type) {
      case 'create':
        return `✅ **File Created Successfully!**\n\nI've created the file \`${fileAction.filename}\` for you!\n\n**What I did:**\n- Generated appropriate code structure\n- Added proper imports and exports\n- Included helpful comments\n\n**Next steps:**\n- The file is now available in your file explorer\n- You can modify it further as needed\n- Ask me to explain or modify it anytime!\n\nIs there anything specific you'd like me to add to this file?`;
        
      case 'modify':
        return `✅ **File Modified Successfully!**\n\nI've updated \`${fileAction.filename}\` based on your request!\n\n**What I added:**\n- Enhanced functionality as requested\n- Proper error handling\n- Clean, readable code\n\n**Changes made:**\n- ${fileAction.explanation}\n\nThe file has been updated and is ready to use!\n\nWould you like me to explain the changes or make any additional modifications?`;
        
      case 'explain':
        return `📚 **Code Explanation**\n\nI've selected \`${fileAction.filename}\` for explanation!\n\n**File Overview:**\n- This file contains well-structured code\n- Follows best practices and conventions\n- Ready for production use\n\n**Key Features:**\n- Clean, readable code structure\n- Proper error handling\n- Good documentation\n\n**To see the full explanation:**\n- The file is now selected in the editor\n- You can see the code and ask specific questions\n- I can explain any part in detail!\n\nWhat specific part of the code would you like me to explain?`;
        
      default:
        return `I've processed your file request! Check the file explorer to see the changes.`;
    }
  };

  const generateGeneralResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // More contextual responses based on the message
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 👋 I'm your AI coding companion!\n\nI can help you with:\n• **File manipulation** - Create, modify, and explain code files\n• **Code explanations** - Understanding how code works\n• **Debugging** - Finding and fixing errors\n• **Learning** - Programming concepts and best practices\n\n**Try these commands:**\n• "Create a React component called Button"\n• "Modify main.js to add error handling"\n• "Explain the code in hackathon-template.js"\n\nWhat would you like to work on?`;
    }
    
    if (lowerMessage.includes('help')) {
      return `I'm here to help! 🚀\n\n**File Commands:**\n• "Create a React component called LoginForm"\n• "Modify auth-example.js to add validation"\n• "Explain the code in hackathon-template.js"\n• "Add error handling to main.js"\n\n**Learning Commands:**\n• "Explain how JavaScript functions work"\n• "What's the difference between let and var?"\n• "How do I create a React component?"\n\n**Debugging Commands:**\n• "Help me debug this error"\n• "Why is my code not working?"\n\nWhat specific help do you need?`;
    }
    
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) {
      return `Great! Let's work with React components! 🎨\n\n**I can help you:**\n• Create new React components\n• Modify existing components\n• Explain how components work\n• Debug component issues\n\n**Try these commands:**\n• "Create a React component called Header"\n• "Create a Button component"\n• "Modify the current component to add props"\n\nWhat React component would you like to create or work with?`;
    }
    
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
      return `JavaScript is awesome! 💻\n\n**I can help you with:**\n• Creating JavaScript files\n• Explaining JavaScript concepts\n• Debugging JavaScript code\n• Adding features to existing files\n\n**Try these commands:**\n• "Create a JavaScript file called utils.js"\n• "Explain how JavaScript functions work"\n• "Add error handling to main.js"\n\nWhat JavaScript topic would you like to explore?`;
    }
    
    if (lowerMessage.includes('python') || lowerMessage.includes('py')) {
      return `Python is great for learning! 🐍\n\n**I can help you with:**\n• Creating Python files\n• Explaining Python concepts\n• Debugging Python code\n• Adding Python functionality\n\n**Try these commands:**\n• "Create a Python file called calculator.py"\n• "Explain how Python functions work"\n• "Add error handling to main.py"\n\nWhat Python topic interests you?`;
    }
    
    // Default response
    return `Thanks for your message: "${message}"\n\nI'm your AI coding companion! I can help you with:\n\n• **File manipulation** - Create, modify, and explain code files\n• **Code explanations** - Understanding how code works\n• **Debugging** - Finding and fixing errors\n• **Learning** - Programming concepts and best practices\n• **Hackathon projects** - Quick templates and solutions\n\n**Try these commands:**\n• "Create a React component called Button"\n• "Modify main.js to add error handling"\n• "Explain the code in hackathon-template.js"\n• "Add authentication to auth-example.js"\n\nWhat specific coding topic would you like help with?`;
  };

  console.log('=== RENDERING AICHAT ===');
  console.log('Messages count:', messages.length);
  console.log('Input value:', input);
  console.log('Is loading:', isLoading);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Coding Assistant
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your personal coding mentor for students and hackathon developers
        </p>
      </div>

      {/* Test Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={handleTestClick}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          🧪 Test: Create React Component
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coding..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleButtonClick}
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
