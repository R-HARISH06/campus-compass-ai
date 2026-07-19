import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

function EventAdmin() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    image_url: "",
    department: "",
    event_type: "technical"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg({ type: "success", text: "Event scheduled successfully!" });
        setFormData({
          title: "",
          description: "",
          date: "",
          venue: "",
          image_url: "",
          department: "",
          event_type: "technical"
        });
        fetchEvents();
      } else {
        setMsg({ type: "danger", text: data.message || "Failed to schedule event." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error scheduling event." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this event? This action cannot be undone.")) return;
    setActionLoadingId(id);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
        setMsg({ type: "success", text: "Event cancelled." });
      } else {
        const data = await res.json();
        setMsg({ type: "danger", text: data.message || "Failed to cancel event." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error cancelling event." });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Row className="g-4 animate-fade-in-up">
      {msg.text && (
        <Col xs={12}>
          <Alert variant={msg.type} onClose={() => setMsg({ type: "", text: "" })} dismissible>
            {msg.text}
          </Alert>
        </Col>
      )}

      <Col lg={4}>
        <Card className="border-0 shadow-sm bg-dark text-white h-100">
          <Card.Header className="border-bottom-0 pt-4 pb-0 bg-dark">
            <h4 className="fw-bold mb-0 text-warning">Schedule Event</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="bg-secondary text-white border-0"
                />
              </Form.Group>
              
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date & Time *</Form.Label>
                    <Form.Control 
                      type="text" 
                      required
                      placeholder="e.g. Oct 25, 10:00 AM"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="bg-secondary text-white border-0"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Venue *</Form.Label>
                    <Form.Control 
                      type="text" 
                      required
                      placeholder="e.g. Main Auditorium"
                      value={formData.venue}
                      onChange={e => setFormData({ ...formData, venue: e.target.value })}
                      className="bg-secondary text-white border-0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Type *</Form.Label>
                    <Form.Select
                      required
                      value={formData.event_type}
                      onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                      className="bg-secondary text-white border-0"
                    >
                      <option value="technical">Technical</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="seminar">Seminar</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Department (Opt)</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. CSE"
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="bg-secondary text-white border-0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Image URL (Optional)</Form.Label>
                <Form.Control 
                  type="url" 
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-secondary text-white border-0"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Description *</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary text-white border-0"
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" animation="border" /> : "Publish Event"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={8}>
        <Card className="border-0 shadow-sm bg-dark text-white h-100">
          <Card.Header className="border-bottom-0 pt-4 pb-0 bg-dark">
            <h4 className="fw-bold mb-0 text-warning">Scheduled Events</h4>
          </Card.Header>
          <Card.Body>
            {error ? (
              <Alert variant="danger">{error}</Alert>
            ) : events.length === 0 ? (
              <p className="text-muted text-center py-4">No events found.</p>
            ) : (
              <Table variant="dark" responsive hover className="align-middle mt-2">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id}>
                      <td className="fw-semibold text-primary">{ev.title}</td>
                      <td className="text-muted">{ev.date}</td>
                      <td className="text-muted text-capitalize">{ev.event_type}</td>
                      <td style={{ width: "90px" }}>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(ev.id)}
                          disabled={actionLoadingId === ev.id}
                        >
                          {actionLoadingId === ev.id ? <Spinner size="sm" animation="border" /> : "Cancel"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default EventAdmin;
