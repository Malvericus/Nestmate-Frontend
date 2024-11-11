import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import "./Messages.css";

const Messages = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMatchId, setSelectedMatchId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [matches, setMatches] = useState([]);
    
    const navigate = useNavigate();

    // Helper function to get credentials
    const getCredentials = () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            throw new Error("Authentication credentials not found");
        }
        return { token, userId };
    };

    // Fetch all matches
    const fetchMatches = async () => {
        try {
            const { token, userId } = getCredentials();
            const response = await fetch('https://nestmatebackend.ktandon2004.workers.dev/matches', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'User-ID': userId
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch matches");
            }

            const data = await response.json();
            setMatches(Array.isArray(data.matches) ? data.matches : []);
        } catch (error) {
            console.error("Error fetching matches:", error);
            if (error.message === "Authentication credentials not found") {
                navigate('/login');
            }
        }
    };

    // Fetch chat messages for selected match
    const fetchChatMessages = async (matchId) => {
        try {
            const { token, userId } = getCredentials();
            const response = await fetch(`https://nestmatebackend.ktandon2004.workers.dev/chats/${matchId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'User-ID': userId
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch chat messages");
            }
            const data = await response.json();
            // Ensure messages is always an array
            setMessages(Array.isArray(data.messages) ? data.messages : []);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            if (error.message === "Authentication credentials not found") {
                navigate('/login');
            }
        }
    };

    // Handle user click to view chat messages
    const handleUserClick = async (user, matchId) => {
        setSelectedUser(user);
        setSelectedMatchId(matchId);
        await fetchChatMessages(matchId);
    };

    // Send new message
    const handleSendMessage = async () => {
        if (!input.trim() || !selectedMatchId) return;
        
        try {
            const { token, userId } = getCredentials();
            const response = await fetch(`https://nestmatebackend.ktandon2004.workers.dev/chats/${selectedMatchId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'User-ID': userId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: input }),
            });
            
            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const newMessage = {
                content: input,
                senderId: userId,
                timestamp: new Date().toLocaleTimeString(),
                id: Date.now().toString() // Add a unique ID for the message
            };

            // Ensure messages is an array before spreading
            const currentMessages = Array.isArray(messages) ? messages : [];
            setMessages([...currentMessages, newMessage]);
            setInput("");
            
            // Optionally fetch the latest messages to ensure sync
            await fetchChatMessages(selectedMatchId);
        } catch (error) {
            console.error("Error sending message:", error);
            if (error.message === "Authentication credentials not found") {
                navigate('/login');
            }
        }
    };

    // Initial fetch of matches
    React.useEffect(() => {
        fetchMatches();
    }, []);

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
                                className={`user-card ${selectedMatchId === match.id ? 'selected' : ''}`}
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
                                <div className="chat-header">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </div>
                                <div className="chat-messages">
                                    {Array.isArray(messages) && messages.length > 0 ? (
                                        messages.map((msg, index) => {
                                            const { userId } = getCredentials();
                                            return (
                                                <div key={msg.id || index} className={`chat-bubble ${msg.senderId === userId ? 'my-message' : 'their-message'}`}>
                                                    <p>{msg.content}</p>
                                                    <span className="timestamp">{msg.timestamp}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>No messages yet.</p>
                                    )}
                                </div>
                                <div className="chat-input">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
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