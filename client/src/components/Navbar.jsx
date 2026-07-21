import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as BNavbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <BNavbar expand="lg" className={`mb-4 fixed-top ${scrolled ? 'nav-scrolled' : 'glass-navbar'}`} variant="dark">
      <Container>
        <BNavbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center">
          <span className="fs-3 me-2">🧭</span> Campus Compass AI
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {(!user || user.role !== 'cafe_owner') && (
              <NavDropdown title="Academics" id="academics-dropdown" menuVariant="dark">
                <NavDropdown.Item as={Link} to="/admissions">Admissions</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/timetable">Timetable</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/faculty">Faculty</NavDropdown.Item>
              </NavDropdown>
            )}

            <NavDropdown title="Campus" id="campus-dropdown" menuVariant="dark">
              {(!user || user.role !== 'cafe_owner') && (
                <>
                  <NavDropdown.Item as={Link} to="/announcements">Announcements</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/clubs">Clubs</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/map">Campus Map</NavDropdown.Item>
                </>
              )}
              <NavDropdown.Item as={Link} to="/canteen">Canteen</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/ai" className="ai-pulse">✨ AI Assistant</Nav.Link>

            {user ? (
              <>
                {user.role !== "student" && user.role !== "faculty" && (
                  <Nav.Link as={Link} to="/admin" className="text-warning fw-bold ms-lg-2">
                    Admin
                  </Nav.Link>
                )}
                <span className="text-light ms-lg-3 me-2 fw-semibold">
                  👤 {user.name.split(" ")[0]}
                </span>
                <Link to="/profile" className="btn btn-outline-primary btn-sm px-3 ms-lg-1">Profile</Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-lg-1 px-3"
                  style={{ borderRadius: '12px' }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-primary ms-lg-3 px-3 mt-2 mt-lg-0">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="btn btn-primary ms-lg-2 px-3 mt-2 mt-lg-0">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}

export default Navbar;