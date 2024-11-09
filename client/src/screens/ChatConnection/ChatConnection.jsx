import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import BotMessage from './components/BotMessage';
import UserMessage from './components/UserMessage';
import Messages from './components/Messages';
import Input from './components/Input';
import API from './ChatbotApi';  // Import the modified API
import Header from './components/Header';
import "./Chatbot.css";

const ChatConnections = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function loadWelcomeMessage() {
            setMessages([ 
                <BotMessage 
                    key="0"
                    fetchMessage={async () => await API.GetChatbotResponse("hi")} 
                />
            ]);
        }
        loadWelcomeMessage();
    }, []);

    const send = async (text) => {
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
            {/* Sidebar Navigation */}
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

                {/* Chatbot Section */}
                <div className="chatbot-card">
                    <Header />
                    <Messages messages={messages} />
                    <Input onSend={send} />
                </div>
            </div>
        </div>
    );
};

export default ChatConnections;
