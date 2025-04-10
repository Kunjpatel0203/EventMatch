import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import { CalendarToday, LocationOn, Gavel } from "@mui/icons-material";

const EventCard = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-full h-full"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
        <Paper
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
            >
              {event.title}
            </Typography>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                {event.description}
              </Typography>
            </motion.div>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarToday
                sx={{ fontSize: "small", mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {new Date(event.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOn
                sx={{ fontSize: "small", mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {event.location || "Virtual Event"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ px: 2, pb: 2 }}>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      px: 2,
                      py: 1,
                      borderRadius: "full",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <Gavel sx={{ fontSize: "small", mr: 1 }} />
                    <Typography variant="body2">
                      {/* {event.auctions.length} Auction{event.auctions.length !== 1 ? 's' : ''} */}
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </Link>
    </motion.div>
  );
};

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        //const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/events");
        setEvents(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const ongoingEvents = events.filter((event) =>
    event.auctions.some((auction) => auction.status === "ACTIVE")
  );

  const upcomingEvents = events.filter((event) =>
    event.auctions.some((auction) => auction.status === "UPCOMING")
  );

  const finishedEvents = events.filter((event) =>
    event.auctions.every((auction) => auction.status === "FINISHED")
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", mb: 8, color: "text.primary" }}
      >
        Sponsorship Opportunities
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}
          >
            Ongoing Events
          </Typography>
        </Grid>
        {ongoingEvents.length > 0 ? (
          ongoingEvents.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard event={event} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: "text.secondary" }}
            >
              No ongoing events to display.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Upcoming Events */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Upcoming Events
          </Typography>
        </Grid>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard event={event} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" sx={{ color: "text.secondary" }}>
              No upcoming events to display.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}
          >
            Finished Events
          </Typography>
        </Grid>
        {finishedEvents.length > 0 ? (
          finishedEvents.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard event={event} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: "text.secondary" }}
            >
              No finished events to display.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    location: PropTypes.string,
    auctions: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default EventListing;
