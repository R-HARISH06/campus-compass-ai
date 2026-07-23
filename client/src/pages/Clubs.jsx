import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Clubs() {
  const { user, token } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch(API_BASE_URL + "/clubs")
      .then(res => res.json())
      .then(data => {
        setClubs(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

    if (user && token) {
      fetch(API_BASE_URL + "/clubs/mine", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMyClubs(data.map(c => c.id)))
      .catch(err => console.log(err));
    }
  }, [user, token]);

  const handleJoin = async (club) => {
    if (!user) return;
    setLoadingId(club.id);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${club.id}/join`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to join");
      setMyClubs([...myClubs, club.id]);
      setMsg({ type: "success", text: `Joined ${club.name} successfully!` });
    } catch (err) {
      setMsg({ type: "danger", text: "Error joining club." });
    } finally {
      setLoadingId(null);
    }
  };

  const handleLeave = async (club) => {
    if (!user) return;
    setLoadingId(club.id);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${club.id}/leave`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to leave");
      setMyClubs(myClubs.filter(id => id !== club.id));
      setMsg({ type: "success", text: `Left ${club.name}.` });
    } catch (err) {
      setMsg({ type: "danger", text: "Error leaving club." });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h1 className="display-5 fw-bold mb-4 gradient-text animate-fade-in-up" style={{fontFamily: 'Outfit'}}>
        🎓 Student Clubs
      </h1>
      {msg.text && <Alert variant={msg.type} onClose={() => setMsg({ type: "", text: "" })} dismissible>{msg.text}</Alert>}

      <div className="row g-4">
        {loading ? (
          [1, 2, 3, 4].map(idx => (
            <div key={idx} className="col-md-6">
              <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between skeleton-loader">
                <div>
                  <div style={{ height: '24px', width: '60%', marginBottom: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '100%', marginBottom: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '80%', marginBottom: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '60%', marginBottom: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '50%', marginBottom: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '55%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                </div>
                <div className="mt-4 text-end">
                  <div style={{ height: '32px', width: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'inline-block' }}></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          clubs.map((club, index) => (
            <div key={club.id} className="col-md-6">
              <div 
                className={"glass-card h-100 animate-fade-in-up delay-" + ((index % 4) + 1)}
                style={{ 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(176, 38, 255, 0.05)',
                  border: '1px solid rgba(176, 38, 255, 0.1)'
                }}
              >
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h2 className="card-title h4 fw-bold" style={{fontFamily: 'Outfit', color: 'var(--secondary-accent)'}}>
                      {club.name}
                    </h2>
                    <p className="card-text text-light mt-3 opacity-75">
                      {club.description}
                    </p>
                    <div className="d-flex flex-column gap-2 mt-4 p-3 rounded-3" style={{background: 'rgba(11, 14, 20, 0.4)', border: '1px solid rgba(255,255,255,0.05)'}}>
                      <div className="mb-0 text-muted small"><strong className="text-light"><i className="bi bi-person-badge-fill me-1" style={{color: 'var(--primary-accent)'}}></i> Faculty:</strong> {club.faculty_coordinator}</div>
                      <div className="mb-0 text-muted small"><strong className="text-light"><i className="bi bi-calendar-event-fill me-1" style={{color: 'var(--tertiary-accent)'}}></i> Meeting:</strong> {club.meeting_day}</div>
                      <div className="mb-0 text-muted small"><strong className="text-light"><i className="bi bi-envelope-fill me-1 text-info"></i> Email:</strong> <a href={"mailto:" + club.contact_email} className="text-decoration-none text-info">{club.contact_email}</a></div>
                    </div>
                  </div>
                  {user && (
                    <div className="mt-4 text-end">
                      {myClubs.includes(club.id) ? (
                        <Button
                          variant="outline-danger"
                          className="px-4 fw-bold"
                          style={{boxShadow: '0 0 10px rgba(255, 51, 102, 0.2)'}}
                          disabled={loadingId === club.id}
                          onClick={() => handleLeave(club)}
                        >
                          {loadingId === club.id ? <Spinner size="sm" animation="border" /> : "Leave Club"}
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="px-4 text-white shadow-sm fw-bold"
                          style={{background: 'linear-gradient(135deg, var(--secondary-accent), var(--primary-accent))', border: 'none'}}
                          disabled={loadingId === club.id}
                          onClick={() => handleJoin(club)}
                        >
                          {loadingId === club.id ? <Spinner size="sm" animation="border" /> : "Join Club ✨"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>

  );

}



export default Clubs;