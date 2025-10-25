// Real AI Integration Examples
// Add these to your AIChat.tsx component

// Option 1: OpenAI GPT-4/GPT-3.5
const callOpenAI = async (message: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content: 'You are an AI coding companion for students and hackathon developers. Provide helpful, educational responses about programming, debugging, and building projects.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

// Option 2: Anthropic Claude
const callClaude = async (message: string) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are an AI coding companion for students and hackathon developers. ${message}`
          }
        ]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

// Option 3: Google Gemini
const callGemini = async (message: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI coding companion for students and hackathon developers. ${message}`
          }]
        }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

// Option 4: Local LLM (Ollama)
const callOllama = async (message: string) => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama2', // or 'codellama', 'mistral', etc.
        prompt: `You are an AI coding companion for students and hackathon developers. ${message}`,
        stream: false
      })
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama API Error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};
