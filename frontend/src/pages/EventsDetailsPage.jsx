import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  Gavel,
  ArrowBack,
  Person,
  Image as ImageIcon,
  Collections,
} from "@mui/icons-material";
import AuctionImagesModal from "./AuctionImagesModal"; // Import the new component

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  // State for image modal
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [openImagesModal, setOpenImagesModal] = useState(false);

  const handleOpenImagesModal = (images, itemName) => {
    setSelectedImages(images);
    setSelectedItemName(itemName);
    setOpenImagesModal(true);
  };

  const handleCloseImagesModal = () => {
    setOpenImagesModal(false);
  };

  useEffect(() => {
    console.log("Fetched eventId:", eventId); // Debugging line
    if (!eventId) {
      setError("Invalid Event ID.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const eventResponse = await axios.get(
          `http://localhost:8080/api/events/${eventId}`
        );
        setEvent(eventResponse.data);

        const auctionPromises = eventResponse.data.auctions.map((auction) => {
          console.log(auction.id);
          return axios.get(`http://localhost:8080/api/auctions/${auction.id}`);
        });

        const auctionResponses = await Promise.all(auctionPromises);
        //console.log(auctionResponses);
        const auctionData = auctionResponses.map((res) => {
          console.log(res.data);
          return res.data;
        });
        setAuctions(auctionData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch event details. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error
          </Typography>
          <Typography>{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4, borderRadius: 2, px: 3 }}
        variant="outlined"
      >
        Back to Events
      </Button>
      
      {/* Hero section with shadow and gradient background */}
      <Paper 
        elevation={4} 
        sx={{ 
          p: 5, 
          mb: 5, 
          borderRadius: 3,
          backgroundImage: 'linear-gradient(to right bottom, #ffffff, #f8f9ff)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'primary.dark',
            mb: 2
          }}
        >
          {event.title}
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          paragraph
          sx={{ 
            fontSize: '1.1rem',
            maxWidth: '85%',
            mb: 4,
            lineHeight: 1.6
          }}
        >
          Description : {event.description}
        </Typography>
        
        {/* Event Info Section with Location on Right */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2
        }}>
          {/* First Row: Date and Location */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Date on Left */}
            <Box display="flex" alignItems="center">
              <CalendarToday sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography sx={{ fontWeight: 500 }}>
                {new Date(event.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
            
            {/* Location on Right */}
            <Box 
              display="flex" 
              alignItems="center"
              sx={{
                backgroundColor: 'primary.light',
                color: 'white',
                py: 1,
                px: 3,
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography sx={{ fontWeight: 500, mr: 1 }}>{event.location || "Virtual Event"}</Typography>
              <LocationOn />
            </Box>
          </Box>
          
          {/* Second Row: Profile on a new line */}
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
            sx={{
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              pt: 3
            }}
          >
            <Person sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Hosted by: {event.host.username}</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ 
                ml: 2, 
                borderRadius: 4,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => navigate(`/profile/${event.host.id}`)}
            >
              View Profile
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: 'primary.dark',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Benefits to Sponsors :
          </Typography>
          <Box 
            component="ul" 
            sx={{ 
              pl: 3,
              mt: 2,
              display: 'grid',
              gap: 2
            }}
          >
            {event.benefitsToSponsors.map((benefit, index) => (
              <Typography 
                component="li" 
                key={index}
                sx={{ 
                  mb: 1,
                  fontSize: '1rem',
                  position: 'relative',
                  pl: 1,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main'
                  }
                }}
              >
                {benefit}
              </Typography>
            ))}
          </Box>
        </Box>

        {event.pastEventsImages && event.pastEventsImages.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'primary.dark',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ImageIcon color="primary" /> Event Gallery
            </Typography>
            <Grid container spacing={2}>
              {event.pastEventsImages.map((imageUrl, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 3,
                      height: 220,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Event image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mt: 6, 
        mb: 4
      }}>
        <Gavel color="primary" sx={{ fontSize: 28 }} />
        <Typography
          variant="h4"
          component="h2"
          sx={{ 
            fontWeight: 700,
            color: 'primary.dark',
          }}
        >
          Available Auctions
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {auctions.map((auction) => (
          <Grid item xs={12} sm={6} md={4} key={auction.id}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {/* Image Gallery at the top */}
              {auction.images && auction.images.length > 0 && (
                <Box 
                  sx={{ 
                    position: 'relative', 
                    height: 200,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenImagesModal(auction.images, auction.itemName)}
                >
                  <img
                    src={auction.images[0]}
                    alt={auction.itemName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  
                  {/* Image count indicator */}
                  {auction.images.length > 1 && (
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        borderRadius: 6,
                        px: 1,
                        py: 0.5,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Collections fontSize="small" />
                      {auction.images.length} photos
                    </Box>
                  )}
                </Box>
              )}
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.dark'
                  }}
                >
                  {auction.itemName}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {auction.itemDescription}
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 2
                  }}
                >
                  <Chip
                    icon={<Gavel />}
                    label={`Starting bid: ₹${auction.startingBid}`}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 6,
                      px: 1,
                      fontWeight: 500
                    }}
                  />
                  
                  <Typography 
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary'
                    }}
                  >
                    Bid Increment: ₹{auction.bidIncrement}
                  </Typography>
                </Box>
                
                {/* Benefits Section */}
                {auction.benefits && auction.benefits.length > 0 && (
                  <Box 
                    sx={{ 
                      mt: 2,
                      p: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 2,
                      border: '1px dashed rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          display: 'inline-block',
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: 'primary.light',
                          color: 'white',
                          fontSize: '0.75rem',
                          textAlign: 'center',
                          lineHeight: '16px'
                        }}
                      >
                        ★
                      </Box>
                      Benefits
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                      {auction.benefits.map((benefit, index) => (
                        <Typography 
                          component="li" 
                          variant="body2" 
                          key={index}
                          sx={{
                            fontSize: '0.875rem',
                            mb: 0.5
                          }}
                        >
                          {benefit}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
              
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => navigate(`/events/${eventId}/auctions/${auction.id}`)}
                  fullWidth
                  sx={{
                    borderRadius: 6,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  Bid Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Image Modal */}
      <AuctionImagesModal 
        open={openImagesModal}
        handleClose={handleCloseImagesModal}
        images={selectedImages}
        itemName={selectedItemName}
      />
    </Container>
  );
};

export default EventDetailsPage;