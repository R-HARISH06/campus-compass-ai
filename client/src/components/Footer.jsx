import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <Container>
        <Row className="align-items-center mb-4">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <h4 className="fw-bold" style={{ color: 'var(--text-main)' }}>
              <span className="fs-4 me-2">🧭</span>
              Campus Compass AI
            </h4>
            <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.95rem' }}>
              Your intelligent guide for campus life. Navigate smarter.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <Link to="/ai" className="text-muted hover-scale text-decoration-none">AI Assistant</Link>
              <Link to="/events" className="text-muted hover-scale text-decoration-none">Events</Link>
              <Link to="/map" className="text-muted hover-scale text-decoration-none">Map</Link>
            </div>
          </Col>
        </Row>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} className="w-100 my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} Campus Compass AI. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
