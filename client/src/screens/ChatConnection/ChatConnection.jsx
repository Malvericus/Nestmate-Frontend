import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Messages from './components/Messages';
import Input from './components/Input';
import BotMessage from './components/BotMessage';
import UserMessage from './components/UserMessage';
import './Chatbot.css';

// API configuration and response handling
const API = {
  GetChatbotResponse: async (message) => {
    const apiUrl = 'https://generativelanguage.googleapis.com/v1/tunedModels/chatm-djho3ni30kvg:generateContent';
    const apiKey = 'ya29.a0AeDClZAAQJxzg_YcdSriEZJRRwcZ0Rus8DoCRxSrs2jYzxFqECF3I54ud2mW1MxAIBJ32303olwuis_rJcReueeaYlVcSg3hAtRXoGFG2aX8ZwdU7H--__EKUaVHVgVZpLNDm8P2nc17PoLpDXsKOvjFEtkptIJnTIQplpTFaCgYKATUSARASFQHGX2Mi0PCV7G7M2CQCq4jD9YJyvw0175';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-goog-user-project': 'chatx-441312',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ "text": message }],
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error : ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = data?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      console.log('API response:', botResponse);
      return botResponse;
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      return `Sorry, I couldn't process that. Error: ${error.message}`;
    }
  },
};

const ChatConnections = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load welcome message on component mount
  useEffect(() => {
    const loadWelcomeMessage = async () => {
      setIsLoading(true);
      const welcomeResponse = await API.GetChatbotResponse('hi');
      setMessages([<BotMessage key="welcome" text={welcomeResponse} />]);
      setIsLoading(false);
    };

    loadWelcomeMessage();
  }, []);

  const send = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      <UserMessage key={`user-${prevMessages.length}`} text={text} />,
    ]);

    // Fetch and add bot response
    setIsLoading(true);
    const botResponse = await API.GetChatbotResponse(text);
    setMessages((prevMessages) => [
      ...prevMessages,
      <BotMessage key={`bot-${prevMessages.length}`} text={botResponse} />,
    ]);
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="content-section">
        <aside className="sidebar-nav">
          <button className="nav-button" onClick={() => navigate('/dashboard')}>
            <Home size={24} color="#6c7b8a" />
          </button>
          <button className="nav-button" onClick={() => navigate('/discover')}>
            <Compass size={24} color="#6c7b8a" />
          </button>
          <button className="nav-button" onClick={() => navigate('/add')}>
            <PlusCircle size={24} color="#6c7b8a" />
          </button>
          <button className="nav-button" onClick={() => navigate('/user')}>
            <Users size={24} color="#6c7b8a" />
          </button>
          <button className="nav-button" onClick={() => navigate('/chat/:id')}>
            <MessageSquare size={24} color="#243c5a" />
          </button>
        </aside>

        <div className="chatbot-card">
          <Header />
          {isLoading ? (
            <div className="loading-message">Processing...</div>
          ) : (
            <Messages messages={messages} />
          )}
          <Input onSend={send} />
        </div>
      </div>
    </div>
  );
};

export default ChatConnections;
