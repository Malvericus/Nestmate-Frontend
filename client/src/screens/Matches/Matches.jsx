import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import "./Matches.css";

const Matches = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        location: "",
        minRent: "1000",
        maxRent: "3000",
        roomType: "2BHK",
        availableFrom: "2024-11-01",
        page: 1,
        limit: 10
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("https://nestmatebackend.ktandon2004.workers.dev/rooms/getrooms/city", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch rooms");
                }

                const data = await response.json();
                setRooms(data.rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, [formData]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(tab === 'share' ? '/dashboard' : '/matches');
    };

    const handleTileClick = (match) => {
        setSelectedMatch(match);
    };

    const closeModal = () => {
        setSelectedMatch(null);
    };

    return (
        <div className="matches-container">
            <header className="matches-header">
                <div className="header-navbar">
                    <div><img src={HomeIcon} alt="logo" className="logo" /></div>
                    <h1>Matches</h1>
                    <div className="profile-icons">
                        <button className="profile-picture" onClick={() => navigate('/user')}>
                            <img src={Person} alt="User Profile" />
                        </button>
                        <Bell className="notification-icon" size={24} color="#6c7b8a" />
                    </div>
                </div>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'share' ? 'active' : ''}`}
                    onClick={() => handleTabClick('share')}
                >
                    Share your space
                </button>
                <button
                    className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => handleTabClick('search')}
                >
                    Search Partners
                </button>
            </div>

            <div className="matches-list">
                {rooms.map((room, index) => (
                    <div className="match-tile" key={index} onClick={() => handleTileClick(room)}>
                        <img src={Person} alt="Profile" className="profile-icon" />
                        <div className="match-details">
                            <p className="name">{room.owner.firstName} {room.owner.lastName}</p>
                            <p className="room-type">{room.roomType}</p>
                        </div>
                        <p className="budget">{room.rent}</p>
                        <p className="status">{room.status}</p>
                    </div>
                ))}
            </div>

            {selectedMatch && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Add all relevant information about the user, including pets & smoking preferences here</p>
                        <div className="modal-buttons">
                            <button className="connect-button">Connect</button>
                            <button className="close-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bottom-nav">
                <button className="nav-button" onClick={() => navigate('/dashboard')}>
                    <Home size={24} color="#6c7b8a" />
                </button>
                <button className="nav-button" onClick={() => navigate('/discover')}>
                    <Compass size={24} color="#6c7b8a" />
                </button>
                <button className="nav-button" onClick={() => navigate('/add')}>
                    <PlusCircle size={24} color="#6c7b8a" />
                </button>
                <button className="nav-button" onClick={() => navigate('/messages')}>
                    <Users size={24} color="#6c7b8a" />
                </button>
                <button className="nav-button" onClick={() => navigate('/chat/:id')}>
                    <MessageSquare size={24} color="#243c5a" />
                </button>
            </footer>
        </div>
    );
};

export default Matches;
 