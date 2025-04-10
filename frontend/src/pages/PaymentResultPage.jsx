import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Paper 
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const PaymentResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        if (location.pathname === '/payment-success') {
          const searchParams = new URLSearchParams(location.search);
          const sessionId = searchParams.get('session_id');

          if (!sessionId) {
            throw new Error('No session ID found');
          }

          const response = await axios.post(
            `http://localhost:8080/api/payments/confirm-payment?sessionId=${sessionId}`
          );

          setStatus('success');
        } else if (location.pathname === '/payment-cancel') {
          setStatus('cancelled');
        }
      } catch (err) {
        console.error('Payment processing error:', err);
        setError(err.response?.data || 'Payment processing failed');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentResult();
  }, [location, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: 'success.lightest', 
              borderColor: 'success.main' 
            }}
          >
            <CheckCircle 
              color="success" 
              sx={{ fontSize: 100, mb: 2 }} 
            />
            <Typography variant="h4" color="success.main" gutterBottom>
              Payment Successful
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your payment has been processed successfully.
            </Typography>
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => navigate(-2)}
            >
              Back to Events
            </Button>
          </Paper>
        );
      case 'cancelled':
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: 'error.lightest', 
              borderColor: 'error.main' 
            }}
          >
            <Cancel 
              color="error" 
              sx={{ fontSize: 100, mb: 2 }} 
            />
            <Typography variant="h4" color="error.main" gutterBottom>
              Payment Cancelled
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You have cancelled the payment. You can retry the payment from the auction page.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/events')}
            >
              Back to Events
            </Button>
          </Paper>
        );
      case 'error':
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: 'error.lightest', 
              borderColor: 'error.main' 
            }}
          >
            <Cancel 
              color="error" 
              sx={{ fontSize: 100, mb: 2 }} 
            />
            <Typography variant="h4" color="error.main" gutterBottom>
              Payment Error
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {error || 'An error occurred during payment processing.'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/events')}
            >
              Back to Events
            </Button>
          </Paper>
        );
      default:
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
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {renderContent()}
    </Container>
  );
};

export default PaymentResultPage;