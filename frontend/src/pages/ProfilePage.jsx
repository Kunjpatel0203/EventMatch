import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  CameraAlt as CameraAltIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || null
  );
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/${userId}`
        );
        console.log("user",response.data)
        setUserDetails(response.data);
        // Initialize edited details with current user data
        setEditedDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleEditClick = () => setEditMode(true);

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedDetails(userDetails); // Reset to original data
  };

  const handleInputChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/user/${userId}`,
        editedDetails
      );
      setUserDetails(editedDetails); // Update displayed details
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem("profileImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventChat = async (eventId, isEventChat) => {
    try {
      // Fetch event details first
      console.log("E", eventId);
      const eventResponse = await axios.get(
        `http://localhost:8080/api/events/${eventId}`
      );
  
      const eventDetails = eventResponse.data;
      console.log("e", eventDetails);
  
      // Navigate to chat with full event details and a timestamp to force state change
      navigate('/chat', {
        state: {
          eventDetails: {
            eventId: eventDetails.id,
            eventTitle: eventDetails.title,
            roomId: `${eventId}`,
            isEventChat: isEventChat,
            timestamp: new Date().getTime() // Add timestamp to ensure state is seen as different
          }
        }
      });
    } catch (error) {
      console.error('Error fetching event details:', error);
      // Fallback navigation if event fetch fails
      navigate('/chat', {
        state: {
          eventDetails: {
            eventId: eventId,
            roomId: `${eventId}`,
            eventTitle: "Event Chat",
            isEventChat: isEventChat,
            timestamp: new Date().getTime() // Add timestamp here too
          }
        }
      });
    }
  };


  // Function to get social media profile URLs
  const getSocialMediaUrl = (platform, username) => {
    if (!username) return null;

    switch (platform) {
      case "instagram":
        return `https://instagram.com/${username}`;
      case "twitter":
        return `https://x.com/${username}`;
      case "linkedin":
        return username.includes("linkedin.com")
          ? username
          : `https://linkedin.com/in/${username}`;
      default:
        return null;
    }
  };

  // Return loading state if user details aren't loaded yet
  if (!userDetails) {
    return (
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{ mt: 4, p: 4, borderRadius: 2, textAlign: "center" }}
        >
          <Typography>Loading profile...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box display="flex" alignItems="center">
            <Box position="relative">
              <Avatar
                src={profileImage || userDetails?.avatarUrl}
                alt={userDetails?.name}
                sx={{ width: 120, height: 120, mr: 3 }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "background.paper",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box>
              {editMode ? (
                <TextField
                  name="username"
                  label="Username"
                  value={editedDetails.username || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="h4" fontWeight="bold">
                  {userDetails?.username || "Not Specified"}
                </Typography>
              )}
              <Typography variant="subtitle1" color="text.secondary">
                {userDetails?.email}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {!editMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveChanges}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Profile" />
          <Tab label="Hosted Events" />
          <Tab label="Sponsored Events" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>

              {/* Basic Information */}
              <Box mb={3}>
                <Typography variant="body1" mb={1}>
                  <strong>Email:</strong> {userDetails.email || "Not Specified"}
                </Typography>

                {editMode ? (
                  <TextField
                    name="phone"
                    label="Phone"
                    value={editedDetails.phone || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Phone:</strong>{" "}
                    {userDetails.phone || "Not Specified"}
                  </Typography>
                )}
              </Box>

              {/* Additional Information - Always displayed */}
              <Box mt={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  Additional Information
                </Typography>

                {editMode ? (
                  <TextField
                    name="company"
                    label="Company Name"
                    value={editedDetails.company || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                ) : (
                  <Typography variant="body1" mb={1}>
                    <strong>Company:</strong>{" "}
                    {userDetails.company || "Not Specified"}
                  </Typography>
                )}

                {/* Social Media Section with Icons */}
                <Box mt={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Social Media
                  </Typography>

                  {editMode ? (
                    <>
                      <TextField
                        name="instagram"
                        label="Instagram Username"
                        value={editedDetails.instagram || ""}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        placeholder="username (without @)"
                        InputProps={{
                          startAdornment: (
                            <InstagramIcon sx={{ mr: 1, color: "#E1306C" }} />
                          ),
                        }}
                      />
                      <TextField
                        name="twitter"
                        label="X Username"
                        value={editedDetails.twitter || ""}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        placeholder="username (without @)"
                        InputProps={{
                          startAdornment: (
                            <XIcon sx={{ mr: 1, color: "#000000" }} />
                          ),
                        }}
                      />
                      <TextField
                        name="linkedin"
                        label="LinkedIn Username"
                        value={editedDetails.linkedin || ""}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        placeholder="username or full profile URL"
                        InputProps={{
                          startAdornment: (
                            <LinkedInIcon sx={{ mr: 1, color: "#0077B5" }} />
                          ),
                        }}
                      />
                    </>
                  ) : (
                    <Box display="flex" gap={2} mt={1}>
                      {userDetails.instagram && (
                        <Tooltip title={`@${userDetails.instagram}`}>
                          <IconButton
                            component="a"
                            href={getSocialMediaUrl(
                              "instagram",
                              userDetails.instagram
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            sx={{
                              color: "#E1306C",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                          >
                            <InstagramIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {userDetails.twitter && (
                        <Tooltip title={`@${userDetails.twitter} on X`}>
                          <IconButton
                            component="a"
                            href={getSocialMediaUrl(
                              "twitter",
                              userDetails.twitter
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            sx={{
                              color: "#000000",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                          >
                            <XIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {userDetails.linkedin && (
                        <Tooltip title="LinkedIn Profile">
                          <IconButton
                            component="a"
                            href={getSocialMediaUrl(
                              "linkedin",
                              userDetails.linkedin
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            sx={{
                              color: "#0077B5",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                          >
                            <LinkedInIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {!userDetails.instagram &&
                        !userDetails.twitter &&
                        !userDetails.linkedin && (
                          <Typography variant="body2" color="text.secondary">
                            No social media profiles added.
                          </Typography>
                        )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Hosted Events
            </Typography>
            {userDetails.events && userDetails.events.length > 0 ? (
              <Box
                sx={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {userDetails.events.map((event, index) => (
                  <Box
                    key={event.id || index}
                    p={1}
                    borderBottom="1px solid #eee"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle2">{event.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(event.date).toLocaleDateString()} -
                        Location: {event.location}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      size="small"
                      onClick={() => handleEventChat(event.id, true)}
                    >
                      Event Chat
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1">No events hosted yet.</Typography>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Sponsored Events
            </Typography>
            {userDetails.participatedAuctions &&
    userDetails.participatedAuctions.filter(auction => {
      // Check if current user is the highest bidder
      if (auction.bids && auction.bids.length > 0) {
        // Sort bids by amount in descending order
        console.log(auction.bids)
        const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
        //console.log("S",sortedBids)
        // Get the highest bid
        const highestBid = sortedBids[0];
        console.log(highestBid.bidder)
        // Check if the current user is the highest bidder
        return highestBid.bidder === userId; // Adjust this based on how user ID is stored in bid objects
      }
      return false;
    }).length > 0 ? (
      <Box
        sx={{
          maxHeight: "160px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        {userDetails.participatedAuctions
          .filter(auction => {
            // Same filter logic as above
            if (auction.bids && auction.bids.length > 0) {
              const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
              const highestBid = sortedBids[0];
              console.log(highestBid.bidder)
              return highestBid.bidder === userId;
            }
            return false;
          })
          .map((auction, index) => (
            // Same rendering code as you had before
            <Box
              key={auction.id || index}
              p={1}
              borderBottom="1px solid #eee"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle2">
                  {auction.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(auction.createdAt).toLocaleDateString()}{" "}
                  - Description: {auction.itemDescription}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {auction.status} - Your Winning Bid: ₹
                  {auction.currentHighestBid}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<ChatIcon />}
                size="small"
                onClick={() => handleEventChat(auction.event.id, false)}
              >
                Event Chat
              </Button>
            </Box>
          ))}
      </Box>
    ) : (
      <Typography variant="body1">No events won yet.</Typography>
    )}
          </Box>
        )}

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
