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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
    <Container className="mt-5 pt-5">
      <Row className="justify-content-center mt-4">
        <Col md={6} lg={5}>
          <Card className="animate-fade-in-up">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold gradient-text">Sign Up</h2>

              {error && (
                <Alert variant="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formSignupName">
                  <Form.Label className="text-light">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    className="bg-dark text-light border-secondary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSignupEmail">
                  <Form.Label className="text-light">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="bg-dark text-light border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSignupPassword">
                  <Form.Label className="text-light">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password (min 6 chars)"
                    className="bg-dark text-light border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSignupRole">
                  <Form.Label className="text-light">Account Role</Form.Label>
                  <Form.Select
                    className="bg-dark text-light border-secondary"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value !== "student") {
                        setDepartment("");
                        setYear("");
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

                {role === "student" && (
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="formSignupDept">
                        <Form.Label className="text-light">Department</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. CS, IT"
                          className="bg-dark text-light border-secondary"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-4" controlId="formSignupYear">
                        <Form.Label className="text-light">Year</Form.Label>
                        <Form.Select
                          className="bg-dark text-light border-secondary"
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
                  className="w-100 mb-3 py-2 fw-bold text-white"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>

                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-decoration-none fw-bold text-primary">
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
