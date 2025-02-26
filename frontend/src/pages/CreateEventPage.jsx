import { useState , useCallback } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  AccessTime,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dyqysb0ow/image/upload";
const UPLOAD_PRESET = "event_match";

const CreateEventPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    eventType: "IN_PERSON",
    location: "",
    date: "",
    benefitsToSponsors: [],
    pastEventsImages: [], // Added to store uploaded image URLs
  });
  const [auctions, setAuctions] = useState([
    {
      itemName: "",
      itemDescription: "",
      startingBid: "",
      bidIncrement: "",
      auctionDate: "",
      auctionTime: "",
      duration: "",
    },
  ]);

  const steps = ["Event Details", "Auction Details"];
  const navigate = useNavigate();

  // Drag-and-drop image handling
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (images.length + acceptedFiles.length > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    },
    [images]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: true,
    maxFiles: 5,
  });

  const validateFirstPage = () => {
    const errors = {};

    if (!eventData.title.trim()) {
      errors.title = "Event name is required";
    }

    if (!eventData.description.trim()) {
      errors.description = "Event description is required";
    }

    if (eventData.eventType === "in-person" && !eventData.location.trim()) {
      errors.location = "Location is required for in-person events";
    }

    if (!eventData.date) {
      errors.date = "Event date is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Benefits handlers
  const handleAddBenefit = () => {
    setEventData((prev) => ({
      ...prev,
      benefitsToSponsors: [...prev.benefitsToSponsors, ""],
    }));
  };

  const handleBenefitChange = (index, e) => {
    const updatedBenefits = [...eventData.benefitsToSponsors];
    updatedBenefits[index] = e.target.value;
    setEventData((prev) => ({ ...prev, benefitsToSponsors: updatedBenefits }));
  };

  const handleRemoveBenefit = (index) => {
    setEventData((prev) => ({
      ...prev,
      benefitsToSponsors: prev.benefitsToSponsors.filter((_, i) => i !== index),
    }));
  };

  // Image upload handler
  const handleImageUpload = async () => {
    if (images.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    setUploading(true);
    const uploadedImageUrls = [];

    try {
      for (let image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData);
        uploadedImageUrls.push(response.data.secure_url);
      }

      setEventData((prev) => ({
        ...prev,
        pastEventsImages: [...prev.pastEventsImages, ...uploadedImageUrls],
      }));
      setImages([]); // Clear the images array after successful upload
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload some images.");
    } finally {
      setUploading(false);
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being changed
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const isValidDateTime = (date, time) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const [hours, minutes] = time.split(":");
    selectedDate.setHours(hours, minutes, 0);

    return selectedDate > today;
  };

  const handleAuctionChange = (index, e) => {
    const { name, value } = e.target;
    // const updatedAuctions = auctions.map((auction, i) =>
    //   i === index ? { ...auction, [name]: value } : auction
    // );

    const updatedAuctions = auctions.map((auction, i) => {
      if (i === index) {
        const updatedAuction = { ...auction, [name]: value };

        // Validate time if date is today
        if (name === "auctionTime" && auction.auctionDate) {
          const today = getCurrentDate();
          if (auction.auctionDate === today && !isValidDateTime(today, value)) {
            alert("Please select a future time for today's auctions");
            return auction;
          }
        }

        return updatedAuction;
      }
      return auction;
    });
    setAuctions(updatedAuctions);
  };

  const handleAddAuction = () => {
    setAuctions([
      ...auctions,
      {
        itemName: "",
        itemDescription: "",
        startingBid: "",
        bidIncrement: "",
        auctionDate: "",
        auctionTime: "",
        duration: "",
      },
    ]);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const isValid = validateFirstPage();
      if (isValid) {
        setActiveStep(1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRemoveAuction = (index) => {
    setAuctions(auctions.filter((_, i) => i !== index));
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to create an event.");
      return;
    }

    const formData = new FormData();

    Object.keys(eventData).forEach((key) => {
      if (key === "date") {
        const dateWithTimezone = new Date(eventData[key]).toISOString(); // this includes the 'Z' time zone
        formData.append(key, dateWithTimezone);
      } else if (key === "benefitsToSponsors") {
        formData.append(
          "benefitsToSponsors",
          JSON.stringify(eventData.benefitsToSponsors)
        );
      } else if (key === "pastEventsImages") {
        formData.append(
          "pastEventsImages",
          JSON.stringify(eventData.pastEventsImages)
        );
      } else {
        formData.append(key, eventData[key]);
      }
    });

    // Append user ID as the event host
    formData.append("host", userId);

    // Format auctions and append them
    const formattedAuctions = auctions.map((auction) => ({
      itemName: auction.itemName,
      itemDescription: auction.itemDescription,
      startingBid: parseFloat(auction.startingBid),
      bidIncrement: parseFloat(auction.bidIncrement),
      auctionDate: auction.auctionDate,
      auctionTime: auction.auctionTime,
      duration: parseInt(auction.duration),
      status: "UPCOMING",
    }));

    formData.append("auctions", JSON.stringify(formattedAuctions));
    function formDataToJson(formData) {
      const jsonObj = {};
      formData.forEach((value, key) => {
        // If value is a JSON string, parse it
        if (value && (value.startsWith("{") || value.startsWith("["))) {
          try {
            jsonObj[key] = JSON.parse(value);
          } catch (e) {
            console.log(e);
            jsonObj[key] = value; // if parsing fails, store the value as a string
          }
        } else {
          jsonObj[key] = value;
        }
      });
      return jsonObj;
    }
    const jsooData = formDataToJson(formData);
    console.log(jsooData);
    try {
      console.log();
      const response = await axios.post(
        "http://localhost:8080/api/events/createEvent",
        jsooData,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //console.log(formData);
      console.log("Event created successfully:", response.data);
      navigate("/events");
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Failed to create event. Please check the console for more details."
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        Create Your Event
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  name="title"
                  variant="outlined"
                  value={eventData.title}
                  onChange={handleEventChange}
                  required
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Description"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={eventData.description}
                  onChange={handleEventChange}
                  required
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Event Type</FormLabel>
                  <RadioGroup
                    row
                    name="eventType"
                    value={eventData.eventType}
                    onChange={handleEventChange}
                  >
                    <FormControlLabel
                      value="IN_PERSON"
                      control={<Radio />}
                      label="In-person"
                    />
                    <FormControlLabel
                      value="virtual"
                      control={<Radio />}
                      label="Virtual"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {eventData.eventType === "IN_PERSON" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Location"
                    name="location"
                    variant="outlined"
                    value={eventData.location}
                    onChange={handleEventChange}
                    required
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Date"
                  name="date"
                  type="date"
                  value={eventData.date}
                  onChange={handleEventChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: getCurrentDate(),
                  }}
                  required
                  error={!!formErrors.date}
                  helperText={formErrors.date}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Benefits to Sponsors</Typography>
                {eventData.benefitsToSponsors.map((benefit, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mt={1}
                  >
                    <TextField
                      fullWidth
                      label={`Benefit ${index + 1}`}
                      variant="outlined"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e)}
                    />
                    <IconButton
                      onClick={() => handleRemoveBenefit(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddBenefit}
                  sx={{ mt: 2 }}
                >
                  Add Benefit
                </Button>
                {/* Drag & Drop Image Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="h6">Upload Images (Max 5)</Typography>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed gray",
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography>
                      Drag & Drop images here, or click to select
                    </Typography>
                  </Box>

                  {/* Image Preview */}
                  <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                    {images.map((file, index) => (
                      <Box key={index} position="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          width={100}
                          height={100}
                          style={{ borderRadius: 8 }}
                        />
                        <IconButton
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
                          }
                          color="error"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    onClick={handleImageUpload}
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Images"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <>
              {auctions.map((auction, index) => (
                <Grid container spacing={3} key={index} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Event Auction{index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label=" Event Auction Name"
                      name="itemName"
                      variant="outlined"
                      value={auction.itemName}
                      onChange={(e) => handleAuctionChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Event Description"
                      name="itemDescription"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={auction.itemDescription}
                      onChange={(e) => handleAuctionChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Starting Bid"
                      name="startingBid"
                      variant="outlined"
                      type="number"
                      value={auction.startingBid}
                      onChange={(e) => handleAuctionChange(index, e)}
                      InputProps={{
                        // startAdornment: <AttachMoney />,
                        // Indian Rupee symbol
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bid Increment"
                      name="bidIncrement"
                      variant="outlined"
                      type="number"
                      value={auction.bidIncrement}
                      onChange={(e) => handleAuctionChange(index, e)}
                      InputProps={{
                        // Indian Rupee symbol
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Auction Date"
                      name="auctionDate"
                      type="date"
                      value={auction.auctionDate}
                      onChange={(e) => handleAuctionChange(index, e)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: getCurrentDate(),
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Auction Time"
                      name="auctionTime"
                      type="time"
                      value={auction.auctionTime}
                      onChange={(e) => handleAuctionChange(index, e)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min:
                          auction.auctionDate === getCurrentDate()
                            ? getCurrentTime()
                            : undefined,
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Auction Duration (minutes)"
                      name="duration"
                      variant="outlined"
                      type="number"
                      value={auction.duration}
                      onChange={(e) => handleAuctionChange(index, e)}
                      InputProps={{
                        startAdornment: <AccessTime />,
                      }}
                      required
                    />
                  </Grid>
                  {auctions.length > 1 && (
                    <Grid item xs={12}>
                      <IconButton
                        onClick={() => handleRemoveAuction(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddAuction}
                sx={{ mt: 2 }}
              >
                Add Another Auction Item
              </Button>
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ChevronLeft />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              type={activeStep === steps.length - 1 ? "submit" : "button"}
              onClick={activeStep === steps.length - 1 ? undefined : handleNext}
              endIcon={
                activeStep === steps.length - 1 ? null : <ChevronRight />
              }
            >
              {activeStep === steps.length - 1 ? "Create Event" : "Next"}
            </Button>
          </Box>
        </Paper>
      </form>
    </Container>
  );
};

export default CreateEventPage;
