import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import "./Matches.css";

const Matches = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        minRent: '',
        maxRent: '',
        roomType: '',
        availableFrom: ''
    });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const searchRooms = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('https://nestmatebackend.ktandon2004.workers.dev/rooms/getrooms/city', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });
        console.log(JSON.stringify(filters))
        console.log(response.ok)

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            console.log(data.rooms)
            setRooms(data.rooms);
        } else {
            console.error('Failed to fetch rooms');
        }
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

            {/* Search Filters Section */}
            <div className="filters-container">
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleInputChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="minRent"
                    placeholder="Min Rent"
                    value={filters.minRent}
                    onChange={handleInputChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="maxRent"
                    placeholder="Max Rent"
                    value={filters.maxRent}
                    onChange={handleInputChange}
                    className="filter-input"
                />
                <select
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleInputChange}
                    className="filter-select"
                >
                    <option value="">Select Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Shared">Shared</option>
                    <option value="2BHK">2BHK</option>
                </select>
                <input
                    type="date"
                    name="availableFrom"
                    value={filters.availableFrom}
                    onChange={handleInputChange}
                    className="filter-input"
                />
                <button onClick={searchRooms} className="search-button">Search</button>
            </div>

            <div className="matches-list">
                {rooms.map((room, index) => (
                    <div key={index} className="match-tile" onClick={() => handleTileClick(room)}>
                        <img src={Person} alt="Profile" className="profile-icon" />
                        <div className="match-details">
                            <p className="name">{room.owner.firstName} {room.owner.lastName}</p>
                            <p className="room-type">{room.roomType}</p>
                        </div>
                        <p className="budget">{room.rent}</p>
                        <p className="status">Available</p>
                    </div>
                ))}
            </div>

            {selectedMatch && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedMatch.owner.firstName} {selectedMatch.owner.lastName}</h2>
                        <p>Room Type: {selectedMatch.roomType}</p>
                        <p>Budget: {selectedMatch.rent}</p>
                        <p>Status: Available</p>
                        <div className="modal-buttons">
                            <button className="connect-button">Connect</button>
                            <button className="close-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bottom-nav">
                <button className="nav-button" onClick={() => navigate('/dashboard')}><Home size={24} color="#6c7b8a" /></button>
                <button className="nav-button" onClick={() => navigate('/discover')}><Compass size={24} color="#6c7b8a" /></button>
                <button className="nav-button" onClick={() => navigate('/add')}><PlusCircle size={24} color="#6c7b8a" /></button>
                <button className="nav-button" onClick={() => navigate('/messages')}><Users size={24} color="#6c7b8a" /></button>
                <button className="nav-button" onClick={() => navigate('/chat/:id')}><MessageSquare size={24} color="#243c5a" /></button>
            </footer>
        </div>
    );
};

export default Matches;
