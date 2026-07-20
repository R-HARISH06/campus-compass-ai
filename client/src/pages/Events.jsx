import { useEffect, useState } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from "../config";

function Events() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [rsvpLoadingId, setRsvpLoadingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Fetch events
    fetch(API_BASE_URL + "/events")
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.log(error));

    // Load registered RSVPs from backend
    if (user && token) {
      fetch(API_BASE_URL + "/events/rsvps", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRsvpedEvents(data);
        }
      })
      .catch(error => console.error("Error fetching RSVPs:", error));
    }
  }, [user, token]);

  const handleRSVP = async (event) => {
    if (!user) return;
    setRsvpLoadingId(event.id);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Check if EmailJS is configured
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_ID,
              user_id: EMAILJS_PUBLIC_KEY,
              template_params: {
                to_name: user.name,
                to_email: user.email,
                event_title: event.title,
                event_date: event.date,
                event_venue: event.venue
              }
            })
          });

          if (!response.ok) {
            console.warn("EmailJS failed to send confirmation email. Check your template or quota.");
          }
        } catch (emailError) {
          console.error("EmailJS network error:", emailError);
        }
      } else {
        console.warn("EmailJS configuration is missing. Sending notification skipped.");
      }

      // Success logic: save locally (temporarily, as the main source is now the backend)
      const rsvpResponse = await fetch(`${API_BASE_URL}/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!rsvpResponse.ok) {
        const errorData = await rsvpResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to register RSVP in database. Server might be down.");
      }

      const updated = [...rsvpedEvents, event.id];
      setRsvpedEvents(updated);
      setSuccessMsg(`Successfully RSVPed to "${event.title}"! A confirmation has been registered.`);
    } catch (error) {
      console.error("RSVP error:", error);
      setErrorMsg(error.message || "Failed to process RSVP. Please try again.");
    } finally {
      setRsvpLoadingId(null);
    }
  };

  const handleCancelRSVP = async (event) => {
    if (!user) return;
    setRsvpLoadingId(event.id);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/events/${event.id}/rsvp`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to cancel RSVP");
      }
      setRsvpedEvents(rsvpedEvents.filter(id => id !== event.id));
      setSuccessMsg(`Cancelled RSVP for "${event.title}".`);
    } catch (error) {
      console.error("Cancel RSVP error:", error);
      setErrorMsg(error.message || "Failed to cancel RSVP.");
    } finally {
      setRsvpLoadingId(null);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h1 className="display-5 fw-bold mb-4 gradient-text animate-fade-in-up">
        📅 Upcoming Events
      </h1>

      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg("")} dismissible>{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>{errorMsg}</Alert>}

      <div className="row g-4">
        {events.map((event, index) => (
          <div key={event.id} className="col-md-6">
            <div className={"card h-100 animate-fade-in-up delay-" + ((index % 4) + 1)}>
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <h2 className="card-title h4 fw-bold">
                    {event.title}
                  </h2>
                  <p className="card-text text-muted mt-3">
                    {event.description}
                  </p>
                  <p className="mb-1 text-muted">
                    <strong className="text-light">📍 Venue:</strong> {event.venue}
                  </p>
                  <p className="mb-0 text-muted">
                    <strong className="text-light">📅 Date:</strong> {event.date}
                  </p>
                </div>
                </div>
                <div className="mt-4 text-end">
                  {!user ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="px-4 text-white"
                      onClick={() => navigate('/login')}
                    >
                      Login to Register
                    </Button>
                  ) : rsvpedEvents.includes(event.id) ? (
                    <Button
                      variant="danger"
                      size="sm"
                      className="px-4 text-white"
                      disabled={rsvpLoadingId === event.id}
                      onClick={() => handleCancelRSVP(event)}
                    >
                      {rsvpLoadingId === event.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Cancel Registration"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="px-4 text-white"
                      disabled={rsvpLoadingId === event.id}
                      onClick={() => handleRSVP(event)}
                    >
                      {rsvpLoadingId === event.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Register"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;