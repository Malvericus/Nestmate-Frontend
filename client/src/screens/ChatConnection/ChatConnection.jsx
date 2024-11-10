import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    let data = JSON.stringify({
      "contents": [
        {
          "parts": [
            {
              "text": message
            }
          ]
        }
      ]
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://generativelanguage.googleapis.com/v1/tunedModels/chatm-djho3ni30kvg:generateContent',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ya29.a0AeDClZAAQJxzg_YcdSriEZJRRwcZ0Rus8DoCRxSrs2jYzxFqECF3I54ud2mW1MxAIBJ32303olwuis_rJcReueeaYlVcSg3hAtRXoGFG2aX8ZwdU7H--__EKUaVHVgVZpLNDm8P2nc17PoLpDXsKOvjFEtkptIJnTIQplpTFaCgYKATUSARASFQHGX2Mi0PCV7G7M2CQCq4jD9YJyvw0175', 
        'x-goog-user-project': 'chatx-441312'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load welcome message once component is mounted
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

    setMessages((prevMessages) => [
      ...prevMessages,
      <UserMessage key={`user-${prevMessages.length}`} text={text} />,
    ]);

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
 