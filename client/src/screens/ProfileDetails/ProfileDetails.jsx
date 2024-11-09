import React from 'react';
import { useParams } from 'react-router-dom';

const ProfileDetails = () => {
    const { id } = useParams();

    return (
        <div className="profile-details">
            <h2>Ankit Verma, 20</h2>
            <p>Western Hills Phase 2, SUS PUNE</p>
            <p>Match: 80%</p>
            <p>Rent: 16k</p>
            <button>Like</button>
            <button>Dislike</button>
        </div>
    );
};

export default ProfileDetails;
