import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, Modal, Table } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import { requestForToken, onMessageListener } from "../firebase";

function Profile() {
  const { user, token } = useAuth();
  const [rsvps, setRsvps] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [fullUser, setFullUser] = useState(null);
  const [fcmLoading, setFcmLoading] = useState(false);
  const [fcmMessage, setFcmMessage] = useState("");

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    department: "",
    year: "",
    interests: "",
    phone: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        const eventsRes = await fetch(`${API_BASE_URL}/events`);
        const eventsData = await eventsRes.json();
        setAllEvents(eventsData);

        const rsvpsRes = await fetch(`${API_BASE_URL}/events/rsvps`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const rsvpsData = await rsvpsRes.json();
        setRsvps(rsvpsData);

        const clubsRes = await fetch(`${API_BASE_URL}/clubs/mine`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const clubsData = await clubsRes.json();
        setClubs(clubsData);

        const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const meData = await meRes.json();
        setFullUser(meData.user || user);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);

  const openEditModal = () => {
    setEditData({
      name: fullUser?.name || user?.name || "",
      department: fullUser?.department || "",
      year: fullUser?.year || "",
      interests: fullUser?.interests || "",
      phone: fullUser?.phone || ""
    });
    setShowEditModal(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Profile updated successfully!" });
        setShowEditModal(false);
        // Quick page reload to sync context or ideally update context (but page reload is foolproof for now)
        window.location.reload(); 
      } else {
        setMsg({ type: "danger", text: data.message || "Failed to update profile." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error updating profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelRSVP = async (eventId) => {
    setActionLoading(`rsvp-${eventId}`);
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setRsvps(rsvps.filter(id => id !== eventId));
        setMsg({ type: "success", text: "RSVP cancelled successfully." });
      } else {
        const errorData = await res.json();
        setMsg({ type: "danger", text: errorData.message || "Failed to cancel RSVP." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error cancelling RSVP." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveClub = async (clubId) => {
    setActionLoading(`club-${clubId}`);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${clubId}/leave`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setClubs(clubs.filter(c => c.id !== clubId));
        setMsg({ type: "success", text: "Left club successfully." });
      } else {
        const errorData = await res.json();
        setMsg({ type: "danger", text: errorData.message || "Failed to leave club." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error leaving club." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEnableNotifications = async () => {
    setFcmLoading(true);
    setFcmMessage("");
    try {
      const fcmToken = await requestForToken();
      if (fcmToken) {
        // Send token to backend
        const res = await fetch(`${API_BASE_URL}/auth/fcm-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // This now uses the JWT token from useAuth!
          },
          body: JSON.stringify({ fcm_token: fcmToken })
        });
        if (res.ok) {
          setFcmMessage("Notifications enabled successfully! 🎉");
        } else {
          setFcmMessage("Failed to register token with server.");
        }
      } else {
        setFcmMessage("Notification permission denied or blocked by browser.");
      }
    } catch (err) {
      console.error(err);
      setFcmMessage(`Error: ${err.message || "An error occurred enabling notifications."}`);
    } finally {
      setFcmLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const rsvpedEvents = allEvents.filter(e => rsvps.includes(e.id));

  return (
    <div className="container mt-5 pt-5">
      <h1 className="display-5 fw-bold mb-4 gradient-text animate-fade-in-up">
        👤 My Profile
      </h1>

      {msg.text && (
        <Alert variant={msg.type} onClose={() => setMsg({ type: "", text: "" })} dismissible>
          {msg.text}
        </Alert>
      )}

      <div className="row mb-5 animate-fade-in-up delay-1">
        <div className="col-12">
          <div className="card p-4 bg-dark text-white shadow border-0 position-relative">
            <Button 
              variant="outline-light" 
              size="sm" 
              className="position-absolute top-0 end-0 m-3"
              onClick={openEditModal}
            >
              <i className="bi bi-pencil-square me-1"></i> Edit Profile
            </Button>
            
            <div className="d-flex align-items-center mb-4">
              <div 
                className="rounded-circle bg-primary d-flex justify-content-center align-items-center me-4 shadow"
                style={{ width: "80px", height: "80px", fontSize: "32px", color: "white" }}
              >
                {(fullUser?.name || user?.name) ? (fullUser?.name || user?.name).charAt(0).toUpperCase() : "👤"}
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-warning">{fullUser?.name || user?.name}</h3>
                <p className="text-muted mb-0">{fullUser?.email || user?.email}</p>
                <Badge bg="secondary" className="mt-2">{fullUser?.role || user?.role}</Badge>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <small className="text-muted d-block text-uppercase fw-bold mb-1">Department</small>
                  <div className="fs-5">{fullUser?.department || "Not Specified"}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <small className="text-muted d-block text-uppercase fw-bold mb-1">Year of Study</small>
                  <div className="fs-5">{fullUser?.year ? `Year ${fullUser.year}` : "Not Specified"}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <small className="text-muted d-block text-uppercase fw-bold mb-1">Phone Number</small>
                  <div className="fs-5">{fullUser?.phone || "Not Specified"}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <small className="text-muted d-block text-uppercase fw-bold mb-1">Interests / Hobbies</small>
                  <div className="fs-5">{fullUser?.interests || "Not Specified"}</div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 border-top pt-4 border-secondary">
              <Button 
                variant="outline-info" 
                onClick={handleEnableNotifications}
                disabled={fcmLoading}
              >
                {fcmLoading ? <Spinner size="sm" animation="border" /> : "🔔 Enable Push Notifications"}
              </Button>
              {fcmMessage && <div className="mt-2 text-info small">{fcmMessage}</div>}
            </div>

          </div>
        </div>
      </div>

      <div className="row animate-fade-in-up delay-2">
        <div className="col-md-6 mb-4">
          <h3 className="fw-bold gradient-text">Registered Events</h3>
          {rsvpedEvents.length === 0 ? (
            <p className="text-muted">You haven't RSVPed to any events yet.</p>
          ) : (
            <div className="list-group">
              {rsvpedEvents.map(event => (
                <div key={event.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center mb-2 rounded border border-secondary">
                  <div>
                    <h5 className="mb-1">{event.title}</h5>
                    <small className="text-muted">{event.date} • {event.venue}</small>
                  </div>
                  <Button 
                    variant="danger" 
                    size="sm"
                    disabled={actionLoading === `rsvp-${event.id}`}
                    onClick={() => handleCancelRSVP(event.id)}
                  >
                    {actionLoading === `rsvp-${event.id}` ? <Spinner size="sm" animation="border" /> : "Cancel RSVP"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-4">
          <h3 className="fw-bold gradient-text">Joined Clubs</h3>
          {clubs.length === 0 ? (
            <p className="text-muted">You haven't joined any clubs yet.</p>
          ) : (
            <div className="list-group">
              {clubs.map(club => (
                <div key={club.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center mb-2 rounded border border-secondary">
                  <div>
                    <h5 className="mb-1">{club.name}</h5>
                    <small className="text-muted">Meets: {club.meeting_day}</small>
                  </div>
                  <Button 
                    variant="danger" 
                    size="sm"
                    disabled={actionLoading === `club-${club.id}`}
                    onClick={() => handleLeaveClub(club.id)}
                  >
                    {actionLoading === `club-${club.id}` ? <Spinner size="sm" animation="border" /> : "Leave Club"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton className="border-secondary bg-dark" closeVariant="white">
          <Modal.Title className="text-warning">Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={editData.name} 
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="bg-secondary text-white border-0"
              />
            </Form.Group>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select 
                    value={editData.department} 
                    onChange={(e) => setEditData({...editData, department: e.target.value})}
                    className="bg-secondary text-white border-0"
                  >
                    <option value="">Select Dept</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select 
                    value={editData.year} 
                    onChange={(e) => setEditData({...editData, year: e.target.value})}
                    className="bg-secondary text-white border-0"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control 
                type="tel" 
                value={editData.phone} 
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="bg-secondary text-white border-0"
                placeholder="e.g. 9876543210"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Interests & Hobbies</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                value={editData.interests} 
                onChange={(e) => setEditData({...editData, interests: e.target.value})}
                className="bg-secondary text-white border-0"
                placeholder="Coding, AI, Sports..."
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={savingProfile}>
              {savingProfile ? <Spinner size="sm" animation="border" /> : "Save Changes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default Profile;
