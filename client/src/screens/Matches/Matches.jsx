import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import "./Matches.css";

const Matches = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [selectedMatch, setSelectedMatch] = useState(null); // State to manage selected match for modal
    const navigate = useNavigate();

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
                <div className="match-tile" onClick={() => handleTileClick({ name: 'John Doe', roomType: 'Shared Room', budget: 1200, status: 'Available' })}>
                    <img src={Person} alt="Profile" className="profile-icon" />
                    <div className="match-details">
                        <p className="name">John Doe</p>
                        <p className="room-type">Shared Room</p>
                    </div>
                    <p className="budget">1200</p>
                    <p className="status">Available</p>
                </div>

                <div className="match-tile" onClick={() => handleTileClick({ name: 'Jane Smith', roomType: 'Private Room', budget: 900, status: 'Booked' })}>
                    <img src={Person} alt="Profile" className="profile-icon" />
                    <div className="match-details">
                        <p className="name">Jane Smith</p>
                        <p className="room-type">Private Room</p>
                    </div>
                    <p className="budget">900</p>
                    <p className="status">Booked</p>
                </div>

                {/* Add more match tiles as needed */}
            </div>

            {selectedMatch && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Add all relevant information about the user, including pets & smoking preferences here</p>
                        {/* <h2>{selectedMatch.name}</h2>
                        <p>Room Type: {selectedMatch.roomType}</p>
                        <p>Budget: {selectedMatch.budget}</p>
                        <p>Status: {selectedMatch.status}</p> */}
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