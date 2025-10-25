// Test component to verify chat functionality
// Add this to your browser console to test

function testChat() {
  console.log('Testing AI Chat functionality...');
  
  // Test cases
  const testMessages = [
    'Hello',
    'Explain this code',
    'How can I improve this?',
    'Give me a React template',
    'I am new to programming'
  ];
  
  testMessages.forEach((message, index) => {
    setTimeout(() => {
      console.log(`Test ${index + 1}: "${message}"`);
      // Simulate clicking the send button
      const input = document.querySelector('input[placeholder*="Ask me anything"]');
      const sendButton = document.querySelector('button[class*="bg-blue-500"]');
      
      if (input && sendButton) {
        input.value = message;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        sendButton.click();
      }
    }, index * 2000);
  });
}

// Run the test
testChat();
