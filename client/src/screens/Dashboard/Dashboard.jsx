import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ThumbsUp, MessageCircle, MoreHorizontal, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import Room1 from "../../assets/1.jpg";
import HomeIcon from "../../assets/HomeIcon.svg";
import './Dashboard.css';

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState('share');
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'search' ? '/matches' : '/dashboard'); // navigate to search or dashboard
  }

  // Function to handle redirect to the signup page (external link)
  const handleSignupRedirect = () => {
    window.location.href = "https://nestmatebackend.ktandon2004.workers.dev/auth/signup"; // external link
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

      {/* Space 1 */}
      <div className="post-card">
        <div className="card-image">
          <img
            src={Room1}
            alt="Room"
          />
          <span className="badge">Techie</span>
        </div>
        <div className="card-content">
          <h2>Semi Furnished All Amenities</h2>
          <p>Bella Cassa Phase 2 B</p>
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

      {/* Button for Signup Redirect */}
      <div className="redirect-button-container">
        <button onClick={handleSignupRedirect} className="signup-redirect-button">
          Go to Signup
        </button>
      </div>

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
