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
    preserveAspectRatio: "xMidYMid slice",
  },
};

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  dob: "",
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Invalid phone number format";
    }
    
    if (!formData.gender) {
      errors.gender = "Please select a gender";
    }
    
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only allow numbers and basic formatting
      const formatted = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === "dob") {
      // Ensure proper date formatting
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setFormData(prev => ({ ...prev, [name]: date.toISOString() }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    setError("");
    setValidationErrors({});

    try {
      const response = await fetch(
        "https://nestmatebackend.ktandon2004.workers.dev/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: 'include', // Add this if you're using cookies
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during signup");
      }

      if (data.token) {
        localStorage.setItem("userId", data.token);
        navigate("/dashboard");
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-screen" role="main">
      <div className="center-container">
        <h1 className="welcome-text">
          ENTER <br /> YOUR DETAILS
        </h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="firstName" className="sr-only">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className={`input-field ${validationErrors.firstName ? 'error' : ''}`}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.firstName}
            />
            {validationErrors.firstName && (
              <p className="error-text" role="alert">{validationErrors.firstName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="sr-only">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className={`input-field ${validationErrors.lastName ? 'error' : ''}`}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.lastName}
            />
            {validationErrors.lastName && (
              <p className="error-text" role="alert">{validationErrors.lastName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`input-field ${validationErrors.email ? 'error' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.email}
            />
            {validationErrors.email && (
              <p className="error-text" role="alert">{validationErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`input-field ${validationErrors.password ? 'error' : ''}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.password}
            />
            {validationErrors.password && (
              <p className="error-text" role="alert">{validationErrors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="sr-only">Phone</label>
            <input
              id="phone"
              type="tel"
              placeholder="Phone"
              className={`input-field ${validationErrors.phone ? 'error' : ''}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.phone}
            />
            {validationErrors.phone && (
              <p className="error-text" role="alert">{validationErrors.phone}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="gender" className="sr-only">Gender</label>
            <select
              id="gender"
              className={`input-field ${validationErrors.gender ? 'error' : ''}`}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.gender}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {validationErrors.gender && (
              <p className="error-text" role="alert">{validationErrors.gender}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dob" className="sr-only">Date of Birth</label>
            <input
              id="dob"
              type="date"
              placeholder="Date of Birth"
              className={`input-field ${validationErrors.dob ? 'error' : ''}`}
              name="dob"
              value={formData.dob ? formData.dob.split("T")[0] : ""}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!validationErrors.dob}
            />
            {validationErrors.dob && (
              <p className="error-text" role="alert">{validationErrors.dob}</p>
            )}
          </div>

          <button
            type="submit"
            className="login-button phone-login"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            <div className="icon-circle">
              <img src={Person} alt="" aria-hidden="true" width="24" height="24" />
            </div>
            <div className="text-container">
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </div>
          </button>

          {isLoading && (
            <div className="loading-animation" role="status" aria-label="Loading">
              <Lottie options={defaultOptions} height={100} width={100} />
            </div>
          )}

          {error && (
            <p className="error-text" role="alert">{error}</p>
          )}
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/signin" className="signup-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;