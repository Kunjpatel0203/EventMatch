// import { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   IconButton,
//   Avatar,
//   useMediaQuery,
//   useTheme,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import GavelIcon from "@mui/icons-material/Gavel";

// export default function Header() {
//   const [profile, setProfile] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     //setIsAdmin(false); // Assuming setIsAdmin is defined globally or passed as a prop
//     navigate("/auth");
//   };

//   useEffect(() => {
//     const imagep = localStorage.getItem("profileImage");
//     setProfile(imagep);

//     const intId = setInterval(() => {
//       const updatedImage = localStorage.getItem("profileImage");
//       setProfile(updatedImage);
//     }, 1000);

//     return () => clearInterval(intId);
//   }, []);

//   const toggleDrawer = (open) => () => {
//     setDrawerOpen(open);
//   };

//   const renderAdminNav = () => (
//     <Button
//       variant="outlined"
//       color="primary"
//       sx={{ my: 1, mx: 1.5 }}
//       onClick={handleLogout}
//     >
//       Logout
//     </Button>
//   );

//   const renderUserNav = () => (
//     <>
//       <Link to="/events" style={{ textDecoration: "none" }}>
//   <Button sx={{ color: "black", my: 1, mx: 1.5 }}>
//     Sponsor Events
//   </Button>
// </Link>
// <Link to="/create-event" style={{ textDecoration: "none" }}>
//   <Button sx={{ color: "black", my: 1, mx: 1.5 }}>
//     Create Events
//   </Button>
// </Link>
// <Link to="/sponsors" style={{ textDecoration: "none" }}>
//   <Button sx={{ color: "black", my: 1, mx: 1.5 }}>
//     Sponsors List
//   </Button>
// </Link>

//     </>
//   );

//   const renderProfileButton = () => (
//     <Link to="/profile" style={{ textDecoration: "none" }}>
//       <IconButton sx={{ ml: 1 }}>
//         <Avatar src={profile || undefined} alt="User Profile">
//           {profile ? null : "U"} {/* Fallback to 'U' if no profile image */}
//         </Avatar>
//       </IconButton>
//     </Link>
//   );

//   return (
//     <>
//       <AppBar
//         position="static"
//         color="transparent"
//         elevation={0}
//         sx={{ borderBottom: "1px solid #e0e0e0" }}
//       >
//         <Toolbar>
//           <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
//             <Box display="flex" alignItems="center">
//               <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//                 <GavelIcon sx={{ mr: 1, color: "primary.main" }} />
//                 <Typography
//                   variant="h5"
//                   component="span"
//                   sx={{ fontWeight: "bold" }}
//                 >
//                   EventMatch
//                 </Typography>
//               </Link>
//             </Box>
//           </Typography>
//           {isMobile ? (
//             <>
//               <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
//                 <GavelIcon />
//               </IconButton>
//               <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
//                 <List sx={{ width: 250 }}>
//                   <Link to="/auth" style={{ textDecoration: "none" }}>
//                     <ListItem button>
//                       <ListItemText primary="Login / Register" />
//                     </ListItem>
//                   </Link>
//                   {renderUserNav()}
//                   {renderProfileButton()}
//                 </List>
//               </Drawer>
//             </>
//           ) : (
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//              {renderUserNav()}
//              <Link to="/" style={{ textDecoration: "none" }}>
//                   <Button variant="outlined" color="primary" sx={{ my: 1, mx: 1.5 }}>
//                     Profile
//                   </Button>
//                 </Link>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GavelIcon from "@mui/icons-material/Gavel";


export default function Header() {
  const [profile, setProfile] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleLogout = () => {
    //setIsAdmin(false); // Assuming setIsAdmin is defined globally or passed as a prop
    navigate("/auth");
  };

  useEffect(() => {
    const imagep = localStorage.getItem("profileImage");
    setProfile(imagep);

    const intId = setInterval(() => {
      const updatedImage = localStorage.getItem("profileImage");
      setProfile(updatedImage);
    }, 1000);

    return () => clearInterval(intId);
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const renderAdminNav = () => (
    <Button
      variant="outlined"
      color="primary"
      sx={{ my: 1, mx: 1.5 }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );

  const renderUserNav = () => (
    <>
      <Link to="/events" style={{ textDecoration: "none" }}>
  <Button sx={{ color: "black", my: 1, mx: 1.5 }}>
    Sponsor Events
  </Button>
</Link>
<Link to="/create-event" style={{ textDecoration: "none" }}>
  <Button sx={{ color: "black", my: 1, mx: 1.5 }}>
    Create Events
  </Button>
</Link>
<Link to="/sponsors" style={{ textDecoration: "none" }}>
  <Button sx={{ color: "black", my: 1, mx: 1.5 }}>
    Sponsors List
  </Button>
</Link>

    </>
  );

  const renderProfileButton = () => (
    <Link to="/profile" style={{ textDecoration: "none" }}>
      <IconButton sx={{ ml: 1 }}>
        <Avatar src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg" alt="User Profile">
          {profile ? null : "U"} {/* Fallback to 'U' if no profile image */}
        </Avatar>
      </IconButton>
    </Link>
  );

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Box display="flex" alignItems="center">
              <Link to="/Landing" style={{ textDecoration: "none", color: "inherit" }}>
                <GavelIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography
                  variant="h5"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  EventMatch
                </Typography>
              </Link>
            </Box>
          </Typography>
          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
                <GavelIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List sx={{ width: 250 }}>
                  <Link to="/auth" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText primary="Login / Register" />
                    </ListItem>
                  </Link>
                  {renderUserNav()}
                  {renderProfileButton()}
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
             {renderUserNav()}
             <Link to="/profile" style={{ textDecoration: "none" }}>
                  <Button variant="outlined" color="primary" sx={{ my: 1, mx: 1.5 }}>
                    Profile
                  </Button>
                </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}