import { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthPage.css";
import p1 from "./p1.png";
import OTPVerification from "./OTPVerification";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(1);
  const [showOtp, setShowOtp] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        values
      );
      toast.success("Login successful!");
      console.log(response.data);
      console.log(response.data.id)
      localStorage.setItem("userId", response.data.id);
      navigate("/Landing");
    } catch (error) {
      toast.error(error.response?.data || "An error occurred during login");
    }
    setSubmitting(false);
  };

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      setUserDetails({
        email: values.email,
        username: values.username,
        password: values.password
      });
      setShowOtp(true);
      toast.success("OTP sent successfully. Please check your email!");
      const response = await axios.post(
        "http://localhost:8080/api/register/initiate",
        values
      );
      console.log(response);
    } catch (error) {
      toast.error(
        error.response?.data || "An error occurred during registration"
      );
    }
    setSubmitting(false);
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
    setTabValue(0);
  };

  if (showOtp) {
    return <OTPVerification userDetails={userDetails} onBackToLogin={handleBackToLogin} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-main">
        <div className="auth-form">
          <ToastContainer />
          <Typography variant="h5" className="auth-title">
            Welcome to EventMatch!
          </Typography>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            className="auth-tabs"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#343a40",
                height: 3,
              }
            }}
          >
            <Tab label="Login" className="auth-tab" />
            <Tab label="Register" className="auth-tab" />
          </Tabs>
          {tabValue === 0 && (
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="auth-form-fields">
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    className="auth-field"
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    className="auth-field"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="auth-button"
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          )}
          {tabValue === 1 && (
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="auth-form-fields">
                  <Field
                    as={TextField}
                    name="username"
                    label="Username"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    className="auth-field"
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    className="auth-field"
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    className="auth-field"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="auth-button"
                    disabled={isSubmitting}
                  >
                    Register
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
        <div className="animation-section">
          <RotatingAnimations />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Typography variant="h5" className="features-title">
          Discover the features that make EventMatch so easy
          <br /> to use !!
        </Typography>
        <div className="feature-row">
          <div className="feature-container">
            <div className="feature-description">
              <h2>Effortless Collaboration Between Event Hosts and Sponsors</h2>
              <ul>
                <li>
                  <strong>Streamlined Event Management:</strong> Event hosts can
                  easily create and manage event listings, including details
                  such as name, description, date, venue, and auction
                  information. This helps save time and ensures clarity for
                  sponsors.
                </li>
                <li>
                  <strong>Simplified Bidding Process:</strong> Sponsors can
                  seamlessly browse through event opportunities and place bids
                  with ease, ensuring they secure the best opportunities for
                  collaboration.
                </li>
                <li>
                  <strong>Interactive Chat Rooms:</strong> Once a bid is won,
                  both the event host and sponsor gain access to a dedicated
                  chat room to discuss details, share updates, and finalize
                  arrangements in real time.
                </li>
              </ul>
            </div>
            <div className="feature-image">
              <img
                src={p1}
                alt="Collaboration"
                className="image"
              />
            </div>
          </div>
        </div>

        <div className="feature-container">
          {/* First Feature Row */}
          <div className="feature-row">
            <div className="feature-image">
              <img
                src={p1}
                alt="Event Creation"
                className="feature-img"
              />
            </div>
            <div className="feature-description">
              <h2>Easily Create and Manage Events</h2>
              <p>
                Event hosts can set up and manage events effortlessly by adding
                key details like event name, description, venue, date, minimum
                bid, and auction timing, ensuring sponsors have all the
                information they need.
              </p>
            </div>
          </div>
        </div>
        <div className="feature-container">
          {/* Second Feature Row */}
          <div className="feature-row reverse">
            <div className="feature-description">
              <h2>Seamless Bidding and Notifications</h2>
              <p>
                Sponsors can browse through events and place bids with ease. The
                highest bid winner is notified instantly and provided with a
                payment link to secure the sponsorship.
              </p>
            </div>
            <div className="feature-image">
              <img
                src={p1}
                alt="Bidding System"
                className="feature-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="trusted-section">
        <Typography variant="h6" className="trusted-title">
          Trusted by our humble customers:
        </Typography>
        <div className="trusted-logos">
          <div className="logo-placeholder">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrpYbBLNxB7kVKd4TXMsVGROJSXKYi4ScBFg&s"
              alt="Meetup Logo"
              className="trusted-logo"
            />
          </div>
          <div className="logo-placeholder">
            <img
              src="https://img.freepik.com/premium-vector/medical-health-plus-cross-logo-design_375081-810.jpg"
              alt="Eventbrite Logo"
              className="trusted-logo"
            />
          </div>
          <div className="logo-placeholder">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSSudyQYExXpcQT-Su_H8MyHBwvloNu0iP0g&s"
              alt="Eventbrite Logo"
              className="trusted-logo"
            />
          </div>
          <div className="logo-placeholder">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdWr2vUxgRJE2x6oyty7NOX1_jPW7LvXHRw&s"
              alt="Cvent Logo"
              className="trusted-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Rotating Animation Component with multiple scenes
const RotatingAnimations = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % 3);
    }, 8000); // Change animation every 8 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="animations-container">
      {/* Animation 1: Event Creation */}
      <div className={`animation-slide ${currentAnimation === 0 ? 'active' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="event-match-svg">
          <defs>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#343a40" />
              <stop offset="100%" stopColor="#adb5bd" />
            </linearGradient>
          </defs>
          
          {/* Background */}
          <rect width="800" height="500" fill="#f9f9f9" rx="10" ry="10" />
          
          {/* Title */}
          <text x="400" y="60" fontSize="28" textAnchor="middle" fill="#343a40" fontWeight="bold">
            Create Event
          </text>
          
          {/* Form Container */}
          <rect x="200" y="80" width="400" height="340" rx="10" ry="10" fill="#f5f5f5" stroke="#d9d9d9" strokeWidth="2" />
          
          {/* Event Form Fields */}
          <rect x="240" y="100" width="320" height="45" rx="5" ry="5" fill="white" stroke="#d9d9d9" />
          <text x="250" y="130" fontSize="16" fill="#343a40">Event Name</text>
          
          <rect x="240" y="160" width="320" height="45" rx="5" ry="5" fill="white" stroke="#d9d9d9" />
          <text x="250" y="190" fontSize="16" fill="#343a40">Location</text>
          
          <rect x="240" y="220" width="150" height="45" rx="5" ry="5" fill="white" stroke="#d9d9d9" />
          <text x="250" y="250" fontSize="16" fill="#343a40">Date</text>
          
          <rect x="410" y="220" width="150" height="45" rx="5" ry="5" fill="white" stroke="#d9d9d9" />
          <text x="420" y="250" fontSize="16" fill="#343a40">Time</text>
          
          <rect x="240" y="280" width="320" height="45" rx="5" ry="5" fill="white" stroke="#d9d9d9" />
          <text x="250" y="310" fontSize="16" fill="#343a40">Minimum Bid: ₹500</text>
          
          {/* Submit Button with Animation */}
          <rect x="320" y="350" width="160" height="45" rx="22" ry="22" fill="url(#headerGradient)">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </rect>
          <text x="400" y="380" fontSize="18" textAnchor="middle" fill="white" fontWeight="bold">
            Create Event
          </text>
          
          {/* Decorative Elements */}
          <circle cx="220" cy="90" r="5" fill="#343a40" />
          <circle cx="580" cy="90" r="5" fill="#343a40" />
          <circle cx="220" cy="410" r="5" fill="#343a40" />
          <circle cx="580" cy="410" r="5" fill="#343a40" />
          
          {/* Animated typing cursor */}
          <rect id="cursor" x="320" y="125" width="2" height="20" fill="#343a40">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
      
      {/* Animation 2: Live Auction */}
      <div className={`animation-slide ${currentAnimation === 1 ? 'active' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="event-match-svg">
          <defs>
            <linearGradient id="auctionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#343a40" />
              <stop offset="100%" stopColor="#adb5bd" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Background */}
          <rect width="800" height="500" fill="#f9f9f9" rx="10" ry="10" />
          
          {/* Title */}
          <text x="400" y="60" fontSize="28" textAnchor="middle" fill="#343a40" fontWeight="bold">
            Live Auction
          </text>
          
          {/* Event Card */}
          <rect x="200" y="80" width="400" height="120" rx="10" ry="10" fill="#f5f5f5" stroke="#d9d9d9" strokeWidth="2" />
          <text x="220" y="110" fontSize="20" fill="#343a40" fontWeight="bold">Annual Tech Conference 2025</text>
          <text x="220" y="140" fontSize="16" fill="#666">San Francisco Convention Center</text>
          <text x="220" y="170" fontSize="16" fill="#666">March 15, 2025 • 8:00 AM</text>
          
          {/* Auction Timer */}
          <rect x="270" y="210" width="260" height="60" rx="10" ry="10" fill="url(#auctionGradient)" />
          <text x="400" y="235" fontSize="16" textAnchor="middle" fill="white">Auction Ends In</text>
          <text x="400" y="255" fontSize="18" textAnchor="middle" fill="white" fontWeight="bold">
            05:24:13
            <animate attributeName="textContent" values="05:24:13;05:24:12;05:24:11" dur="3s" repeatCount="indefinite" />
          </text>
          
          {/* Current Bid */}
          <rect x="260" y="290" width="280" height="80" rx="10" ry="10" fill="white" stroke="#d9d9d9" strokeWidth="2" />
          <text x="400" y="320" fontSize="16" textAnchor="middle" fill="#343a40">Current Highest Bid</text>
          <text x="400" y="350" fontSize="24" textAnchor="middle" fill="#343a40" fontWeight="bold">₹4,500</text>
          
          {/* Place Bid Button */}
          <rect x="300" y="390" width="200" height="50" rx="25" ry="25" fill="url(#auctionGradient)">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <text x="400" y="420" fontSize="18" textAnchor="middle" fill="white" fontWeight="bold">
            Place Bid
          </text>
          
          {/* Animated bid notifications */}
          <g filter="url(#glow)" opacity="0">
            <rect x="600" y="150" width="120" height="40" rx="20" ry="20" fill="#343a40" />
            <text x="660" y="175" fontSize="14" textAnchor="middle" fill="white">New Bid: ₹4,200</text>
            <animate attributeName="opacity" values="0;1;0" dur="5s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="transform" from="translate(0,0)" to="translate(0,30)" dur="5s" begin="1s" repeatCount="indefinite" />
          </g>
          
          <g filter="url(#glow)" opacity="0">
            <rect x="600" y="200" width="120" height="40" rx="20" ry="20" fill="#343a40" />
            <text x="660" y="225" fontSize="14" textAnchor="middle" fill="white">New Bid: ₹4,500</text>
            <animate attributeName="opacity" values="0;1;0" dur="5s" begin="3s" repeatCount="indefinite" />
            <animate attributeName="transform" from="translate(0,0)" to="translate(0,30)" dur="5s" begin="3s" repeatCount="indefinite" />
          </g>
        </svg>
      </div>
      
      {/* Animation 3: Email Notifications */}
      <div className={`animation-slide ${currentAnimation === 2 ? 'active' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="event-match-svg">
          <defs>
            <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#343a40" />
              <stop offset="100%" stopColor="#adb5bd" />
            </linearGradient>
          </defs>
          
          {/* Background */}
          <rect width="800" height="500" fill="#f9f9f9" rx="10" ry="10" />
          
          {/* Title */}
          <text x="400" y="60" fontSize="28" textAnchor="middle" fill="#343a40" fontWeight="bold">
            Email Notifications
          </text>
          
          {/* Email Icon */}
          <g transform="translate(400,170) scale(0.6)">
            <rect x="-150" y="-80" width="300" height="200" rx="10" ry="10" fill="white" stroke="#d9d9d9" strokeWidth="5" />
            <polygon points="-150,-80 0,20 150,-80" fill="white" stroke="#d9d9d9" strokeWidth="5" />
            <polygon points="-150,120 0,20 150,120" fill="white" stroke="#d9d9d9" strokeWidth="5" />
            
            {/* Animated Envelope Opening */}
            <rect x="-100" y="-40" width="200" height="20" rx="5" ry="5" fill="#d9d9d9">
              <animate attributeName="y" values="-40;-35;-40" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="-100" y="-10" width="200" height="20" rx="5" ry="5" fill="#d9d9d9">
              <animate attributeName="width" values="200;180;200" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="-100" y="20" width="200" height="20" rx="5" ry="5" fill="#d9d9d9">
              <animate attributeName="x" values="-100;-90;-100" dur="3s" repeatCount="indefinite" />
            </rect>
          </g>
          
          {/* Notification Types */}
          <g transform="translate(250,330)">
            <rect x="-100" y="-25" width="200" height="50" rx="25" ry="25" fill="url(#emailGradient)" />
            <text x="0" y="5" fontSize="16" textAnchor="middle" fill="white" fontWeight="bold">
              New Event Alert
            </text>
          </g>
          
          <g transform="translate(550,330)">
            <rect x="-100" y="-25" width="200" height="50" rx="25" ry="25" fill="url(#emailGradient)" />
            <text x="0" y="5" fontSize="16" textAnchor="middle" fill="white" fontWeight="bold">
              Bid Updates
            </text>
          </g>
          
          {/* Flying emails animation */}
          <g>
            <rect x="250" y="220" width="40" height="30" rx="5" ry="5" fill="white" stroke="#d9d9d9" strokeWidth="2" transform="rotate(15)">
              <animate attributeName="x" values="250;400;550" dur="6s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="y" values="220;180;220" dur="6s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="6s" begin="0.5s" repeatCount="indefinite" />
            </rect>
          </g>
          
          <g>
            <rect x="550" y="220" width="40" height="30" rx="5" ry="5" fill="white" stroke="#d9d9d9" strokeWidth="2" transform="rotate(-15)">
              <animate attributeName="x" values="550;400;250" dur="6s" begin="3s" repeatCount="indefinite" />
              <animate attributeName="y" values="220;180;220" dur="6s" begin="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="6s" begin="3s" repeatCount="indefinite" />
            </rect>
          </g>
          
          {/* Decorative dots */}
          <circle cx="200" cy="400" r="5" fill="#343a40" />
          <circle cx="600" cy="400" r="5" fill="#343a40" />
          <circle cx="200" cy="100" r="5" fill="#343a40" />
          <circle cx="600" cy="100" r="5" fill="#343a40" />
        </svg>
      </div>
      
      {/* Animation Navigation Dots */}
      <div className="animation-dots">
        <div className={`dot ${currentAnimation === 0 ? 'active-dot' : ''}`} 
             onClick={() => setCurrentAnimation(0)}></div>
        <div className={`dot ${currentAnimation === 1 ? 'active-dot' : ''}`}
             onClick={() => setCurrentAnimation(1)}></div>
        <div className={`dot ${currentAnimation === 2 ? 'active-dot' : ''}`}
             onClick={() => setCurrentAnimation(2)}></div>
      </div>
    </div>
  );
};

export default AuthPage;