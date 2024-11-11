import React, { useState, useRef, useEffect } from 'react';
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
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef(null);
    
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getCredentials = () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            throw new Error("Authentication credentials not found");
        }
        return { token, userId };
    };

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
            setMessages(Array.isArray(data.messages) ? data.messages : []);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            if (error.message === "Authentication credentials not found") {
                navigate('/login');
            }
        }
    };

    const handleUserClick = async (user, matchId) => {
        setSelectedUser(user);
        setSelectedMatchId(matchId);
        await fetchChatMessages(matchId);
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedMatchId || sendingMessage) return;
        
        try {
            setSendingMessage(true);
            const { token, userId } = getCredentials();
            
            const newMessage = {
                content: input,
                senderId: userId,
                timestamp: new Date().toLocaleTimeString(),
                id: Date.now().toString(),
                pending: true // Mark as pending until confirmed
            };

            // Optimistically add the message
            setMessages(prev => [...prev, newMessage]);
            setInput("");

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
                // If the message failed to send, remove it from the UI
                setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
                throw new Error("Failed to send message");
            }

            // Update the message to remove pending status
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === newMessage.id 
                        ? { ...msg, pending: false }
                        : msg
                )
            );

        } catch (error) {
            console.error("Error sending message:", error);
            if (error.message === "Authentication credentials not found") {
                navigate('/login');
            }
        } finally {
            setSendingMessage(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <div className="messages-container">
            {/* Header section remains the same */}
            <header className="messages-header">
                {/* ... existing header code ... */}
            </header>

            <div className="content-section">
                {/* Sidebar section remains the same */}
                <aside className="sidebar-nav">
                    {/* ... existing sidebar code ... */}
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
                                                <div 
                                                    key={msg.id || index} 
                                                    className={`chat-bubble ${msg.senderId === userId ? 'my-message' : 'their-message'} ${msg.pending ? 'pending' : ''}`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <span className="timestamp">{msg.timestamp}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>No messages yet.</p>
                                    )}
                                    <div ref={messagesEndRef} />
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
                                        disabled={sendingMessage}
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={sendingMessage}
                                    >
                                        Send
                                    </button>
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