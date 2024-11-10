import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Messages from './components/Messages';
import Input from './components/Input';
import BotMessage from './components/BotMessage';
import UserMessage from './components/UserMessage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import "./Chatbot.css";

const API = {
  GetChatbotResponse: async (model, message) => {
    try {
      console.log("Sending message to API:", message);
      // Generate content and wait for the response
      const result = await model.generateContent(message);
      // Get the response text from the result
      const response = await result.response.text();
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      return "Sorry, I couldn't process that. Error: " + error.message;
    }
  }
};

const ChatConnections = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the AI model
  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Fetch API key from your backend
        const response = await fetch('https://nestmatebackend.ktandon2004.workers.dev/chats/getapi');
        const data = await response.json();
        
        if (!data.apiKey) {
          throw new Error('API key not found in response'+data.apiKey);
        }

        // Initialize the Gemini AI client
        const genAI = new GoogleGenerativeAI(data.apiKey);
        const aiModel = genAI.getGenerativeModel({ 
          model: "tunedModels/nestmateassistant-kfjyqmeqrlzr"
        });
        
        setModel(aiModel);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Google Generative AI:", error);
        setIsLoading(false);
      }
    };

    initializeAI();
  }, []);

  // Load welcome message after model is initialized
  useEffect(() => {
    const loadWelcomeMessage = async () => {
      if (!model) return;
      
      try {
        const welcomeResponse = await API.GetChatbotResponse(model, "hi");
        setMessages([
          <BotMessage 
            key="welcome"
            text={welcomeResponse}
          />
        ]);
      } catch (error) {
        console.error("Error loading welcome message:", error);
      }
    };

    if (model) loadWelcomeMessage();
  }, [model]);

  // Send message function
  const send = async (text) => {
    if (!text.trim() || !model) return;

    try {
      // Add user message immediately
      setMessages(prev => [
        ...prev,
        <UserMessage key={`user-${prev.length}`} text={text} />
      ]);

      // Get bot response
      const botResponse = await API.GetChatbotResponse(model, text);
      
      // Add bot message
      setMessages(prev => [
        ...prev,
        <BotMessage key={`bot-${prev.length}`} text={botResponse} />
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        <BotMessage 
          key={`error-${prev.length}`} 
          text="Sorry, I encountered an error processing your message." 
        />
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="content-section">
        {/* Sidebar Navigation */}
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

        {/* Chatbot Section */}
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