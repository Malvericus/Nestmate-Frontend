import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Messages from './components/Messages';
import Input from './components/Input';
import BotMessage from './components/BotMessage';
import UserMessage from './components/UserMessage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

// API configuration and response handling
const API = {
  GetChatbotResponse: async (model, message) => {
    try {
      console.log('Sending message to API:', message);

      // Correctly format the input for generateContent
      const result = await model.generateContent(message); 
      const response = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      console.log('API response:', response);

      return response;
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      return 'Sorry, I couldn\'t process that. Error: ' + error.message;
    }
  },
};

const ChatConnections = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Generative AI model
    const initializeAI = async () => {
      try {
        const response = await fetch('https://nestmatebackend.ktandon2004.workers.dev/chats/getapi', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.apiKey) throw new Error('API key not found in response');

        const genAI = new GoogleGenerativeAI(data.apiKey);
        const aiModel = genAI.getGenerativeModel({ model: 'tunedModels/chatmate-iikhgwx9gqzb' });
        setModel(aiModel);
        console.log('AI model initialized');
      } catch (error) {
        console.error('Error initializing Google Generative AI:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAI();
  }, []);

  // Load welcome message once model is ready
  useEffect(() => {
    const loadWelcomeMessage = async () => {
      if (model) {
        try {
          const welcomeResponse = await API.GetChatbotResponse(model, 'hi');
          setMessages([<BotMessage key="welcome" text={welcomeResponse} />]);
        } catch (error) {
          console.error('Error loading welcome message:', error);
        }
      }
    };

    loadWelcomeMessage();
  }, [model]);

  const send = async (text) => {
    if (!text.trim() || !model) return;

    try {
      // Add user message
      setMessages((prevMessages) => [
        ...prevMessages,
        <UserMessage key={`user-${prevMessages.length}`} text={text} />,
      ]);

      // Fetch and add bot response
      const botResponse = await API.GetChatbotResponse(model, text);
      setMessages((prevMessages) => [
        ...prevMessages,
        <BotMessage key={`bot-${prevMessages.length}`} fetchMessage={() => Promise.resolve(botResponse)} />,
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        <BotMessage key={`error-${prevMessages.length}`} text="Sorry, I encountered an error processing your message." />,
      ]);
    }
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
            <div className="loading-message">Initializing chatbot...</div>
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