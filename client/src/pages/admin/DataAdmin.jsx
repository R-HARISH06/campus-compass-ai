import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form, Spinner, Alert, Row, Col, Tabs, Tab } from "react-bootstrap";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

function DataAdmin() {
  const { token } = useAuth();
  
  // Faculty State
  const [faculty, setFaculty] = useState([]);
  const [fLoading, setFLoading] = useState(true);
  const [fError, setFError] = useState("");
  const [fFormData, setFFormData] = useState({
    name: "", department: "", designation: "Assistant Professor", email: "", 
    phone: "", is_hod: false, profile_image_url: "", education: "", expertise: ""
  });
  
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchFaculty = async () => {
    setFLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/faculty`);
      if (!res.ok) throw new Error("Failed to load faculty");
      const data = await res.json();
      setFaculty(data);
    } catch (err) {
      setFError(err.message);
    } finally {
      setFLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/faculty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(fFormData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg({ type: "success", text: "Faculty member added!" });
        setFFormData({
          name: "", department: "", designation: "Assistant Professor", email: "", 
          phone: "", is_hod: false, profile_image_url: "", education: "", expertise: ""
        });
        fetchFaculty();
      } else {
        setMsg({ type: "danger", text: data.message || "Failed to add faculty." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error adding faculty." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to remove this faculty record?")) return;
    setActionLoadingId(id);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFaculty(faculty.filter(f => f.id !== id));
        setMsg({ type: "success", text: "Faculty member deleted." });
      } else {
        const data = await res.json();
        setMsg({ type: "danger", text: data.message || "Failed to delete faculty." });
      }
    } catch (err) {
      setMsg({ type: "danger", text: "Error deleting faculty." });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {msg.text && (
        <Alert variant={msg.type} onClose={() => setMsg({ type: "", text: "" })} dismissible>
          {msg.text}
        </Alert>
      )}

      <Tabs defaultActiveKey="faculty" className="mb-4 custom-pills" variant="pills">
        <Tab eventKey="faculty" title="Faculty Records">
          <Row className="g-4">
            <Col lg={4}>
              <Card className="border-0 shadow-sm bg-dark text-white">
                <Card.Header className="border-bottom-0 pt-4 pb-0 bg-dark">
                  <h4 className="fw-bold mb-0 text-warning">Add Faculty</h4>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleCreateFaculty}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control 
                        type="text" required
                        value={fFormData.name}
                        onChange={e => setFFormData({ ...fFormData, name: e.target.value })}
                        className="bg-secondary text-white border-0"
                      />
                    </Form.Group>
                    <Row className="g-2 mb-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Department *</Form.Label>
                          <Form.Control 
                            type="text" required placeholder="e.g. CSE"
                            value={fFormData.department}
                            onChange={e => setFFormData({ ...fFormData, department: e.target.value })}
                            className="bg-secondary text-white border-0"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Designation *</Form.Label>
                          <Form.Select 
                            required
                            value={fFormData.designation}
                            onChange={e => setFFormData({ ...fFormData, designation: e.target.value })}
                            className="bg-secondary text-white border-0"
                          >
                            <option value="Assistant Professor">Asst. Professor</option>
                            <option value="Associate Professor">Assoc. Professor</option>
                            <option value="Professor">Professor</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control 
                        type="email" required
                        value={fFormData.email}
                        onChange={e => setFFormData({ ...fFormData, email: e.target.value })}
                        className="bg-secondary text-white border-0"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Check 
                        type="switch"
                        id="hod-switch"
                        label="Is Head of Department (HOD)?"
                        checked={fFormData.is_hod}
                        onChange={e => setFFormData({ ...fFormData, is_hod: e.target.checked })}
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner size="sm" animation="border" /> : "Save Faculty"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card className="border-0 shadow-sm bg-dark text-white h-100">
                <Card.Header className="border-bottom-0 pt-4 pb-0 bg-dark">
                  <h4 className="fw-bold mb-0 text-warning">Faculty Directory</h4>
                </Card.Header>
                <Card.Body>
                  {fLoading ? <Spinner animation="border" variant="primary" /> : fError ? (
                    <Alert variant="danger">{fError}</Alert>
                  ) : faculty.length === 0 ? (
                    <p className="text-muted py-4">No faculty records found.</p>
                  ) : (
                    <Table variant="dark" responsive hover className="align-middle mt-2">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Dept</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faculty.map(f => (
                          <tr key={f.id}>
                            <td className="fw-semibold">{f.name}</td>
                            <td className="text-muted">{f.department}</td>
                            <td className="text-muted">{f.is_hod ? <span className="badge bg-danger">HOD</span> : f.designation}</td>
                            <td style={{ width: "90px" }}>
                              <Button 
                                variant="outline-danger" size="sm"
                                onClick={() => handleDeleteFaculty(f.id)}
                                disabled={actionLoadingId === f.id}
                              >
                                {actionLoadingId === f.id ? <Spinner size="sm" animation="border" /> : "Delete"}
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
        </Tab>
      </Tabs>
    </div>
  );
}

export default DataAdmin;
