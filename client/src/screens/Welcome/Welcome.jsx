// Welcome.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Welcome.css';
import HomeIcon from '../../assets/HomeIcon.svg'
import Phone from '../../assets/phone.svg'
import {useNavigate} from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();

    const handleRedirectToSignIn = () => {
        navigate('/signin');
    };
    return (
        <div className="welcome-screen">
            <div className="center-container">
                <div className="icon-container">
                    {/* Replace the src with your actual icon */}
                    <img src={HomeIcon} alt="Home Icon" className="center-icon"/>
                </div>
                <h1 className="welcome-text">Let’s Find your new home</h1>
                <button className="login-button phone-login" onClick={handleRedirectToSignIn}>
                    <div className="icon-circle">
                        <img
                            src={Phone}  // Replace with your actual phone icon URL or import path
                            alt="Phone Icon"
                            width="24"
                            height="24"
                        />
                    </div>
                    <div className="text-container">Login with Phone</div>
                </button>

                <p className="signup-text">
                    Don’t have an account? <a href="/signup" className="signup-link">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Welcome;
