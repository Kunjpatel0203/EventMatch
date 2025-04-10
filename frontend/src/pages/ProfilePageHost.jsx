import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProfilePageHost = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchHostProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${hostId}`);
        setHost(response.data);
      } catch (err) {
        setError("Failed to fetch host profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchHostProfile();
  }, [hostId]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  
  const getSocialMediaUrl = (platform, username) => {
    if (!username) return null;
    
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${username}`;
      case 'twitter':
        return `https://x.com/${username}`;
      case 'linkedin':
        return username.includes('linkedin.com') 
          ? username 
          : `https://linkedin.com/in/${username}`;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" sx={{ mt: 2 }}>
        Back
      </Button>
      <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            src={host?.avatarUrl}
            alt={host?.username}
            sx={{ width: 120, height: 120, mr: 3 }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {host?.username}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {host?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
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
              
              <Box mb={3}>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon color="action" sx={{ mr: 1 }} />
                  <Typography>{host?.email || "Not provided"}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon color="action" sx={{ mr: 1 }} />
                  <Typography>{host?.phone || "Not provided"}</Typography>
                </Box>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Additional Information
                </Typography>
                
                <Typography variant="body1" mb={1}>
                  <strong>Company:</strong> {host?.company || "Not Specified"}
                </Typography>

                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Social Media
                  </Typography>
                  
                  <Box display="flex" gap={2} mt={1}>
                    {host?.instagram && (
                      <Tooltip title={`@${host.instagram}`}>
                        <IconButton 
                          component="a" 
                          href={getSocialMediaUrl('instagram', host.instagram)} 
                          target="_blank"
                          rel="noopener noreferrer"
                          color="inherit"
                          sx={{ 
                            color: "#E1306C",
                            "&:hover": { transform: "scale(1.1)" }
                          }}
                        >
                          <InstagramIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {host?.twitter && (
                      <Tooltip title={`@${host.twitter} on X`}>
                        <IconButton 
                          component="a" 
                          href={getSocialMediaUrl('twitter', host.twitter)} 
                          target="_blank"
                          rel="noopener noreferrer"
                          color="inherit"
                          sx={{ 
                            color: "#000000",
                            "&:hover": { transform: "scale(1.1)" }
                          }}
                        >
                          <TwitterIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {host?.linkedin && (
                      <Tooltip title="LinkedIn Profile">
                        <IconButton 
                          component="a" 
                          href={getSocialMediaUrl('linkedin', host.linkedin)} 
                          target="_blank"
                          rel="noopener noreferrer"
                          color="inherit"
                          sx={{ 
                            color: "#0077B5",
                            "&:hover": { transform: "scale(1.1)" }
                          }}
                        >
                          <LinkedInIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {!host?.instagram && !host?.twitter && !host?.linkedin && (
                      <Typography variant="body2" color="text.secondary">
                        No social media profiles added.
                      </Typography>
                    )}
                  </Box>
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
            {host.events && host.events.length > 0 ? (
              <Box
                sx={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                <List>
                  {host.events.map((event) => (
                    <ListItem key={event.id}>
                      <ListItemText
                        primary={event.title}
                        secondary={`Date: ${new Date(event.date).toLocaleDateString()} - Location: ${event.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography>No events hosted yet.</Typography>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Sponsored Events
            </Typography>
            {host.participatedAuctions &&
    host.participatedAuctions.filter(auction => {
      // Check if current user is the highest bidder
      if (auction.bids && auction.bids.length > 0) {
        // Sort bids by amount in descending order
        console.log(auction.bids)
        const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
        //console.log("S",sortedBids)
        // Get the highest bid
        const highestBid = sortedBids[0];
        console.log(highestBid.bidder)
        console.log("h",hostId)
        // Check if the current user is the highest bidder
        return highestBid.bidder === hostId; // Adjust this based on how user ID is stored in bid objects
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
        {host.participatedAuctions
          .filter(auction => {
            // Same filter logic as above
            if (auction.bids && auction.bids.length > 0) {
              const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
              const highestBid = sortedBids[0];
              console.log(highestBid.bidder)
              return highestBid.bidder === hostId;
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
                  Status: {auction.status} - Winning Bid: ₹
                  {auction.currentHighestBid}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    ) : (
      <Typography variant="body1">No events won yet.</Typography>
    
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePageHost;