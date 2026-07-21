import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
      } else {
        login(data.token, data.user);
        navigate("/");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 pt-5 position-relative">
      <Row className="justify-content-center mt-4">
        <Col md={7} lg={5}>
          <Card className="animate-fade-in-up shadow-lg">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold gradient-text">Welcome Back</h2>
              <p className="text-center text-muted mb-4">Please log in to your account</p>

              {error && (
                <Alert variant="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formLoginEmail">
                  <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-5" controlId="formLoginPassword">
                  <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-4 py-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login to Dashboard"}
                </Button>

                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: 'var(--tertiary-accent)' }}>
                    Sign Up
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
