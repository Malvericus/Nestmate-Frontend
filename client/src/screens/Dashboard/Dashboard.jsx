import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const page = 1;
    const limit = 10;
    try {
      const response = await fetch(
        `https://nestmatebackend.ktandon2004.workers.dev/rooms/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        
        }
      );

      if (response.status === 401) {
        setError("Unauthorized access - invalid token.");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setRooms(data.rooms);
      } else {
        setError(data.error || "An error occurred while fetching rooms.");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : rooms.length > 0 ? (
        rooms.map((room, index) => (
          <div key={index} className="post-card">
            <div className="card-content">
              <h2>{room.title}</h2>
              <p>{room.description}</p>
              <p>{room.location}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default Dashboard;
