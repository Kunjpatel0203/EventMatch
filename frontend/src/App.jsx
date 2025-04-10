import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import SponsorsPage from "./pages/Sponspors/SponsorsPage";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Auth/AuthPage";
import EventListing from "./pages/EventListings";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailsPage from "./pages/EventsDetailsPage";
import AuctionBiddingPage from "./pages/AuctionBiddingPage";
import ProfilePage from "./pages/ProfilePage";
import ProfilePageHost from "./pages/ProfilePageHost";
import ChatPage from "./pages/ChatPage";
import PaymentResultPage from "./pages/PaymentResultPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#424242",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/events/:eventId/auctions/:auctionId"
            element={<AuctionBiddingPage />}
          />
          <Route path="/profile/:hostId" element={<ProfilePageHost />} />
          <Route path="chat" element={<ChatPage />}/>
          <Route path="/payment-success" element={<PaymentResultPage />} />
          <Route path="/payment-cancel" element={<PaymentResultPage />} />
        </Routes>
        <div className="p-3"></div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
