import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, House, Calendar, Cigarette, Cat, CircleDollarSign } from 'lucide-react';
import Person from "../../assets/PersonIcon.svg";
import './UserProfile.css';

const UserProfile = () => {
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleSaveChanges = () => {
    setSuccessMessage('Changes saved successfully!');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="user-profile-container">
      <div className="profile-section">
        <img src={Person} alt="Profile" className="profile-picture" />
        <div className="user-details">
          <h2>John Doe</h2>
          <p>john.doe@example.com</p>
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
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default UserProfile;