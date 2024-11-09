import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ThumbsUp, MessageCircle, MoreHorizontal, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import Room1 from "../../assets/1.jpg";
import HomeIcon from "../../assets/HomeIcon.svg";
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('share');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'search' ? '/matches' : '/dashboard');
  };

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);  // Verify token retrieval

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem("userId"); 

    try {
      const response = await fetch(
        `https://nestmatebackend.ktandon2004.workers.dev/rooms/owner/${userId}`,
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
        setLoading(false);
        return;
      }

      const data = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      setError("Network error occurred");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : rooms.length > 0 ? (
        rooms.map((room, index) => (
          <div key={room.id || index} className="post-card">
            <div className="card-image">
              <img src={Room1} alt="Room" />
              <span className="badge">Techie</span>
            </div>
            <div className="card-content">
              <h2>{room.title || "Semi Furnished All Amenities"}</h2>
              <p>{room.location || "Bella Cassa Phase 2 B"}</p>
              <p className="sharing">{room.roomType || "SHARING"}</p>
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
        <p className="no-rooms-text">No rooms available</p>
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
