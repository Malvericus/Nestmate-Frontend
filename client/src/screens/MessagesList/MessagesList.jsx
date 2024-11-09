import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import "./Messages.css";

const Messages = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    
    const navigate = useNavigate();
    
    const users = [
        { id: 1, name: 'John Doe', status: 'Available' },
        { id: 2, name: 'Jane Smith', status: 'Booked' },
    ];

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setMessages([
            { text: `Hello ${user.name}, what's up?`, sender: 'them', timestamp: '4:04 PM' },
            { text: 'Hey, same as usual, thank you. And you?', sender: 'me', timestamp: '11:43 AM' },
        ]);
    };

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'me', timestamp: new Date().toLocaleTimeString() }]);
            setInput("");
        }
    };

    return (
        <div className="messages-container">
            <header className="messages-header">
                <div className="header-navbar">
                    <div><img src={HomeIcon} alt="logo" className="logo" /></div>
                    <h1>Connection Messages</h1>
                    <div className="profile-icons">
                        <button className="profile-picture" onClick={() => navigate('/user')}>
                            <img src={Person} alt="User Profile" />
                        </button>
                        <Bell className="notification-icon" size={24} color="#6c7b8a" />
                    </div>
                </div>
            </header>

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

                <div className="chat-card">
                    <div className="user-list">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className={`user-card ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="user-details">
                                    <h4>{user.name}</h4>
                                    <p>{user.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-screen">
                        {selectedUser ? (
                            <>
                                <div className="chat-header">{selectedUser.name}</div>
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`chat-bubble ${msg.sender === 'me' ? 'my-message' : 'their-message'}`}>
                                            <p>{msg.text}</p>
                                            <span className="timestamp">{msg.timestamp}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button onClick={handleSendMessage}>Send</button>
                                </div>
                            </>
                        ) : (
                            <div className="no-connection">No Connection Selected</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;