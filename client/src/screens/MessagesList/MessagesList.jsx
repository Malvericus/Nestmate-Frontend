import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import axios from 'axios';
import "./Messages.css";

const Messages = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [matches, setMatches] = useState([]);
    
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");  // Assuming token is stored in localStorage

    // Fetch all matches (you can change this according to how you get the match data)
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('https://nestmatebackend.ktandon2004.workers.dev/matches/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMatches(response.data.matches);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };
        fetchMatches();
    }, [token]);

    // Fetch chat messages for selected match
    const fetchChatMessages = async (matchId) => {
        try {
            const response = await axios.get(`https://nestmatebackend.ktandon2004.workers.dev/chats/${matchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    // Handle user click to view chat messages
    const handleUserClick = async (user, matchId) => {
        setSelectedUser(user);
        await fetchChatMessages(matchId);
    };

    // Send new message
    const handleSendMessage = async () => {
        if (input.trim()) {
            const matchId = selectedUser?.matchId;  // Assuming you get matchId from the selected user
            try {
                await axios.post(`https://nestmatebackend.ktandon2004.workers.dev/chats/${matchId}`, 
                    { content: input },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // Update messages after sending
                setMessages([...messages, { content: input, senderId: "me", timestamp: new Date().toLocaleTimeString() }]);
                setInput("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
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
                        {matches.map((match) => (
                            <div
                                key={match.id}
                                className={`user-card ${selectedUser && selectedUser.id === match.otherUser.id ? 'selected' : ''}`}
                                onClick={() => handleUserClick(match.otherUser, match.id)}
                            >
                                <div className="user-details">
                                    <h4>{match.otherUser.firstName} {match.otherUser.lastName}</h4>
                                    <p>Active</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-screen">
                        {selectedUser ? (
                            <>
                                <div className="chat-header">{selectedUser.firstName} {selectedUser.lastName}</div>
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`chat-bubble ${msg.senderId === "me" ? 'my-message' : 'their-message'}`}>
                                            <p>{msg.content}</p>
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
