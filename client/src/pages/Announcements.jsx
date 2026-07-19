import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
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
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) return <Container className="mt-5 pt-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

  return (
    <Container className="mt-5 pt-5">
      <Row className="mb-4 animate-fade-in-up">
        <Col>
          <h2 className="fw-bold gradient-text">Campus Announcements</h2>
          <p className="text-muted">Stay up to date with the latest news and notices.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {announcements.length === 0 && !error ? (
        <Alert variant="info" className="bg-dark text-white border-secondary">
          No announcements available at the moment.
        </Alert>
      ) : (
        <Row className="g-4">
          {announcements.map((ann, idx) => (
            <Col md={6} lg={4} key={ann.id} className={`animate-fade-in-up delay-${(idx % 4) + 1}`}>
              <Card className="h-100 shadow-sm border-0 bg-dark text-white hover-lift">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold text-primary mb-0">{ann.title}</Card.Title>
                    <Badge bg="danger" className="ms-2">New</Badge>
                  </div>
                  <Card.Text className="text-muted mb-4" style={{ flexGrow: 1 }}>
                    {ann.body}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center border-top border-secondary pt-3">
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i> {formatDate(ann.created_at)}
                    </small>
                    <small className="text-muted fw-bold">
                      {ann.created_by_name || "Admin"}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Announcements;
