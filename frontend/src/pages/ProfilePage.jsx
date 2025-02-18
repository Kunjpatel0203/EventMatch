// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import {
// //   Container, Typography, Box, Avatar, Button, Paper, Divider
// // } from '@mui/material';
// // import { Logout as LogoutIcon } from '@mui/icons-material';
// // import { useNavigate } from 'react-router-dom';

// // export default function ProfilePage() {
// //   const [userDetails, setUserDetails] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();
// //   const userId = localStorage.getItem("userId");  // Get user ID from localStorage

// //   useEffect(() => {
// //     const fetchUserDetails = async () => {
// //       try {
// //         if (!userId) {
// //           console.error("No user ID found. Redirecting to login...");
// //           navigate('/login');
// //           return;
// //         }

// //         const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        
// //         if (response.status === 200) {
// //           setUserDetails(response.data);  // Update state dynamically
// //         } else {
// //           console.error("Failed to fetch user details:", response.statusText);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching user details:", error);
// //       } finally {
// //         setLoading(false);  // Stop loading indicator
// //       }
// //     };

// //     fetchUserDetails();
// //   }, [userId, navigate]);  // Re-run when userId changes

// //   const handleLogout = () => {
// //     localStorage.removeItem("userId");  // Clear user ID
// //     navigate('/login');
// //   };

// //   return (
// //     <Container maxWidth="sm">
// //       <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
// //         {loading ? (
// //           <Typography variant="h6" align="center">Loading...</Typography>
// //         ) : (
// //           <>
// //             <Box display="flex" alignItems="center" flexDirection="column">
// //               <Avatar
// //                 src={userDetails?.profileImage || "https://via.placeholder.com/120"}
// //                 alt={userDetails?.name || "User"}
// //                 sx={{ width: 120, height: 120, mb: 2 }}
// //               />
// //               <Typography variant="h5" fontWeight="bold">
// //                 {userDetails?.username || "User"}
// //               </Typography>
// //               <Typography variant="subtitle1" color="text.secondary">
// //                 {userDetails?.email || "Email not found"}
// //               </Typography>
// //             </Box>

// //             <Divider sx={{ my: 3 }} />

// //             <Box display="flex" justifyContent="center">
// //               <Button
// //                 variant="outlined"
// //                 color="error"
// //                 startIcon={<LogoutIcon />}
// //                 onClick={handleLogout}
// //               >
// //                 Logout
// //               </Button>
// //             </Box>
// //           </>
// //         )}
// //       </Paper>
// //     </Container>
// //   );
// // }





// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";


// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     console.log("Stored userId from localStorage:", storedUserId); // Debugging

//     if (!storedUserId) {
//       console.warn("No userId found! Redirecting to login...");
//       navigate("/");
//       return;
//     }

//     fetchUserDetails(storedUserId);
//   }, []);

//   const fetchUserDetails = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/user/${userId}`
//       );
//       console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
//       console.log("Fetched User Details:", response.data); // Debugging
//       if (response.status === 200) {
//         setUser(response.data); // Set user state with API response
//       } else {
//         console.error("Failed to fetch user details:", response.statusText);
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       navigate("/");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h1>Profile Page</h1>
//       {user ? (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Welcome, {user.username}!</h2>
//           <p>Email: {user.email}</p>
          
          
          
          
//           <button
//             onClick={() => {
//               localStorage.removeItem("userId");
//               navigate("/");
//             }}
//           >
//             Logout
//           </button>



//         </div>
//       ) : (
//         <p>Loading user details...</p>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;








// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// //import {ReactComponent as LogoutIcon} from './assets/logout_icon.svg';

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     console.log("Stored userId from localStorage:", storedUserId); // Debugging

//     if (!storedUserId) {
//       console.warn("No userId found! Redirecting to login...");
//       navigate("/");
//       return;
//     }

//     fetchUserDetails(storedUserId);
//   }, []);

//   const fetchUserDetails = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/user/${userId}`
//       );
//       console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
//       console.log("Fetched User Details:", response.data); // Debugging
//       if (response.status === 200) {
//         setUser(response.data); // Set user state with API response
//       } else {
//         console.error("Failed to fetch user details:", response.statusText);
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       navigate("/");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.profileCard}>
//         {/* Profile Header */}
//         <div style={styles.profileHeader}>
//           <div style={styles.avatarContainer}>
//             <img
//               src="https://img.icons8.com/ios/100/000000/user-male-circle.png"
//               alt="Avatar"
//               style={styles.avatar}
//             />
//           </div>
//           <h2 style={styles.username}>{user?.username || "Loading..."}</h2>
//           <p style={styles.email}>{user?.email || ""}</p>
//         </div>

//         {/* Navigation Tabs */}
//         <div style={styles.navTabs}>
//           <button style={styles.navButton}>PROFILE</button>
//           <button style={styles.navButton}>HOSTED EVENTS</button>
//           <button style={styles.navButton}>SPONSORED EVENTS</button>
//         </div>

//         {/* User Information */}
//         <div style={styles.userInfo}>
//           <h3>User Information</h3>
//           <div style={styles.infoRow}>
//             <img
//               src="https://img.icons8.com/material-outlined/24/000000/mail.png"
//               alt="Email"
//               style={styles.icon}
//             />
//             <p>{user?.email || "Loading..."}</p>
//           </div>
//           <div style={styles.infoRow}>
//             <img
//               src="https://img.icons8.com/material-outlined/24/000000/phone.png"
//               alt="Phone"
//               style={styles.icon}
//             />
//             <p>Not provided</p>
//           </div>
//         </div>

//         {/* Logout Button */}
//         <button onClick={() => {localStorage.removeItem("userId"); navigate("/");}} style={styles.logoutButton}>
//         <span style={{ marginRight: '5px' }}>🚪</span>
//           LOGOUT
//         </button>
//       </div>
//     </div>
//   );
// };

// // Styles (consider moving these to a separate CSS file)
// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//   },
//   profileCard: {
//     width: "80%",
//     maxWidth: "600px", // Adjust as needed
//     backgroundColor: "#fff",
//     borderRadius: "8px",
//     boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//     padding: "20px",
//   },
//   profileHeader: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
//   avatarContainer: {
//     width: "100px",
//     height: "100px",
//     borderRadius: "50%",
//     backgroundColor: "#eee",
//     margin: "0 auto 10px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   avatar: {
//     width: "60px",
//     height: "60px",
//   },
//   username: {
//     fontSize: "1.5em",
//     fontWeight: "bold",
//     marginBottom: "5px",
//   },
//   email: {
//     color: "#777",
//   },
//   navTabs: {
//     display: "flex",
//     justifyContent: "space-around",
//     marginBottom: "20px",
//     borderBottom: "1px solid #ccc",
//   },
//   navButton: {
//     background: "none",
//     border: "none",
//     padding: "10px 20px",
//     cursor: "pointer",
//     fontSize: "1em",
//     color: "#555",
//     fontWeight: "bold",
//   },
//   userInfo: {
//     marginBottom: "20px",
//   },
//   infoRow: {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   icon: {
//     marginRight: "10px",
//     width: "20px",
//     height: "20px",
//   },
//   logoutButton: {
//     backgroundColor: "#f44336",
//     color: "white",
//     border: "none",
//     padding: "10px 20px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     fontWeight: 'bold',
//     fontSize: '1rem'
//   },
// };

// export default ProfilePage;





// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styled from "styled-components";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState("PROFILE");
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (!storedUserId) {
//       console.warn("No userId found! Redirecting to login...");
//       navigate("/");
//       return;
//     }

//     fetchUserDetails(storedUserId);
//   }, [navigate]);

//   const fetchUserDetails = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/user/${userId}`
//       );
//       if (response.status === 200) {
//         setUser(response.data);
//       } else {
//         console.error("Failed to fetch user details:", response.statusText);
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       navigate("/");
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <Container>
//       <ProfileCard>
//         {/* Profile Header */}
//         <ProfileHeader>
//           <AvatarContainer>
//             <img
//               src="https://img.icons8.com/ios/100/000000/user-male-circle.png"
//               alt="Avatar"
//               style={{ width: "60px", height: "60px" }}
//             />
//           </AvatarContainer>
//           <Username>{user?.username || "Loading..."}</Username>
//           <Email>{user?.email || ""}</Email>
//         </ProfileHeader>

//         {/* Navigation Tabs */}
//         <NavTabs>
//           <NavButton
//             active={activeTab === "PROFILE"}
//             onClick={() => handleTabClick("PROFILE")}
//           >
//             PROFILE
//           </NavButton>
//           <NavButton
//             active={activeTab === "HOSTED EVENTS"}
//             onClick={() => handleTabClick("HOSTED EVENTS")}
//           >
//             HOSTED EVENTS
//           </NavButton>
//           <NavButton
//             active={activeTab === "SPONSORED EVENTS"}
//             onClick={() => handleTabClick("SPONSORED EVENTS")}
//           >
//             SPONSORED EVENTS
//           </NavButton>
//           <Slider activeTab={activeTab} />
//         </NavTabs>

//         {/* User Information (Conditionally Rendered) */}
//         {activeTab === "PROFILE" && (
//           <UserInfo>
//             <h3>User Information</h3>
//             <InfoRow>
//               <img
//                 src="https://img.icons8.com/material-outlined/24/000000/mail.png"
//                 alt="Email"
//                 style={{ marginRight: "10px", width: "20px", height: "20px" }}
//               />
//               <p>{user?.email || "Loading..."}</p>
//             </InfoRow>
//             <InfoRow>
//               <img
//                 src="https://img.icons8.com/material-outlined/24/000000/phone.png"
//                 alt="Phone"
//                 style={{ marginRight: "10px", width: "20px", height: "20px" }}
//               />
//               <p>Not provided</p>
//             </InfoRow>
//           </UserInfo>
//         )}

//         {/* Hosted Events Content (Conditionally Rendered) */}
//         {activeTab === "HOSTED EVENTS" && (
//           <UserInfo>
//             <h3>Hosted Events</h3>
//             <p>Content for Hosted Events goes here.</p>
//           </UserInfo>
//         )}

//         {/* Sponsored Events Content (Conditionally Rendered) */}
//         {activeTab === "SPONSORED EVENTS" && (
//           <UserInfo>
//             <h3>Sponsored Events</h3>
//             <p>Content for Sponsored Events goes here.</p>
//           </UserInfo>
//         )}

//         {/* Logout Button */}
//         <LogoutButton
//           onClick={() => {
//             localStorage.removeItem("userId");
//             navigate("/");
//           }}
//         >
//           LOGOUT
//         </LogoutButton>
//       </ProfileCard>
//     </Container>
//   );
// };

// // Styled Components
// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 20px;
//   font-family: "Roboto", sans-serif; /* Modern font */
//   background-color: #f5f5f5; /* Light gray background */
// `;

// const ProfileCard = styled.div`
//   width: 80%;
//   max-width: 600px;
//   background-color: #fff; /* White card */
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
//   padding: 30px;
// `;

// const ProfileHeader = styled.div`
//   text-align: center;
//   margin-bottom: 30px;
// `;

// const AvatarContainer = styled.div`
//   width: 120px;
//   height: 120px;
//   border-radius: 50%;
//   background-color: #e0e0e0; /* Light gray avatar background */
//   margin: 0 auto 15px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const Username = styled.h2`
//   font-size: 1.5em;
//   font-weight: bold;
//   margin-bottom: 5px;
//   color: #333; /* Dark gray text */
// `;

// const Email = styled.p`
//   color: #777;
// `;

// const NavTabs = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-bottom: 20px;
//   position: relative;
//   border-bottom: 1px solid #e0e0e0; /* Lighter border */
// `;

// const NavButton = styled.button`
//   background: none;
//   border: none;
//   padding: 10px 20px;
//   cursor: pointer;
//   font-size: 1em;
//   color: #777;
//   font-weight: bold;
//   transition: color 0.3s ease;

//   &:hover {
//     color: #333; /* Dark gray on hover */
//   }

//   color: ${(props) => (props.active ? "#333" : "#777")}; /* Active tab dark gray */
// `;

// const Slider = styled.div`
//   position: absolute;
//   bottom: 0;
//   width: 33.33%;
//   height: 2px;
//   background-color:rgb(30, 30, 31);
//   transition: left 0.3s ease;

//   left: ${(props) => {
//     switch (props.activeTab) {
//       case "HOSTED EVENTS":
//         return "33.33%";
//       case "SPONSORED EVENTS":
//         return "66.66%";
//       default:
//         return "0%";
//     }
//   }};
// `;

// const UserInfo = styled.div`
//   background-color: #fff; /* White background */
//   padding: 20px;
//   border-radius: 8px;
// `;

// const InfoRow = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 10px;
// `;

// const LogoutButton = styled.button`
//   background-color:rgb(20, 19, 19); /* Red logout button */
//   color: #fff; /* White text */
//   border: none;
//   padding: 10px 20px;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #c0392b; /* Darker red on hover */
//   }
// `;

// export default ProfilePage;




//                      thisss 
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styled from "styled-components";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState("PROFILE");
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (!storedUserId) {
//       console.warn("No userId found! Redirecting to login...");
//       navigate("/");
//       return;
//     }

//     fetchUserDetails(storedUserId);
//   }, [navigate]);

//   const fetchUserDetails = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/user/${userId}`
//       );
//       if (response.status === 200) {
//         setUser(response.data);
//       } else {
//         console.error("Failed to fetch user details:", response.statusText);
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       navigate("/");
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <Container>
//       <ProfileCard>
//         {/* Profile Header */}
//         <ProfileHeader>
//           <AvatarContainer>
//             <img
//               src="https://img.icons8.com/ios/100/000000/user-male-circle.png"
//               alt="Avatar"
//               style={{ width: "60px", height: "60px" }}
//             />
//           </AvatarContainer>
//           <Username>{user?.username || "Loading..."}</Username>
//           <Email>{user?.email || ""}</Email>
//         </ProfileHeader>

//         {/* Navigation Tabs */}
//         <NavTabs>
//           {["PROFILE", "HOSTED EVENTS", "SPONSORED EVENTS"].map((tab, index) => (
//             <NavButton
//               key={tab}
//               active={activeTab === tab}
//               onClick={() => handleTabClick(tab)}
//             >
//               {tab}
//             </NavButton>
//           ))}
//           <Slider activeTab={activeTab} />
//         </NavTabs>

//         {/* Content Rendering Based on Active Tab */}
//         <TabContent>
//           {activeTab === "PROFILE" && (
//             <UserInfo>
//               <h3>User Information</h3>
//               <InfoRow>
//                 <img
//                   src="https://img.icons8.com/material-outlined/24/000000/mail.png"
//                   alt="Email"
//                 />
//                 <p>{user?.email || "Loading..."}</p>
//               </InfoRow>
//               <InfoRow>
//                 <img
//                   src="https://img.icons8.com/material-outlined/24/000000/phone.png"
//                   alt="Phone"
//                 />
//                 <p>Not provided</p>
//               </InfoRow>
//             </UserInfo>
//           )}

//           {activeTab === "HOSTED EVENTS" && (
//             <UserInfo>
//               <h3>Hosted Events</h3>
//               <p>Content for Hosted Events goes here.</p>
//             </UserInfo>
//           )}

//           {activeTab === "SPONSORED EVENTS" && (
//             <UserInfo>
//               <h3>Sponsored Events</h3>
//               <p>Content for Sponsored Events goes here.</p>
//             </UserInfo>
//           )}
//         </TabContent>

//         {/* Logout Button */}
//         <LogoutButton
//           onClick={() => {
//             localStorage.removeItem("userId");
//             navigate("/");
//           }}
//         >
//           LOGOUT
//         </LogoutButton>
//       </ProfileCard>
//     </Container>
//   );
// };

// // Styled Components
// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: #f5f5f5;
// `;

// const ProfileCard = styled.div`
//   width: 90%;
//   max-width: 600px;
//   background-color: #fff;
//   border-radius: 10px;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   padding: 30px;
// `;

// const ProfileHeader = styled.div`
//   text-align: center;
//   margin-bottom: 20px;
// `;

// const AvatarContainer = styled.div`
//   width: 80px;
//   height: 80px;
//   border-radius: 50%;
//   background-color: #e0e0e0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 0 auto;
// `;

// const Username = styled.h2`
//   font-size: 1.5rem;
//   margin-top: 10px;
// `;

// const Email = styled.p`
//   color: #777;
// `;

// const NavTabs = styled.div`
//   display: flex;
//   justify-content: space-between;
//   position: relative;
//   border-bottom: 2px solid #ddd;
//   margin-bottom: 20px;
// `;

// const NavButton = styled.button`
//   flex: 1;
//   padding: 12px 0;
//   background: none;
//   border: none;
//   font-size: 1rem;
//   font-weight: bold;
//   color: ${(props) => (props.active ? "#333" : "#777")};
//   cursor: pointer;
//   transition: color 0.3s ease-in-out;

//   &:hover {
//     color: #333;
//   }
// `;

// const Slider = styled.div`
//   position: absolute;
//   bottom: -2px;
//   width: 33.33%;
//   height: 3px;
//   background-color: #1e1e1f;
//   transition: transform 0.3s ease-in-out;

//   transform: ${(props) => {
//     switch (props.activeTab) {
//       case "HOSTED EVENTS":
//         return "translateX(100%)";
//       case "SPONSORED EVENTS":
//         return "translateX(200%)";
//       default:
//         return "translateX(0)";
//     }
//   }};
// `;

// const TabContent = styled.div`
//   padding: 20px;
// `;

// const UserInfo = styled.div`
//   background-color: #fff;
//   padding: 20px;
//   border-radius: 8px;
// `;

// const InfoRow = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 10px;

//   img {
//     width: 20px;
//     height: 20px;
//     margin-right: 10px;
//   }
// `;

// const LogoutButton = styled.button`
//   width: 100%;
//   background-color: #2c2c2c;
//   color: #fff;
//   border: none;
//   padding: 12px;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 1rem;
//   font-weight: bold;
//   transition: background 0.3s ease-in-out;
//   margin-top: 20px;

//   &:hover {
//     background-color: #1a1a1a;
//   }
// `;

// export default ProfilePage;






import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("PROFILE");
  const [profileImage, setProfileImage] = useState(""); // Store the profile image URL
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.warn("No userId found! Redirecting to login...");
      navigate("/");  // Redirect to login if no userId found
      return;
    }

    fetchUserDetails(storedUserId);
  }, [navigate]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
      if (response.status === 200) {
        setUser(response.data);
        setProfileImage(`http://localhost:8080${response.data.profileImage}` || "https://img.icons8.com/ios/100/000000/user-male-circle.png");
      } else {
        console.error("Failed to fetch user details:", response.statusText);
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      navigate("/");
    }
  };
  

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    
    // Use userId for the backend request URL
    const userId = localStorage.getItem("userId");

    axios
      .post(`http://localhost:8080/api/uploadProfileImage/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Update the profile image after successful upload
          setProfileImage(`http://localhost:8080/api/profileImage/${userId}_${file.name}`);
          // Optionally, you can also update the user profile image in localStorage or backend
        }
      })
      .catch((error) => {
        console.error("Error uploading profile image:", error);
      });
  };

  return (
    <Container>
      <ProfileCard>
        {/* Profile Header */}
        <ProfileHeader>
          <AvatarContainer>
            <ProfileImage src={profileImage} alt="Avatar" />
            <UploadLabel>
              <UploadInput type="file" accept="image/*" onChange={handleImageUpload} />
              📷
            </UploadLabel>
          </AvatarContainer>
          <Username>{user?.username || "Loading..."}</Username>
          <Email>{user?.email || ""}</Email>
        </ProfileHeader>

        {/* Navigation Tabs */}
        <NavTabs>
          {["PROFILE", "HOSTED EVENTS", "SPONSORED EVENTS"].map((tab) => (
            <NavButton key={tab} active={activeTab === tab} onClick={() => handleTabClick(tab)}>
              {tab}
            </NavButton>
          ))}
          <Slider activeTab={activeTab} />
        </NavTabs>

        {/* Content Rendering Based on Active Tab */}
        <TabContent>
          {activeTab === "PROFILE" && (
            <UserInfo>
              <h3>User Information</h3>
              <InfoRow>
                <img src="https://img.icons8.com/material-outlined/24/000000/mail.png" alt="Email" />
                <p>{user?.email || "Loading..."}</p>
              </InfoRow>
              <InfoRow>
                <img src="https://img.icons8.com/material-outlined/24/000000/phone.png" alt="Phone" />
                <p>Not provided</p>
              </InfoRow>
            </UserInfo>
          )}

          {activeTab === "HOSTED EVENTS" && (
            <UserInfo>
              <h3>Hosted Events</h3>
              <p>Content for Hosted Events goes here.</p>
            </UserInfo>
          )}

          {activeTab === "SPONSORED EVENTS" && (
            <UserInfo>
              <h3>Sponsored Events</h3>
              <p>Content for Sponsored Events goes here.</p>
            </UserInfo>
          )}
        </TabContent>

        {/* Logout Button */}
        <LogoutButton
          onClick={() => {
            localStorage.removeItem("userId");
            navigate("/"); // Log out and redirect to login
          }}
        >
          LOGOUT
        </LogoutButton>
      </ProfileCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 10px 20px;
  background-color: #f5f5f5;
`;

const ProfileCard = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 20px;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const AvatarContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const UploadLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
`;

const UploadInput = styled.input`
  display: none;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  margin-top: 10px;
`;

const Email = styled.p`
  color: #777;
`;

const NavTabs = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
`;

const NavButton = styled.button`
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => (props.active ? "#333" : "#777")};
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #333;
  }
`;

const Slider = styled.div`
  position: absolute;
  bottom: -2px;
  width: 33.33%;
  height: 3px;
  background-color: #1e1e1f;
  transition: transform 0.3s ease-in-out;

  transform: ${(props) => {
    switch (props.activeTab) {
      case "HOSTED EVENTS":
        return "translateX(100%)";
      case "SPONSORED EVENTS":
        return "translateX(200%)";
      default:
        return "translateX(0)";
    }
  }};
`;

const TabContent = styled.div`
  padding: 20px;
`;

const UserInfo = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  background-color: #2c2c2c;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
  margin-top: 20px;

  &:hover {
    background-color: #1a1a1a;
  }
`;

export default ProfilePage;
