import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Person from "../../assets/PersonIcon.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import { Bell, Home, Compass, PlusCircle, Users, MessageSquare, PlusCircle as UploadIcon } from 'lucide-react';
import "./AddSpace.css";

const AddSpace = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subLocality: "",
        city: "",
        state: "",
        pincode: "",
        rent: "",
        roomType: "",
        amenities: "",
        photosUrl: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const fileUrls = files.map(file => URL.createObjectURL(file));
        setFormData({ ...formData, photosUrl: fileUrls });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("https://nestmatebackend.ktandon2004.workers.dev/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Error ${response.status}: ${errorData.error || 'Failed to add room'}`);
                setLoading(false);
                return;
            }

            // Redirect to Dashboard after successful room submission
            navigate("/dashboard");
        } catch (err) {
            setError("Network error occurred");
            console.error("Submit error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">
            <header className="add-header">
                <div className="header-navbar">
                    <div><img src={HomeIcon} alt="logo" className="logo" /></div>
                    <h1>Add New Space</h1>
                    <div className="profile-icons">
                        <button className="profile-picture" onClick={() => navigate('/user')}>
                            <img src={Person} alt="User Profile" />
                        </button>
                        <Bell className="notification-icon" size={24} color="#6c7b8a" />
                    </div>
                </div>
            </header>

            <div className="input-tiles">
                <div className="tile upload-box">
                    <label htmlFor="upload-images">Upload Images</label>
                    <input type="file" id="upload-images" multiple onChange={handleFileUpload} />
                    {formData.photosUrl && (
                        <div className="uploaded-images-preview">
                            {formData.photosUrl.map((url, index) => (
                                <img key={index} src={url} alt={`Uploaded ${index}`} className="uploaded-image" />
                            ))}
                        </div>
                    )}
                </div>
                <div className="tile title-tile">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Spacious Apartment in Downtown" />
                </div>
                <div className="tile desc-tile">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="A beautiful and fully furnished apartment in the heart of the city." />
                </div>
                <div className="tile small-tile">
                    <label>Sub Locality</label>
                    <input type="text" name="subLocality" value={formData.subLocality} onChange={handleChange} placeholder="Downtown" />
                </div>
                <div className="tile small-tile">
                    <label>Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="10001" />
                </div>
                <div className="tile small-tile">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="New York" />
                </div>
                <div className="tile small-tile">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="NY" />
                </div>
                <div className="tile amenities-tile">
                    <label>Amenities</label>
                    <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="WiFi, Air Conditioning, Parking" />
                </div>
                <div className="tile small-tile">
                    <label>Rent</label>
                    <input type="number" name="rent" value={formData.rent} onChange={handleChange} placeholder="2500" />
                </div>
                <div className="tile small-tile">
                    <label>Room Type</label>
                    <select name="roomType" value={formData.roomType} onChange={handleChange}>
                        <option value="Single">Single</option>
                        <option value="Shared">Shared</option>
                        <option value="Any">Any</option>
                    </select>
                </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="share-room-button">
                {loading ? "Sharing..." : "Share Room"}
            </button>
            {error && <p className="error-text">{error}</p>}

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

export default AddSpace;