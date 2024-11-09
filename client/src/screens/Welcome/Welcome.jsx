import React from 'react';
import './Welcome.css';
import HomeIcon from '../../assets/HomeIcon.svg'
import Phone from '../../assets/phone.svg'
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();

    const handleRedirectToSignIn = () => {
        navigate('/signin');
    };

    const handleRedirectToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="welcome-screen">
            <div className="center-container">
                <div className="icon-container">
                    <img src={HomeIcon} alt="Home Icon" className="center-icon"/>
                </div>
                <h1 className="welcome-text">Let’s Find your new home</h1>
                <button className="login-button phone-login" onClick={handleRedirectToSignIn}>
                    <div className="icon-circle">
                        <img
                            src={Phone}
                            alt="Phone Icon"
                            width="24"
                            height="24"
                        />
                    </div>
                    <div className="text-container">Login with Phone</div>
                </button>

                <p className="signup-text">
                    Don’t have an account? 
                    <button onClick={handleRedirectToSignUp} className="signup-link">Sign Up</button>
                </p>
            </div>
        </div>
    );
};

export default Welcome;
