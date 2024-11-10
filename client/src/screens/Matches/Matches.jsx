import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import "./Matches.css";

const Matches = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [rooms, setRooms] = useState([]); // State to store rooms data
    const [searchParams, setSearchParams] = useState({
        location: '',
        minRent: '',
        maxRent: '',
        roomType: '',
        availableFrom: '',
        page: '1',
        limit: '10',
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

    // Fetch rooms from the backend
    const fetchRooms = async () => {
        try {
            const response = await axios.post('https://nestmatebackend.ktandon2004.workers.dev/rooms/getrooms/city', searchParams);
            setRooms(response.data.rooms); // Update the rooms state with response data
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    // Handle input changes for search parameters
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    // Submit form to fetch rooms
    const handleSearch = (e) => {
        e.preventDefault();
        fetchRooms();
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

            {/* Search Form */}
            <form className="search-form" onSubmit={handleSearch}>
                <input type="text" name="location" value={searchParams.location} onChange={handleInputChange} placeholder="City" required />
                <input type="text" name="minRent" value={searchParams.minRent} onChange={handleInputChange} placeholder="Min Rent" />
                <input type="text" name="maxRent" value={searchParams.maxRent} onChange={handleInputChange} placeholder="Max Rent" />
                <input type="text" name="roomType" value={searchParams.roomType} onChange={handleInputChange} placeholder="Room Type" />
                <input type="date" name="availableFrom" value={searchParams.availableFrom} onChange={handleInputChange} placeholder="Available From" />
                <button type="submit">Search</button>
            </form>

            {/* Rooms List */}
            <div className="matches-list">
                {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                        <div key={index} className="match-tile" onClick={() => handleTileClick(room)}>
                            <img src={Person} alt="Profile" className="profile-icon" />
                            <div className="match-details">
                                <p className="name">{room.owner.firstName} {room.owner.lastName}</p>
                                <p className="room-type">{room.roomType}</p>
                            </div>
                            <p className="budget">{room.rent}</p>
                            <p className="status">{room.availableFrom}</p>
                        </div>
                    ))
                ) : (
                    <p>No rooms available</p>
                )}
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
