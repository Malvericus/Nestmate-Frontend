import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ThumbsUp, MessageCircle, MoreHorizontal, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import Room1 from "../../assets/1.jpg";
import HomeIcon from "../../assets/HomeIcon.svg";
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('share');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch rooms when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `https://nestmatebackend.ktandon2004.workers.dev/rooms/`, // No query parameters
          {
            method: 'GET', // Send as POST request with a body
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add Authorization token
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setRooms(data.rooms || []); // Set rooms if found, else empty array
        } else {
          setError(`Error: ${data.error || 'Failed to fetch rooms'} (Status: ${response.status})`);
        }
      } catch (err) {
        setError('Network error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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

      {/* Display rooms */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : rooms.length === 0 ? (
        <div>No rooms available</div>
      ) : (
        rooms.map((room, index) => (
          <div key={index} className="post-card">
            <div className="card-image">
              <img
                src={room.photosUrl ? room.photosUrl[0] : Room1} // Assuming room has photosUrl array
                alt="Room"
              />
              <span className="badge">Techie</span>
            </div>
            <div className="card-content">
              <h2>{room.title || 'No Title'}</h2>
              <p>{room.location?.subLocality || 'Unknown Location'}</p>
              <p className="sharing">{room.roomType || 'Unknown'}</p>
              <p className="user-details">
                {room.owner ? room.owner.firstName + ' ' + room.owner.lastName : 'Unknown User'}
              </p>
            </div>
            <div className="card-actions">
              <ThumbsUp className="action-button" size={20} color="#5c8aec" />
              <MessageCircle className="action-button" size={20} color="#5c8aec" />
              <MoreHorizontal className="action-button" size={20} color="#5c8aec" />
            </div>
          </div>
        ))
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
