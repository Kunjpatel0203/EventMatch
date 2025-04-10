import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box, 
  MobileStepper,
  Button
} from "@mui/material";
import { Close, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const AuctionImagesModal = ({ open, handleClose, images, itemName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            zIndex: 10
          }}
        >
          <Close />
        </IconButton>
        
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              height: { xs: 350, sm: 500 },
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black'
            }}
          >
            <img
              src={images[activeStep]}
              alt={`${itemName} - image ${activeStep + 1}`}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
          
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{ 
              backgroundColor: '#f5f5f5',
              '& .MuiMobileStepper-dot': {
                width: 10,
                height: 10,
                mx: 0.5
              },
              '& .MuiMobileStepper-dotActive': {
                backgroundColor: 'primary.main'
              }
            }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
                sx={{ fontWeight: 500 }}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ fontWeight: 500 }}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AuctionImagesModal;