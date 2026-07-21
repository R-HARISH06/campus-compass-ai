import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Alert, Card } from "react-bootstrap";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

function ClubAdmin() {
  const { token } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClubsAndRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/clubs`);
      const allClubs = await res.json();
      setClubs(allClubs); // The backend needs to only return clubs where admin_id matches, but since I didn't change GET /clubs to filter by admin_id for club admins yet, I'll filter on frontend or just assume master admin sees all. Wait, I should just fetch requests for each club.
      
      const reqMap = {};
      for (const club of allClubs) {
        const rRes = await fetch(`${API_BASE_URL}/clubs/${club.id}/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (rRes.ok) {
          const reqData = await rRes.json();
          if (reqData.length > 0) reqMap[club.id] = reqData;
        }
      }
      setRequests(reqMap);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load club requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchClubsAndRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequest = async (clubId, userId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${clubId}/requests/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchClubsAndRequests(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  const clubsWithRequests = clubs.filter(c => requests[c.id]);

  return (
    <div>
      <h3 className="mb-4">Club Join Requests</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {clubsWithRequests.length === 0 ? (
        <Alert variant="info" className="bg-dark text-white border-secondary">You have no pending requests.</Alert>
      ) : (
        clubsWithRequests.map(club => (
          <Card key={club.id} className="mb-4 border-0 shadow-sm bg-dark text-white">
            <Card.Header className="border-secondary bg-dark">
              <h5 className="mb-0 text-warning">{club.name} Pending Requests</h5>
            </Card.Header>
            <Card.Body>
              <Table variant="dark" hover responsive>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Dept & Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests[club.id].map(req => (
                    <tr key={req.id}>
                      <td>{req.name}</td>
                      <td>{req.email}</td>
                      <td>{req.department} - {req.year}</td>
                      <td>
                        <Button variant="success" size="sm" className="me-2" onClick={() => handleRequest(club.id, req.id, 'approved')}>Approve</Button>
                        <Button variant="danger" size="sm" onClick={() => handleRequest(club.id, req.id, 'rejected')}>Reject</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default ClubAdmin;
