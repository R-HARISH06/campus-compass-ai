import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Clubs() {
  const { user, token } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch(API_BASE_URL + "/clubs")
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.log(err));

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

      <h1 className="display-5 fw-bold mb-4 gradient-text animate-fade-in-up">

        🎓 Student Clubs

      </h1>

      {msg.text && <Alert variant={msg.type} onClose={() => setMsg({ type: "", text: "" })} dismissible>{msg.text}</Alert>}

      <div className="row g-4">

        {clubs.map((club, index) => (

          <div key={club.id} className="col-md-6">

            <div className={"card h-100 animate-fade-in-up delay-" + ((index % 4) + 1)}>

              <div className="card-body p-4">

                <h2 className="card-title h4 fw-bold">

                  {club.name}

                </h2>

                <p className="card-text text-muted mt-3">

                  {club.description}

                </p>

                <ul className="list-unstyled mb-0 text-muted">

                  <li className="mb-2"><strong className="text-light">👨‍🏫 Faculty:</strong> {club.faculty_coordinator}</li>

                  <li className="mb-2"><strong className="text-light">📅 Meeting:</strong> {club.meeting_day}</li>

                  <li><strong className="text-light">📧 Email:</strong> <a href={"mailto:" + club.contact_email} className="text-decoration-none text-primary">{club.contact_email}</a></li>

                </ul>

                {user && (
                  <div className="mt-4 text-end">
                    {myClubs.includes(club.id) ? (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={loadingId === club.id}
                        onClick={() => handleLeave(club)}
                      >
                        {loadingId === club.id ? <Spinner size="sm" animation="border" /> : "Leave Club"}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={loadingId === club.id}
                        onClick={() => handleJoin(club)}
                      >
                        {loadingId === club.id ? <Spinner size="sm" animation="border" /> : "Join Club"}
                      </Button>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}



export default Clubs;