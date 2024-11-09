import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Messages from './components/Messages';
import Input from './components/Input';
import BotMessage from './components/BotMessage';
import UserMessage from './components/UserMessage';
import "./Chatbot.css";

// Import Google Generative AI Client
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyBmTr1Zdz6uPbBYkZAUqXruFeyJ0mlJy7w";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "Nestmate-Assistant" });

const API = {
  GetChatbotResponse: async (message) => {
    try {
      console.log("Sending message to API:", message);  // Debug log
      const prompt = message;
      const result = await model.generateContent(prompt);
      console.log("API response:", result.response.text());  // Debug log
      return result.response.text(); // Returning the chatbot response
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      return "Sorry, I couldn't process that."+error;
    }
  }
};

const ChatConnections = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);

    // Load the welcome message when the component is mounted
    useEffect(() => {
        async function loadWelcomeMessage() {
            console.log("Loading welcome message..."); // Debug log
            setMessages([ 
                <BotMessage 
                    key="0"
                    fetchMessage={async () => await API.GetChatbotResponse("hi")} 
                />
            ]);
        }
        loadWelcomeMessage();
    }, []);

    // Function to send a message to the chatbot and append the response
    const send = async (text) => {
        console.log("Sending message:", text); // Debug log
        const newMessages = messages.concat(
            <UserMessage key={messages.length + 1} text={text} />,
            <BotMessage 
                key={messages.length + 2} 
                fetchMessage={async () => await API.GetChatbotResponse(text)} 
            />
        );
        setMessages(newMessages);
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
                    {messages.length > 0 ? (
                        <Messages messages={messages} />
                    ) : (
                        <p>Loading...</p>
                    )}
                    <Input onSend={send} />
                </div>
            </div>
        </div>
    );
};

export default ChatConnections;
