import { useState, useEffect, useRef } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
//import { toast } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OTPVerification.css";
//import { Password } from "@mui/icons-material";
import PropTypes from "prop-types";

const OTPVerification = ({ userDetails, onBackToLogin }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedOtp = pastedData.slice(0, 6).split("");

    if (!/^\d+$/.test(pastedData)) {
      toast.error("OTP must contain only numbers");
      return;
    }

    const newOtp = [...otp];
    pastedOtp.forEach((value, i) => {
      if (i < 6) newOtp[i] = value;
    });
    setOtp(newOtp);

    // Focus last filled input or the next empty one
    const lastIndex = Math.min(pastedOtp.length - 1, 5);
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:8080/api/register/verifyotp",
        {
          otp: otpValue,
          email: userDetails.email,
          username: userDetails.username,
          password: userDetails.password,
        }
      );
      console.log(response);
      setIsVerified(false);
      toast.success("Email verified successfully!");

      // Redirect to login after short delay
      setTimeout(() => {
        if (onBackToLogin) {
          onBackToLogin();
        } else {
          navigate("/"); // Navigate back to auth page
        }
      }, 2000);
    } catch (error) {
      //console.error("Verification error:", error); // Logs full error to console
      //console.error("Error response:", error.response);
      console.error("Verification error:", error); // Logs full error to console
      console.error("Error response:", error.response); // Logs response if available

      // Extract error message properly
      const errorMessage =
        error.response?.data?.message || // Check if backend sends a proper message
        error.response?.data || // Check if response body itself is a string
        "Invalid verification code"; // Fallback

      toast.error(errorMessage);
      toast.error(error.response?.data || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {

    console.log("Resend button clicked!"); // Check if function is called

    setCanResend(false);
    setTimeLeft(60);

    try {
      const response = await axios.post("http://localhost:8080/api/register/resend-otp", {
        email: userDetails.email,
      });
      console.log("Resend API response:", response.data); // Check API response
      toast.info("A new verification code has been sent to your email");

      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Resend error:", error);  
      toast.error(
        error.response?.data || "Failed to resend code. Please try again."
      );
      setCanResend(true);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="otp-main-container">
        <div className="otp-verification-container">
          <div className="otp-verification-card">
            <div className="otp-header">
              {isVerified ? (
                <CheckCircleIcon className="otp-verified-icon" />
              ) : (
                <LockIcon className="otp-lock-icon" />
              )}
              <Typography variant="h5" className="otp-title">
                {isVerified ? "Verification Successful" : "Verify Your Email"}
              </Typography>
              {!isVerified && (
                <Typography variant="body1" className="otp-subtitle">
                  We've sent a 6-digit verification code to
                  <br />
                  <span className="otp-email">
                    {userDetails.email || "your email address"}
                  </span>
                </Typography>
              )}
            </div>

            {isVerified ? (
              <div className="otp-success-container">
                <div className="otp-success-animation">
                  {/* <div className="checkmark"></div> */}
                </div>
                <Typography variant="body1" className="otp-success-text">
                  Your account has been verified successfully.
                  <br />
                  Redirecting to login page...
                </Typography>
              </div>
            ) : (
              <>
                <div className="otp-inputs-wrapper">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="otp-input"
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      aria-label={`digit ${index + 1}`}
                    />
                  ))}
                </div>

                {/* <Button
                variant="contained"
                className="text-white"
                onClick={handleVerify}
                disabled={isVerifying || otp.join("").length !== 6}
              >
                {isVerifying ? (
                  <div className="otp-loading">
                    <CircularProgress size={20} color="inherit" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button> */}

                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={handleVerify}
                  disabled={isVerifying || otp.join("").length !== 6}
                >
                  {isVerifying ? (
                    <div className="otp-loading">
                      <CircularProgress size={20} color="inherit" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="otp-resend-container">
                  <Typography variant="body2" className="otp-resend-text">
                    Didn't receive the code?
                  </Typography>
                  {canResend ? (
                    <Button
                      variant="text"
                      onClick={handleResend}
                      className="otp-resend-button"
                    >
                      Resend Code
                    </Button>
                  ) : (
                    <Typography variant="body2" className="otp-timer">
                      Resend in {timeLeft}s
                    </Typography>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

OTPVerification.propTypes = {
  userDetails: PropTypes.shape({
    email: function (props, propName, componentName) {
      if (!/^\S+@\S+\.\S+$/.test(props[propName])) {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName}. Email format is invalid.`
        );
      }
    },
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  onBackToLogin: PropTypes.func.isRequired,
};

export default OTPVerification;
