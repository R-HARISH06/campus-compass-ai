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

  if (loading) return (
    <Container className="mt-5 pt-5">
      <Row className="mb-4 animate-fade-in-up">
        <Col>
          <h2 className="fw-bold gradient-text">Campus Announcements</h2>
          <p className="text-muted">Stay up to date with the latest news and notices.</p>
        </Col>
      </Row>
      <Row className="g-4">
        {[1, 2, 3].map((idx) => (
          <Col md={6} lg={4} key={idx}>
            <Card className="h-100 glass-card skeleton-loader border-0">
              <Card.Body className="d-flex flex-column">
                <div style={{ height: '24px', width: '60%', marginBottom: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div style={{ height: '16px', width: '100%', marginBottom: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div style={{ height: '16px', width: '80%', marginBottom: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div className="mt-auto border-top border-secondary pt-3">
                  <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );

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
        <Alert variant="info" className="glass-card text-white border-0">
          No announcements available at the moment.
        </Alert>
      ) : (
        <Row className="g-4">
          {announcements.map((ann, idx) => (
            <Col md={6} lg={4} key={ann.id} className={`animate-fade-in-up delay-${(idx % 4) + 1}`}>
              <Card className="h-100 glass-card text-white hover-scale">
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
