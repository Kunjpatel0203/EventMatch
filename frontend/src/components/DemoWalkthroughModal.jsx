import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const DemoWalkthroughModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>EventHive Demo Walkthrough</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Step 1: Create Your Event
        </Typography>
        <Typography paragraph>
          Start by creating an event listing where you provide details like the title, date, and location of your event.
        </Typography>
        <Box sx={{ my: 2 }}>
          <img
            src="https://via.placeholder.com/400x200"
            alt="Step 1"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Step 2: Set Up Auctions
        </Typography>
        <Typography paragraph>
          Organize auctions for sponsorship slots to allow sponsors to place their bids.
        </Typography>
        <Box sx={{ my: 2 }}>
          <img
            src="https://via.placeholder.com/400x200"
            alt="Step 2"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Step 3: Connect with Sponsors
        </Typography>
        <Typography paragraph>
          Engage with sponsors who have placed bids and finalize the sponsorship agreements.
        </Typography>
        <Box sx={{ my: 2 }}>
          <img
            src="https://via.placeholder.com/400x200"
            alt="Step 3"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose} // Ensure this matches the prop name
          sx={{ bgcolor: 'red', color: 'white', '&:hover': { bgcolor: 'darkred' } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DemoWalkthroughModal;
