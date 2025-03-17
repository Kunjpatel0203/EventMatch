import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.grey[900],
        color: "common.white",
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              EventMatch is revolutionizing the way event hosts connect with
              sponsors through our innovative auction-based platform.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link
                href="/events"
                color="inherit"
                display="block"
                sx={{ mb: 1 }}
              >
                Upcoming Events
              </Link>
              <Link
                href="/for-hosts"
                color="inherit"
                display="block"
                sx={{ mb: 1 }}
              >
                For Hosts
              </Link>
              <Link
                href="/for-sponsors"
                color="inherit"
                display="block"
                sx={{ mb: 1 }}
              >
                For Sponsors
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <LinkedInIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="inherit">
            &copy; {new Date().getFullYear()} EventMatch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
