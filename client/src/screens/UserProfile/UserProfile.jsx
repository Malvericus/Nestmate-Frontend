import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, House, Calendar, Cigarette, Cat, CircleDollarSign } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import './UserProfile.css';

const UserProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    ageRange: { min: 18, max: 100 },
    gender: 'any',
    smoker: false,
    pet: false,
    rentRange: { min: 0, max: 10000 },
    roomType: 'shared',
    location: '',
    occupancy: 'immediately'
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveChanges = async () => {
    // Construct the payload based on `updateUserSchema`
    const userPayload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      gender: userData.gender === 'any' ? 'other' : userData.gender,
      dob: userData.dob,
      profilePictureUrl: userData.profilePictureUrl,
      socialMediaLinks: userData.socialMediaLinks,
      preferences: {
        ageRange: userData.ageRange,
        smoker: userData.smoker,
        pet: userData.pet,
        rentRange: userData.rentRange,
        roomType: userData.roomType,
        location: userData.location,
        occupancy: userData.occupancy
      }
    };
    console.log(JSON.stringify(userPayload));
  
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      console.log(userId);
      console.log(token);
      const response = await fetch(`https://nestmatebackend.ktandon2004.workers.dev/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userPayload),
      });
  
      if (response.ok) {
        setShowModal(true); // Show the modal after saving changes
        // Save updated user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        console.error('Failed to save changes');
      }
    } catch (error) {
      console.error('An error occurred while saving changes:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false); // Hide modal when closed
  };

  return (
    <div className="user-profile-container">
      <div className="profile-section">
        <img src={Person} alt="Profile" className="profile-picture" />
        <div className="user-details">
          <h2>Alex Taylor</h2>
          <p>2@gmail.com</p>
        </div>
      </div>

      <div className="preferences">
        <div className="preference-section">
          <span><User size={18} /> Age Range</span>
          <div className="input-group">
            <input type="number" name="ageRange.min" value={userData.ageRange.min} onChange={handleInputChange} min="18" max="100" />
            <span>-</span>
            <input type="number" name="ageRange.max" value={userData.ageRange.max} onChange={handleInputChange} min="18" max="100" />
          </div>
        </div>

        <div className="preference-section">
          <span>Gender</span>
          <select name="gender" value={userData.gender} onChange={handleInputChange}>
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="preference-section">
          <span><Cigarette size={18} /> Smoker</span>
          <label className="switch">
            <input type="checkbox" name="smoker" checked={userData.smoker} onChange={handleInputChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="preference-section">
          <span><Cat size={18} /> Pets</span>
          <label className="switch">
            <input type="checkbox" name="pet" checked={userData.pet} onChange={handleInputChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="preference-section">
          <span><CircleDollarSign size={18} /> Rent Range</span>
          <div className="input-group">
            <input type="number" name="rentRange.min" value={userData.rentRange.min} onChange={handleInputChange} min="0" max="10000" />
            <span>-</span>
            <input type="number" name="rentRange.max" value={userData.rentRange.max} onChange={handleInputChange} min="0" max="10000" />
          </div>
        </div>

        <div className="preference-section">
          <span><House size={18} /> Room Type</span>
          <select name="roomType" value={userData.roomType} onChange={handleInputChange}>
            <option value="shared">Shared</option>
            <option value="private">Private</option>
            <option value="any">Any</option>
          </select>
        </div>

        <div className="preference-section">
          <span><Calendar size={18} /> Occupancy</span>
          <select name="occupancy" value={userData.occupancy} onChange={handleInputChange}>
            <option value="immediately">Immediately</option>
            <option value="within1Month">Within 1 Month</option>
            <option value="within2Months">Within 2 Months</option>
            <option value="later">Later</option>
          </select>
        </div>
      </div>

      <div className="save-section">
        <button onClick={handleSaveChanges}>Save Changes</button>
      </div>

      {/* Modal for "Changes Saved" */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Changes Saved!</h3>
            <p>Your changes have been saved successfully.</p>
            <button onClick={closeModal} className="close-modal-btn">Close</button>
            <Link to="/dashboard" className="view-dashboard-btn">
              View Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;