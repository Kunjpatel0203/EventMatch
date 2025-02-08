import { useState } from "react";
import {
  Tabs,
  Tab,
  // Box,
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
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:8080/api/login", values);
      toast.success("Login successful!");
      console.log(response.data);
      localStorage.setItem("userId", response.data.id);
      navigate("/Landing");
    } catch (error) {
      toast.error(error.response?.data || "An error occurred during login");
    }
    setSubmitting(false);
  };

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:8080/api/register", values);
      toast.success("You have been Registered successfully now proceed for Login!");
      console.log(response.data);
      //navigate("/Landing");
    } catch (error) {
      toast.error(error.response?.data || "An error occurred during registration");
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-main">
        <div className="auth-form">
          <ToastContainer />
          <Typography variant="h5" className="auth-title">Welcome !!</Typography>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          {tabValue === 0 && (
            <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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
            <Formik initialValues={{ username: "", email: "", password: "" }} validationSchema={RegisterSchema} onSubmit={handleRegister}>
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="username"
                    label="Username"
                    fullWidth
                    margin="normal"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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
          <Typography variant="h6" color="primary">Animation Section Placeholder</Typography>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Typography variant="h5" className="features-title">
          Discover the features that make EventMatch so easy<br /> to use !!
        </Typography>
        <div className="feature-row">
        <div className="feature-container">
      <div className="feature-description">
      <h2>Effortless Collaboration Between Event Hosts and Sponsors</h2>
        <ul>
          <li>
          <strong>Streamlined Event Management:</strong> Event hosts can easily create and manage event listings, including details such as name, description, date, venue, and auction information. This helps save time and ensures clarity for sponsors.
          </li>
          <li>
          <strong>Simplified Bidding Process:</strong> Sponsors can seamlessly browse through event opportunities and place bids with ease, ensuring they secure the best opportunities for collaboration.
          </li>
          <li>
          <strong>Interactive Chat Rooms:</strong> Once a bid is won, both the event host and sponsor gain access to a dedicated chat room to discuss details, share updates, and finalize arrangements in real time.
          
          </li>
        </ul>
      </div>
      <div className="feature-image">
        <img
          src={p1}
          // alt="Agile Boards"
          alt="Image"
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
            // alt="Workflow"
            alt="Image"
            className="feature-img"
          />
        </div>
        <div className="feature-description">
          <h2>Easily Create and Manage Events</h2>
          <p>
          Event hosts can set up and manage events effortlessly by adding key details like event name, description, venue, date, minimum bid, and auction timing, ensuring sponsors have all the information they need.
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
          Sponsors can browse through events and place bids with ease. The highest bid winner is notified instantly and provided with a payment link to secure the sponsorship.
          </p>
        </div>
        <div className="feature-image">
          <img
            src={p1}
            // alt="Timeline"
            alt="Image"
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

export default AuthPage;
