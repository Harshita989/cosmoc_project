// Updated handleSendMessage function with real AI integration
// Replace the current handleSendMessage in AIChat.tsx

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
    // Choose your AI provider here
    let aiResponse: string;
    
    // Option 1: Use OpenAI GPT
    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      aiResponse = await callOpenAI(messageText);
    }
    // Option 2: Use Claude
    else if (process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
      aiResponse = await callClaude(messageText);
    }
    // Option 3: Use Gemini
    else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      aiResponse = await callGemini(messageText);
    }
    // Option 4: Use Ollama (local)
    else if (process.env.NEXT_PUBLIC_OLLAMA_URL) {
      aiResponse = await callOllama(messageText);
    }
    // Fallback to simulated responses
    else {
      aiResponse = generateAIResponse(messageText);
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

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
