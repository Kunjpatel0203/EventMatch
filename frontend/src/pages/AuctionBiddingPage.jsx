import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Typography,
  Container,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  Gavel,
  AccessTime,
  Payment,
  CheckCircle,
  LocalOffer,
} from "@mui/icons-material";

const AuctionStatus = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const AuctionBiddingPage = () => {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [auctionState, setAuctionState] = useState({
    status: AuctionStatus.UPCOMING,
    phase: {
      isUpcoming: true,
      isActive: false,
      isEnded: false,
    },
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const { eventId, auctionId } = useParams();
  const userId = localStorage.getItem("userId");

  // useEffect(() => {
  //   console.log("Auction state in effect:", auction);
  // }, [auction]);

  // const fetchPaymentStatus = useCallback(async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8080/api/payments/status/${auctionId}/${userId}`
  //     );
  //     setPaymentStatus(response.data.status);
  //   } catch (err) {
  //     console.error("Failed to fetch payment status:", err);
  //   }
  // }, [auctionId, userId]);

  const isEventHost = useMemo(() => {
    console.log("He", auction?.event);
    // console.log(userId);
    //console.log(isEventHost)
    return auction?.event?.host === userId;
  }, [userId, auction]);

  const calculateStatus = useCallback((auctionData) => {
    if (!auctionData) return AuctionStatus.UPCOMING;

    const now = new Date();
    const startTime = new Date(auctionData.auctionStartTime);
    const endTime = new Date(auctionData.auctionEndTime);

    if (now < startTime) {
      return AuctionStatus.UPCOMING;
    } else if (now >= startTime && now < endTime) {
      return AuctionStatus.ACTIVE;
    } else {
      return AuctionStatus.FINISHED;
    }
  }, []);

  const calculateTimeLeft = useCallback((auctionData) => {
    if (!auctionData) return "";

    const now = new Date();
    const startTime = new Date(auctionData.auctionStartTime);
    const endTime = new Date(auctionData.auctionEndTime);
    let targetTime;
    let prefix = "";

    if (now < startTime) {
      targetTime = startTime;
      prefix = "Starts in: ";
    } else if (now < endTime) {
      targetTime = endTime;
      prefix = "Ends in: ";
    } else {
      return "Auction Ended";
    }

    const difference = targetTime.getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${prefix}${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, []);

  const updateAuctionState = useCallback(
    (auctionData) => {
      if (!auctionData) return;

      const newStatus = calculateStatus(auctionData);
      setAuctionState({
        status: newStatus,
        phase: {
          isUpcoming: newStatus === AuctionStatus.UPCOMING,
          isActive: newStatus === AuctionStatus.ACTIVE,
          isEnded: newStatus === AuctionStatus.FINISHED,
        },
      });
    },
    [calculateStatus]
  );

  // const fetchAuction = useCallback(async () => {
  //   try {
  //     if (!eventId || !auctionId) {
  //       throw new Error("Missing eventId or auctionId");
  //     }
  //     const response = await axios.get(
  //       `http://localhost:8080/api/auctions/${eventId}/${auctionId}`
  //     );
  //     const auctionData = response.data;

  //     setAuction(auctionData);
  //     updateAuctionState(auctionData);

  //     const newStatus = calculateStatus(auctionData);
  //     if (newStatus === AuctionStatus.FINISHED && !showFinishedPopup) {
  //       //setShowFinishedPopup(true);
  //     }
  //   } catch (err) {
  //     setError(`Failed to fetch auction details: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [
  //   eventId,
  //   auctionId,
  //   updateAuctionState,
  //   calculateStatus,
  //   showFinishedPopup,
  // ]);

  const fetchAuctionDetails = useCallback(async () => {
    try {
      console.log("A", auctionId, "-", userId);
      const [auctionResponse, paymentResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/auctions/${eventId}/${auctionId}`),
        axios.get(
          `http://localhost:8080/api/payments/details/${auctionId}/${userId}`
        ),
      ]);

      setAuction(auctionResponse.data);
      setPaymentDetails(paymentResponse.data);

      // Update auction state
      const now = new Date();
      const startTime = new Date(auctionResponse.data.auctionStartTime);
      const endTime = new Date(auctionResponse.data.auctionEndTime);

      setAuctionState({
        status:
          now < startTime
            ? AuctionStatus.UPCOMING
            : now >= startTime && now < endTime
            ? AuctionStatus.ACTIVE
            : AuctionStatus.FINISHED,
        phase: {
          isUpcoming: now < startTime,
          isActive: now >= startTime && now < endTime,
          isEnded: now >= endTime,
        },
      });
    } catch (err) {
      setError(`Failed to fetch details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [eventId, auctionId, userId]);

  // Effect for periodic auction data refresh
  // useEffect(() => {
  //   fetchAuction();
  //   fetchPaymentStatus();
  //   const intervalId = setInterval(fetchAuction, 5000);
  //   return () => clearInterval(intervalId);
  // }, [fetchAuction, fetchPaymentStatus]);
  useEffect(() => {
    fetchAuctionDetails();
    const intervalId = setInterval(fetchAuctionDetails, 5000);
    return () => clearInterval(intervalId);
  }, [fetchAuctionDetails]);

  // Effect for updating time left
  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(auction));
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [auction, calculateTimeLeft]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setSnackbar({
        open: true,
        message: "Please log in to place a bid",
        severity: "error",
      });
      return;
    }

    if (isEventHost) {
      setSnackbar({
        open: true,
        message: "Event hosts cannot bid on their own auctions",
        severity: "error",
      });
      return;
    }

    const bidAmountNum = Number(bidAmount);
    if (!isBidValid(bidAmountNum)) {
      setSnackbar({
        open: true,
        message: `Bid must be at least ₹${
          auction.currentHighestBid + auction.bidIncrement
        }`,
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/api/auctions/${auctionId}/bid`,
        {
          amount: bidAmountNum,
          bidder: userId,
        }
      );
      setAuction(response.data);
      updateAuctionState(response.data);

      setBidAmount("");
      setSnackbar({
        open: true,
        message: "Bid placed successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      //console.log(err.response?.data?.message)
      const errorMessage =
        err.response?.data?.message || "Failed to place bid. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isBidValid = (amount) => {
    if (!auction || auctionState.phase.isEnded || auctionState.phase.isUpcoming)
      return false;
    const bidAmountNum = Number(amount);
    const minimumBid = getMinimumBidAmount();

    return (
      !isNaN(bidAmountNum) &&
      bidAmountNum >= minimumBid &&
      auctionState.status === AuctionStatus.ACTIVE
    );
  };

  const getHighestBidder = () => {
    if (!auction || !auction.bids || auction.bids.length === 0) return null;
    return auction.bids.reduce((prev, current) => {
      return prev.amount > current.amount ? prev : current;
    });
  };

  const winner = getHighestBidder();

  const isCurrentUserWinner = useMemo(() => {
    console.log("Winner ", winner);
    return winner && winner.bidder === userId;
  }, [winner, userId]);

  const getMinimumBidAmount = () => {
    if (!auction) return 0;
    if (!auction.bids || auction.bids.length === 0) {
      return auction.startingBid;
    }
    return auction.currentHighestBid + auction.bidIncrement;
  };

  const initiatePayment = async () => {
    if (!auction || !winner) {
      setSnackbar({
        open: true,
        message: "Unable to process payment. Please try again.",
        severity: "error",
      });
      return;
    }
  
    try {
      setLoading(true);
      const productRequest = {
        name: auction.itemName,
        amount: auction.currentHighestBid,
        quantity: 1,
        currency: "INR",
      };
  
      const response = await axios.post(
        `http://localhost:8080/api/payments/checkout`,
        productRequest,
        {
          params: {
            auctionId: auctionId,
            winnerId: userId,
          },
        }
      );
  
      // Redirect to Stripe checkout
      if (response.data && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        setSnackbar({
          open: true,
          message: "Payment initialization failed.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to initiate payment. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getHelperText = () => {
    if (!auction) return "Loading...";

    const minBid = getMinimumBidAmount();
    if (auctionState.phase.isUpcoming) {
      return `Auction starts on ${new Date(
        auction.auctionStartTime
      ).toLocaleString()}`;
    }

    if (auctionState.phase.isEnded) {
      return "Auction has ended";
    }

    if (!auction.bids || auction.bids.length === 0) {
      return `Starting bid: ₹${minBid.toLocaleString()}`;
    }
    return `Minimum bid: ₹${minBid.toLocaleString()}`;
  };

  const renderAuctionOutcome = () => {
    if (!auctionState.phase.isEnded) return null;

    // If current user is the winner
    if (isCurrentUserWinner) {
      // If payment is completed
      if (paymentDetails?.status === "SUCCEEDED") {
        return (
          <Card
            variant="outlined"
            sx={{
              mt: 3,
              bgcolor: "success.lightest",
              border: "2px solid",
              borderColor: "success.main",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle color="success" fontSize="large" />
                <Box>
                  <Typography variant="h5" color="success.main">
                    Payment Completed
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Chip
                  label={`Transaction ID: ${paymentDetails.transactionId}`}
                  variant="outlined"
                  color="success"
                />
                <Chip
                  label={`Paid: ₹${paymentDetails.amount.toLocaleString()}`}
                  icon={<LocalOffer />}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        );
      }

      // If payment is pending or not done
      return (
        <Paper
          elevation={3}
          sx={{
            mt: 3,
            p: 3,
            bgcolor: "primary.lightest",
            borderLeft: "4px solid",
            borderColor: "primary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" color="primary.main">
                Complete Your Payment
              </Typography>
              <Typography variant="body1">
                You won the auction for {auction.itemName}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Payment />}
              onClick={() => setShowPaymentModal(true)}
            >
              Pay Now
            </Button>
          </Box>
        </Paper>
      );
    }

    // If user is not the winner
    return (
      <Paper elevation={2} sx={{ mt: 3, p: 2, bgcolor: "grey.100" }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Auction Ended
        </Typography>
        <Typography variant="body1" align="center">
          Winner: {winner ? `Bidder ${winner.id}` : "No bids placed"}
        </Typography>
      </Paper>
    );
  };

  if (loading)
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

  if (error)
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

  if (!auction) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Event
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={8} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                {auction.itemName}
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                {auction.itemDescription}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Gavel fontSize="large" sx={{ color: "primary.main", mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: "medium" }}>
                  {auctionState.phase.isEnded ? "Final Bid:" : "Current Bid:"} ₹
                  {auction?.currentHighestBid !== undefined
                    ? auction.currentHighestBid.toLocaleString()
                    : "0"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AccessTime
                  fontSize="large"
                  sx={{ color: "primary.main", mr: 1 }}
                />
                <Typography
                  variant="h6"
                  color={auctionState.phase.isEnded ? "error" : "inherit"}
                >
                  {timeLeft}
                </Typography>
              </Box>

              {auctionState.phase.isEnded ? (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "success.light",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "success.contrastText", mb: 1 }}
                    >
                      {winner
                        ? `Auction Winner: ${winner.id}`
                        : "No Bids Placed"}
                    </Typography>
                    {winner && (
                      <Typography
                        variant="h6"
                        sx={{ color: "success.contrastText" }}
                      >
                        Winning Bid: ₹{winner.amount.toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  <Dialog
                    open={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    maxWidth="xs"
                    fullWidth
                  >
                    <DialogTitle>Confirm Payment</DialogTitle>
                    <DialogContent>
                      <Box sx={{ textAlign: "center", mb: 2 }}>
                        <Typography variant="h6">{auction.itemName}</Typography>
                        <Typography variant="body1" color="text.secondary">
                          Total Amount: ₹
                          {auction.currentHighestBid.toLocaleString()}
                        </Typography>
                      </Box>
                      <Alert severity="warning">
                        You will be redirected to Stripe to complete your
                        payment
                      </Alert>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setShowPaymentModal(false)}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={initiatePayment}
                        variant="contained"
                        color="primary"
                        startIcon={<Payment />}
                      >
                        Proceed to Payment
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              ) : (
                <Box
                  component="form"
                  onSubmit={handleBidSubmit}
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField
                    label={
                      !auction.bids || auction.bids.length === 0
                        ? "Enter Starting Bid"
                        : "Your Bid Amount"
                    }
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                    helperText={getHelperText()}
                    disabled={auctionState.phase.isUpcoming}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={
                      isEventHost ||
                      !isBidValid(bidAmount) ||
                      auctionState.phase.isUpcoming
                    }
                  >
                    {isEventHost
                      ? "Hosts Cannot Bid"
                      : auctionState.phase.isUpcoming
                      ? "Auction Not Started"
                      : "Place Bid"}
                  </Button>

                  
                </Box>
              )}
              
            <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Existing auction details grid */}
                    {renderAuctionOutcome()}
                  </motion.div>
            </Paper>


            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Bid History
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                <List>
                  {auction.bids && auction.bids.length > 0 ? (
                    auction.bids
                      .sort((a, b) => b.amount - a.amount)
                      .map((bid, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={`Bidder: ${bid.id}`}
                              secondary={`Bid Amount: ₹${bid.amount.toLocaleString()}`}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ p: 2, textAlign: "center" }}
                    >
                      No bids placed yet
                    </Typography>
                  )}
                </List>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Auction Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Event" secondary={auction.itemName} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Start Date"
                    secondary={new Date(
                      auction.auctionStartTime
                    ).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="End Date"
                    secondary={new Date(
                      auction.auctionEndTime
                    ).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Starting Bid"
                    secondary={`₹${auction.startingBid.toLocaleString()}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Minimum Increment"
                    secondary={`₹${auction.bidIncrement.toLocaleString()}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Status" secondary={auction.status} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <AnimatePresence>
        {showFinishedPopup && (
          <Dialog
            open={showFinishedPopup}
            onClose={() => setShowFinishedPopup(false)}
            aria-labelledby="auction-finished-dialog-title"
          >
            <DialogTitle id="auction-finished-dialog-title">
              Auction{" "}
              {auctionState.phase.isUpcoming ? "Not Started" : "Finished"}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {auctionState.phase.isUpcoming
                  ? `This auction will start at ${new Date(
                      auction.auctionStartTime
                    ).toLocaleString()}`
                  : `This auction has ended. ${
                      winner
                        ? `The winning bid was ₹${winner.amount.toLocaleString()}.`
                        : "No bids were placed."
                    }`}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowFinishedPopup(false)}
                color="primary"
              >
                Close
              </Button>
              {auctionState.phase.isUpcoming && (
                <Button
                  onClick={() => {
                    //setShowFinishedPopup(false);
                    // You could add a reminder feature here
                  }}
                  color="primary"
                  variant="contained"
                >
                  Remind Me When It Starts
                </Button>
              )}
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AuctionBiddingPage;