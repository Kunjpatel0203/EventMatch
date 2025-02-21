import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, X, Search, Mail, Tag } from "lucide-react";
import "../styles/Sponsors.css"; // Importing the CSS file

const sponsors = [
  {
    id: 1,
    name: "TechCorp",
    description: "Leading technology solutions provider",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsUTHAz2ss7DkM30-1UvfvZTbYhBQIAOLoMw&s",
    email: "contact@techcorp.com",
    type: "Technology",
  },
  {
    id: 2,
    name: "EcoGreen",
    description: "Sustainable energy innovator",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSSudyQYExXpcQT-Su_H8MyHBwvloNu0iP0g&s",
    email: "info@ecogreen.com",
    type: "Energy",
  },
  {
    id: 3,
    name: "HealthPlus",
    description: "Advanced healthcare systems",
    logo: "https://img.freepik.com/premium-vector/medical-health-plus-cross-logo-design_375081-810.jpg",
    email: "support@healthplus.com",
    type: "Healthcare",
  },
  {
    id: 4,
    name: "FinTech Solutions",
    description: "Innovative financial technology",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrpYbBLNxB7kVKd4TXMsVGROJSXKYi4ScBFg&s",
    email: "hello@fintechsolutions.com",
    type: "Finance",
  },
  {
    id: 5,
    name: "EduLearn",
    description: "Cutting-edge educational platforms",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdWr2vUxgRJE2x6oyty7NOX1_jPW7LvXHRw&s",
    email: "info@edulearn.com",
    type: "Education",
  },
  {
    id: 6,
    name: "AeroSpace",
    description: "Next-generation aerospace technology",
    logo: "https://www.shutterstock.com/image-vector/abstract-initial-letter-aerospace-logo-600nw-2418709995.jpg",
    email: "contact@aerospace.com",
    type: "Aerospace",
  },
];

export default function SponsorsPage() {
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSponsors, setFilteredSponsors] = useState(sponsors);

  const handleSponsorClick = (sponsor) => {
    setSelectedSponsor(sponsor);
    setIsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedSponsor(null);
    setIsDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = sponsors.filter(
      (sponsor) =>
        sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSponsors(filtered);
  }, [searchTerm]);

  return (
    <div className="container">
      <h1 className="title">Our Valued Sponsors</h1>

      {/* <div className="search-container">
        <input
          type="text"
          placeholder="Search sponsors..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <Search className="search-icon" />
      </div> */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search sponsors..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            paddingRight: "2rem", // Add space for the icon
            width: "100%",
            height: "2.5rem", // Adjust as needed
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <Search
          style={{
            position: "absolute",
            right: "0.5rem", // Space between the icon and the input border
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none", // Prevent the icon from blocking input interactions
            color: "#888", // Adjust color if needed
          }}
        />
      </div>

      {filteredSponsors.length === 0 ? (
        <p className="no-results">No sponsors found matching your search.</p>
      ) : (
        <div className="grid">
          {filteredSponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              <div className="card-content">
                <div className="logo">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="logo-image"
                  />
                </div>
                <h2 className="sponsor-name">{sponsor.name}</h2>
                <p className="sponsor-type">{sponsor.type}</p>
              </div>
              <button
                className="learn-more-btn"
                onClick={() => handleSponsorClick(sponsor)}
              >
                <Info className="icon" /> Learn More
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>{selectedSponsor.name}</h3>
              <button className="close-btn" onClick={handleCloseDetails}>
                <X />
              </button>
            </div>
            <div className="dialog-body">
              <p>{selectedSponsor.description}</p>
              <img
                src={selectedSponsor.logo}
                alt={`${selectedSponsor.name} logo`}
                className="dialog-logo"
              />
              <div className="contact-info">
                <Mail className="icon" />
                {selectedSponsor.email}
              </div>
              <div className="contact-info">
                <Tag className="icon" />
                {selectedSponsor.type}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
