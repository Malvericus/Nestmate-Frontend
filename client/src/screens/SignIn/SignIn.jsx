import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Person from "../../assets/PersonIcon.svg";
import Lottie from "react-lottie";
import loadingAnimation from "../../assets/loadingAnimation.json"; 

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("https://nestmatebackend.ktandon2004.workers.dev/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store token and userId in localStorage
        localStorage.setItem('token', data.token);  // Store token for authorization
        localStorage.setItem('userId', data.id);    // Store userId for any further use
        console.log(localStorage.getItem('token'))
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(`${data.error} (Status: ${response.status})`);
      }
    } catch (err) {
      setError('Network error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="center-container">
        <h1 className="welcome-text">ENTER <br />YOUR DETAILS</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button phone-login" disabled={isLoading}>
            <div className="icon-circle">
              <img
                src={Person}
                alt="Person Icon"
                width="24"
                height="24"
              />
            </div>
            <div className="text-container">Sign In</div>
          </button>
          {isLoading && (
            <div className="loading-animation">
              <Lottie options={defaultOptions} height={100} width={100} />
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
