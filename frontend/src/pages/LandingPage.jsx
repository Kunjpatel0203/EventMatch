// import React, { useState } from 'react';
// import {
//   Typography, Button, Container, Grid, Card, CardContent, Box,
//   useTheme, useMediaQuery
// } from '@mui/material';
// import {
//   CalendarToday, Gavel, People, TrendingUp, EmojiEvents, Spa
// } from '@mui/icons-material';

// const FeatureCard = ({ icon, title, description }) => {
//   const theme = useTheme();
//   return (
//     <Card
//       elevation={3}
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius: theme.shape.borderRadius,
//         transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//         '&:hover': {
//           transform: 'translateY(-5px)',
//           boxShadow: theme.shadows[10],
//         },
//       }}
//     >
//       <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
//         <Box sx={{ mb: 2, color: theme.palette.primary.main }}>
//           {icon}
//         </Box>
//         <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
//           {title}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {description}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// const LandingPage = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleOpen = () => setModalOpen(true);
//   const handleClose = () => setModalOpen(false);

//   return (
//     <>
//       <Box sx={{
//         bgcolor: theme.palette.background.paper,
//         pt: 12,
//         pb: 6,
//         background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
//       }}>
//         <Container maxWidth="md">
//           <Typography
//             component="h1"
//             variant={isMobile ? "h4" : "h2"}
//             align="center"
//             color="common.white"
//             gutterBottom
//             sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
//           >
//             Revolutionize Event Sponsorships
//           </Typography>
//           <Typography
//             variant={isMobile ? "body1" : "h5"}
//             align="center"
//             color="common.white"
//             paragraph
//             sx={{ maxWidth: '800px', margin: 'auto', mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
//           >
//             EventHive brings event hosts and sponsors together through innovative auction-based sponsorships, creating perfect matches and maximizing value for all.
//           </Typography>
//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
//             <Button
//               variant="contained"
//               color="secondary"
//               size="large"
//               sx={{
//                 mx: 1,
//                 mb: 2,
//                 px: 4,
//                 py: 1.5,
//                 fontSize: '1.1rem',
//                 fontWeight: 'bold',
//                 boxShadow: theme.shadows[5],
//               }}
//             >
//               Get Started
//             </Button>
//             <Button
//               variant="outlined"
//               size="large"
//               sx={{
//                 mx: 1,
//                 mb: 2,
//                 px: 4,
//                 py: 1.5,
//                 fontSize: '1.1rem',
//                 fontWeight: 'bold',
//                 color: 'common.white',
//                 borderColor: 'common.white',
//                 '&:hover': {
//                   borderColor: 'common.white',
//                   backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                 },
//               }}
//               onClick={handleOpen}
//             >
//               Learn More
//             </Button>
//           </Box>
//         </Container>
//       </Box>

//       <Container sx={{ py: 8 }} maxWidth="lg" id="features">
//         <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
//           Key Features
//         </Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FeatureCard
//               icon={<CalendarToday fontSize="large" />}
//               title="Event Listings"
//               description="Create and manage your event listings with ease, showcasing your sponsorship opportunities to a wide audience."
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FeatureCard
//               icon={<Gavel fontSize="large" />}
//               title="Auction Platform"
//               description="Conduct transparent and competitive auctions for sponsorship slots, ensuring fair market value for your opportunities."
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FeatureCard
//               icon={<People fontSize="large" />}
//               title="Sponsor Matching"
//               description="Our intelligent algorithm connects you with the most suitable sponsors for your event's unique needs and target audience."
//             />
//           </Grid>
//         </Grid>
//       </Container>

//       <Box sx={{ bgcolor: 'background.paper', py: 8 }} id="hosts">
//         <Container maxWidth="md">
//           <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
//                 For Event Hosts
//               </Typography>
//               <Typography variant="body1" paragraph>
//                 Maximize your event's potential by connecting with the perfect sponsors through our innovative auction system.
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <TrendingUp color="primary" sx={{ mr: 1 }} />
//                   <Typography variant="body1">Increase sponsorship revenue</Typography>
//                 </Box>
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <People color="primary" sx={{ mr: 1 }} />
//                   <Typography variant="body1">Access a wide network of potential sponsors</Typography>
//                 </Box>
//                 <Box display="flex" alignItems="center">
//                   <Spa color="primary" sx={{ mr: 1 }} />
//                   <Typography variant="body1">Streamline the sponsorship process</Typography>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Box
//                 sx={{
//                   width: '100%',
//                   height: 300,
//                   borderRadius: 2,
//                   overflow: 'hidden',
//                   border: '1px solid #e0e0e0',
//                 }}
//               >
//                 <img
//                   src="https://img.freepik.com/free-vector/wedding-planner-concept-illustration_114360-2720.jpg?size=626&ext=jpg&ga=GA1.1.1170291314.1694801382&semt=ais_hybrid"
//                   alt="Event Management"
//                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       <Box sx={{ py: 8 }} id="sponsors">
//         <Container maxWidth="md">
//           <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Box
//                 sx={{
//                   width: '100%',
//                   height: 300,
//                   borderRadius: 2,
//                   overflow: 'hidden',
//                   border: '1px solid #e0e0e0',
//                 }}
//               >
//                 <img
//                   src="https://img.freepik.com/free-vector/flat-business-deal-concept_23-2148123416.jpg?ga=GA1.1.1170291314.1694801382&semt=ais_hybrid"
//                   alt="Sponsors"
//                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
//                 For Sponsors
//               </Typography>
//               <Typography variant="body1" paragraph>
//                 Discover and secure high-value sponsorship opportunities through our platform and gain visibility for your brand.
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <TrendingUp color="primary" sx={{ mr: 1 }} />
//                   <Typography variant="body1">Enhance your brand's visibility</Typography>
//                 </Box>
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <People color="primary" sx={{ mr: 1 }} />
//                   <Typography variant="body1">Engage with diverse events</Typography>
//                 </Box>
//                 <Box display="flex" alignItems="center">
//                   <Spa color="primary" sx={{ mr: 1 }} />
//                   <Typography variant="body1">Streamlined bidding process</Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default LandingPage;



import { useState } from 'react';
import {
  Typography, Button, Container, Grid, Card, CardContent, Box,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  CalendarToday, Gavel, People, TrendingUp, EmojiEvents, Spa
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DemoWalkthroughModal from "../components/DemoWalkthroughModal";
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.shape.borderRadius,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
        <Box sx={{ mb: 2, color: theme.palette.primary.main }}>
          {icon}
        </Box>
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleGetStarted = () => {
    toast.success('Welcome! Please explore our features and get started.');
  };

  return (
    <>
     <Box sx={{
        bgcolor: theme.palette.background.paper,
        pt: 12,
        pb: 6,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
      }}>


        <Container maxWidth="md">
          <Typography
            component="h1"
            variant={isMobile ? "h4" : "h2"}
            align="center"
            color="common.white"
            gutterBottom
            sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Revolutionize Event Sponsorships
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            align="center"
            color="common.white"
            paragraph
            sx={{ maxWidth: '800px', margin: 'auto', mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            EventMatch brings event hosts and sponsors together through innovative auction-based sponsorships, creating perfect matches and maximizing value for all.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  mx: 1,
                  mb: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[5],
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Link>
            <Button
              variant="outlined"
              size="large"
              sx={{
                mx: 1,
                mb: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'common.white',
                borderColor: 'common.white',
                '&:hover': {
                  borderColor: 'common.white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={handleOpen}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="lg" id="features">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<CalendarToday fontSize="large" />}
              title="Event Listings"
              description="Create and manage your event listings with ease, showcasing your sponsorship opportunities to a wide audience."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<Gavel fontSize="large" />}
              title="Auction Platform"
              description="Conduct transparent and competitive auctions for sponsorship slots, ensuring fair market value for your opportunities."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<People fontSize="large" />}
              title="Sponsor Matching"
              description="Our intelligent algorithm connects you with the most suitable sponsors for your event's unique needs and target audience."
            />
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }} id="hosts">
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                For Event Hosts
              </Typography>
              <Typography variant="body1" paragraph>
                Maximize your event's potential by connecting with the perfect sponsors through our innovative auction system.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Increase sponsorship revenue</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Access a wide network of potential sponsors</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Spa color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Streamline the sponsorship process</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                }}
              >
                <img
                  src="https://img.freepik.com/free-vector/wedding-planner-concept-illustration_114360-2720.jpg"
                  alt="Event Management"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8 }} id="sponsors">
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                }}
              >
                <img
                  src="https://img.freepik.com/free-vector/flat-business-deal-concept_23-2148123416.jpg"
                  alt="Sponsors"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                For Sponsors
              </Typography>
              <Typography variant="body1" paragraph>
                Discover and secure high-value sponsorship opportunities through our platform and gain visibility for your brand.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Enhance your brand's visibility</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmojiEvents color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Build successful sponsorship campaigns</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Spa color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Gain access to unique events</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

 <DemoWalkthroughModal open={modalOpen} handleClose={handleClose} />
     

      <ToastContainer />
    </>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default LandingPage;