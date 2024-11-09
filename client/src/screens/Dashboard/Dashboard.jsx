import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ThumbsUp, MessageCircle, MoreHorizontal, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import Room1 from "../../assets/1.jpg";
import HomeIcon from "../../assets/HomeIcon.svg";
import './Dashboard.css';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      try {
        const response = await fetch(
          "https://nestmatebackend.ktandon2004.workers.dev/rooms/owner",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Error ${response.status}: ${errorData.error || 'Failed to fetch rooms'}`);
          return;
        }

        const data = await response.json();
        setRooms(data.rooms);
      } catch (err) {
        setError("Network error occurred");
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  const handleTabClick = (tab) => {
    navigate(tab === 'search' ? '/matches' : '/dashboard');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-navbar">
          <div><img src={HomeIcon} alt="logo" className="logo" /></div>
          <h1>Dashboard</h1>
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

      {error && <p className="error-text">{error}</p>}
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <div key={room.id} className="post-card">
            <div className="card-image">
              <img src={Room1} alt="Room" />
              <span className="badge">Techie</span>
            </div>
            <div className="card-content">
              <h2>{room.title || "Semi Furnished All Amenities"}</h2>
              <p>{room.location || "Location details not available"}</p>
              <p className="sharing">SHARING</p>
              <p className="user-details">
                Engineering Bachelor, Sophomore at Symbiosis Institute of Technology
              </p>
            </div>
            <div className="card-actions">
              <ThumbsUp className="action-button" size={20} color="#5c8aec" />
              <MessageCircle className="action-button" size={20} color="#5c8aec" />
              <MoreHorizontal className="action-button" size={20} color="#5c8aec" />
            </div>
          </div>
        ))
      ) : (
        !error && <p className="no-rooms-text">No rooms available</p>
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

export default Dashboard;
