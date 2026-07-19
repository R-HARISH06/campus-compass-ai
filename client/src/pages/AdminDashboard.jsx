import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Tabs, Tab } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import CafeAdmin from "./admin/CafeAdmin";
import ClubAdmin from "./admin/ClubAdmin";
import AnnouncementAdmin from "./admin/AnnouncementAdmin";
import EventAdmin from "./admin/EventAdmin";
import DataAdmin from "./admin/DataAdmin";

function AdminDashboard() {
  const { token, user: currentUser } = useAuth();
  const [stats, setStats] = useState({ totalEvents: 0, totalClubs: 0, totalUsers: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = { Authorization: `Bearer ${token}` };

        if (currentUser?.role === "master_admin") {
          // Fetch stats
          const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
          if (!statsRes.ok) throw new Error("Failed to load statistics.");
          const statsData = await statsRes.json();
          setStats(statsData);

          // Fetch users list
          const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
          if (!usersRes.ok) throw new Error("Failed to load users list.");
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    setActionLoadingId(userId);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove user.");
      }

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      setStats((prevStats) => ({
        ...prevStats,
        totalUsers: prevStats.totalUsers - 1
      }));
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update role.");
      }
    } catch (err) {
      setError("Failed to update role.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" className="mt-5" />
        <p className="mt-2 text-muted">Loading Dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <Row className="mb-4 animate-fade-in-up">
        <Col>
          <h2 className="fw-bold gradient-text">Admin Dashboard</h2>
          <p className="text-muted">Manage events, clubs, and users.</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="py-2 mb-4">
          {error}
        </Alert>
      )}

      {currentUser?.role === "master_admin" && (
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 animate-fade-in-up delay-1 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="display-4 fw-bold text-primary">{stats.totalEvents}</h3>
                <p className="text-muted fw-bold mb-0">Total Events</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 animate-fade-in-up delay-2 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="display-4 fw-bold text-success">{stats.totalClubs}</h3>
                <p className="text-muted fw-bold mb-0">Active Clubs</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 animate-fade-in-up delay-3 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="display-4 fw-bold text-warning">{stats.totalUsers}</h3>
                <p className="text-muted fw-bold mb-0">Registered Users</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey={currentUser?.role === "master_admin" ? "master" : "data"} id="admin-tabs" className="mb-4 custom-pills" variant="pills">
        
        {currentUser?.role === "master_admin" && (
          <Tab eventKey="master" title="User Management">
            <Row className="animate-fade-in-up delay-4">
              <Col>
                <Card className="border-0 shadow-sm bg-dark text-white">
                  <Card.Header className="border-bottom-0 pt-4 pb-0 bg-dark">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="fw-bold mb-0 text-warning">User Management</h4>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table variant="dark" responsive hover className="mt-3 align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Department</th>
                          <th>Year</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.name}</td>
                            <td className="text-muted">{u.email}</td>
                            <td>
                              <select 
                                className="form-select form-select-sm bg-dark text-white border-secondary"
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                disabled={actionLoadingId === u.id || u.id === currentUser?.id}
                              >
                                <option value="student">student</option>
                                <option value="faculty">faculty</option>
                                <option value="club_admin">club_admin</option>
                                <option value="data_admin">data_admin</option>
                                <option value="cafe_owner">cafe_owner</option>
                                <option value="master_admin">master_admin</option>
                              </select>
                            </td>
                            <td className="text-muted">{u.department || "-"}</td>
                            <td className="text-muted">{u.year ? `${u.year} Yr` : "-"}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={u.id === currentUser?.id || actionLoadingId === u.id}
                                onClick={() => handleRemoveUser(u.id)}
                              >
                                {actionLoadingId === u.id ? "Removing..." : "Remove"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
                              No registered users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        )}

        {(currentUser?.role === "master_admin") && (
          <Tab eventKey="events" title="Event Maint.">
            <EventAdmin />
          </Tab>
        )}

        {(currentUser?.role === "master_admin") && (
          <Tab eventKey="announcements" title="Announcements">
            <AnnouncementAdmin />
          </Tab>
        )}

        {(currentUser?.role === "master_admin" || currentUser?.role === "club_admin") && (
          <Tab eventKey="clubs" title="Club Requests">
            <ClubAdmin />
          </Tab>
        )}

        {(currentUser?.role === "master_admin" || currentUser?.role === "data_admin") && (
          <Tab eventKey="data" title="Faculty Data">
            <DataAdmin />
          </Tab>
        )}

        {(currentUser?.role === "master_admin" || currentUser?.role === "cafe_owner" || currentUser?.role === "data_admin") && (
          <Tab eventKey="cafe" title="Canteen Menu">
            <CafeAdmin />
          </Tab>
        )}

      </Tabs>
    </Container>
  );
}

export default AdminDashboard;
