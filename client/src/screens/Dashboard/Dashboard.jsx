import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Edit, Trash2, Home, Compass, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import Room from "../../assets/{room}.jpg";
import HomeIcon from "../../assets/HomeIcon.svg";
import './Dashboard.css';
import Modal from './Modal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('share');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'search' ? '/matches' : '/dashboard');
  };

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");

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

  const handleDelete = async (roomTitle) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("Missing token");
      return;
    }
  
    // Find the room with the given title
    const roomToDelete = rooms.find(room => room.title === roomTitle);
  
    if (!roomToDelete || !roomToDelete.id) {
      console.error("Room not found or missing ID");
      return;
    }
  
    try {
      const response = await fetch(`https://nestmatebackend.ktandon2004.workers.dev/rooms/${roomToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // Remove the room from local state
        setRooms(rooms.filter(room => room.id !== roomToDelete.id));
        console.log("Room deleted successfully");
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete room: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("An error occurred while deleting the room:", error);
    }
  };

  const handleEditClick = (room) => {
    setEditRoom(room);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem("token");
  
    if (!token || !editRoom || !editRoom.id) {
      console.error("Missing token or room ID");
      return;
    }
  
    // Constructing the payload with the correct field names expected by the backend
    const roomPayload = {
      title: editRoom.title,
      description: editRoom.description,
      subLocality: editRoom.subLocality,
      city: editRoom.city,
      state: editRoom.state,
      pincode: editRoom.pincode,
      rent: editRoom.rent,
      roomType: editRoom.roomType,
      amenities: editRoom.amenities,
      photosUrl: editRoom.photosUrl,
      availableFrom: editRoom.availableFrom,
    };
  
    try {
      const response = await fetch(`https://nestmatebackend.ktandon2004.workers.dev/rooms/${editRoom.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(roomPayload),
      });
  
      if (response.ok) {
        const updatedRoom = await response.json();
  
        // Update the room in the local state
        setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
        setShowEditModal(false); // Close the modal
      } else {
        const errorData = await response.json();
        console.error(`Failed to save changes: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("An error occurred while saving changes:", error);
    }
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

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : rooms.length > 0 ? (
        rooms.map((room, index) => (
          <div key={room.id || index} className="post-card">
            <div className="card-image">
              <img src={Room} alt="Room" />
            </div>
            <div className="card-content">
              <h2>{room.title}</h2>
              <p>{room.location}</p>
              <p className="sharing">{room.roomType}</p>
              <p className="user-details">
                A beautiful and fully furnished apartment in the heart of the city.
              </p>
              <p className="available-date">Available from: {room.availableFrom || '2024-10-15'}</p>
            </div>
            <div className="card-actions">
              <Edit
                className="action-button"
                size={20}
                color="black"
                onClick={() => handleEditClick(room)}
              />
              <Trash2
                className="action-button"
                size={20}
                color="black"
                onClick={() => handleDelete(room.title)}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="no-rooms-text">No rooms available</p>
      )}

      {showEditModal && editRoom && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h2>Edit Room</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
          >
            <label>
              Title:
              <input
                type="text"
                value={editRoom.title}
                onChange={(e) => setEditRoom({ ...editRoom, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <textarea
                value={editRoom.description || ''}
                onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })}
              />
            </label>
            <label>
              Available From:
              <input
                type="date"
                value={editRoom.availableFrom || ''}
                onChange={(e) => setEditRoom({ ...editRoom, availableFrom: e.target.value })}
              />
            </label>
            <button type="submit">Save Changes</button>
          </form>
        </Modal>
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