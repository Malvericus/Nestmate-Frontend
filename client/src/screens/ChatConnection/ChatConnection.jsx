import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Messages from './components/Messages';
import Input from './components/Input';
import BotMessage from './components/BotMessage';
import UserMessage from './components/UserMessage';
import "./Chatbot.css";

const API = {
  GetChatbotResponse: async (apiKey, message) => {
    try {
      console.log("Sending message to API:", message);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/tunedModels/nestmateassistant-kfjyqmeqrlzr:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: message
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Extract the response text from the Gemini API response
      const responseText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";
      return responseText;

    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      return "Sorry, I couldn't process that. Error: " + error.message;
    }
  }
};

const ChatConnections = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize by getting the API key
  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Fetch API key using PUT request
        const response = await fetch('https://nestmatebackend.ktandon2004.workers.dev/chats/getapi', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Key Response:", data);
        
        if (!data.apiKey) {
          throw new Error('API key not found in response');
        }

        setApiKey(data.apiKey);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing:", error);
        setIsLoading(false);
      }
    };

    initializeAI();
  }, []);

  // Load welcome message after API key is initialized
  useEffect(() => {
    const loadWelcomeMessage = async () => {
      if (!apiKey) return;
      
      try {
        const welcomeResponse = await API.GetChatbotResponse(apiKey, "hi");
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

    if (apiKey) loadWelcomeMessage();
  }, [apiKey]);

  // Send message function
  const send = async (text) => {
    if (!text.trim() || !apiKey) return;

    try {
      // Add user message immediately
      setMessages(prev => [
        ...prev,
        <UserMessage key={`user-${prev.length}`} text={text} />
      ]);

      // Get bot response
      const botResponse = await API.GetChatbotResponse(apiKey, text);
      
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
