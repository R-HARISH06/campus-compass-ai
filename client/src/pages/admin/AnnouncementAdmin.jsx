import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

function AnnouncementAdmin() {
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({ title: "", body: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/announcements`);
      if (!res.ok) throw new Error("Failed to load announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg({ type: "success", text: "Announcement posted successfully!" });
        setFormData({ title: "", body: "" });
        fetchAnnouncements();
      } else {
        setMsg({ type: "danger", text: data.message || "Failed to post announcement." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error posting announcement." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    setActionLoadingId(id);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a.id !== id));
        setMsg({ type: "success", text: "Announcement deleted." });
      } else {
        const data = await res.json();
        setMsg({ type: "danger", text: data.message || "Failed to delete announcement." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error deleting announcement." });
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
        <Card className="border-0 shadow-sm glass-card text-white h-100">
          <Card.Header className="border-bottom-0 pt-4 pb-0 bg-transparent">
            <h4 className="fw-bold mb-0 text-warning">Post Announcement</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control 
                  type="text" 
                  required
                  placeholder="e.g. Exam Schedule Released"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="modern-input text-white"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Details / Body</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4}
                  placeholder="Enter the full announcement text..."
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="modern-input text-white"
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" animation="border" /> : "Broadcast"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={8}>
        <Card className="border-0 shadow-sm glass-card text-white h-100">
          <Card.Header className="border-bottom-0 pt-4 pb-0 bg-transparent">
            <h4 className="fw-bold mb-0 text-warning">Active Announcements</h4>
          </Card.Header>
          <Card.Body>
            {error ? (
              <Alert variant="danger">{error}</Alert>
            ) : announcements.length === 0 ? (
              <p className="text-muted text-center py-4">No announcements active.</p>
            ) : (
              <Table responsive hover className="align-middle mt-2 table-borderless text-white">
                <thead className="border-bottom border-secondary">
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {announcements.map(ann => (
                    <tr key={ann.id}>
                      <td className="text-muted" style={{ width: "120px" }}>
                        {new Date(ann.created_at).toLocaleDateString()}
                      </td>
                      <td className="fw-semibold text-primary">{ann.title}</td>
                      <td className="text-muted">{ann.created_by_name || "Admin"}</td>
                      <td style={{ width: "90px" }}>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(ann.id)}
                          disabled={actionLoadingId === ann.id}
                        >
                          {actionLoadingId === ann.id ? <Spinner size="sm" animation="border" /> : "Delete"}
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

export default AnnouncementAdmin;
