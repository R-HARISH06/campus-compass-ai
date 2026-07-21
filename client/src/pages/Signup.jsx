import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("student");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (role !== "student" && adminCode !== "CAMPUS2026") {
      setError("Invalid Secret Admin Code. Please check the code or sign up as a Student.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, department, year: parseInt(year) || null, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
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
        <Col md={7} lg={6}>
          <Card className="animate-fade-in-up shadow-lg">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold gradient-text">Create Account</h2>
              <p className="text-center text-muted mb-4">Join Campus Compass AI today</p>

              {error && (
                <Alert variant="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formSignupName">
                  <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formSignupEmail">
                  <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formSignupPassword">
                  <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formSignupRole">
                  <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Account Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value !== "student") {
                        setDepartment("");
                        setYear("");
                      } else {
                        setAdminCode("");
                      }
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="cafe_owner">Cafe Owner</option>
                    <option value="club_admin">Club Admin</option>
                    <option value="master_admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                {role !== "student" && (
                  <Form.Group className="mb-4" controlId="formSignupAdminCode">
                    <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Secret Admin Code</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Required for non-student roles"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                {role === "student" && (
                  <Row className="mb-2">
                    <Col>
                      <Form.Group className="mb-4" controlId="formSignupDept">
                        <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Department</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. CS, IT"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-4" controlId="formSignupYear">
                        <Form.Label className="text-muted fw-semibold ms-1" style={{ fontSize: '0.9rem' }}>Year</Form.Label>
                        <Form.Select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-4 py-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>

                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--tertiary-accent)' }}>
                    Login
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

export default Signup;
