import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Spinner, Modal, Button } from "react-bootstrap";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    // Fetch departments
    fetch(API_BASE_URL + "/faculty/departments")
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (data.length > 0) {
          setSelectedDept(data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedDept) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/faculty?dept=${selectedDept}`)
      .then(res => res.json())
      .then(data => {
        setFaculty(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedDept]);

  const handleShowProfile = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="container position-relative page-wrapper" >
      <div className="text-center mb-5 animate-fade-in-up">
        <h1 className="display-5 fw-bold gradient-text" style={{fontFamily: 'Outfit'}}>Faculty Directory</h1>
        <p className="lead text-muted">Find your faculty members easily</p>
      </div>

      <div className="row mb-5 justify-content-center">
        <div className="col-md-6 text-center">
          <label className="text-light fw-bold mb-2">Select Department</label>
          <select 
            className="form-select bg-dark text-white border-secondary"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map(idx => (
            <div className="col-md-4" key={idx}>
              <div className="glass-card text-center h-100 py-4 skeleton-loader">
                <div className="card-body">
                  <div style={{ height: '28px', width: '70%', margin: '0 auto 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '50%', margin: '0 auto 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '60%', margin: '0 auto 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', width: '55%', margin: '0 auto 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '38px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-4">
          {faculty.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div 
              className={`glass-card text-center h-100 py-4 hover-scale animate-fade-in-up delay-${(index % 4) + 1}`}
              style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.1)' }}
            >
              <div className="card-body">
                <h2 className="card-title h4 fw-bold" style={{fontFamily: 'Outfit', color: 'var(--primary-accent)'}}>{item.name} {item.is_hod ? <span style={{color: 'var(--tertiary-accent)'}}>⭐ (HOD)</span> : ""}</h2>
                <div className="mt-4 p-3 rounded-3 text-start" style={{background: 'rgba(11, 14, 20, 0.4)', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <p className="text-muted mb-2 small"><strong className="text-light">Department:</strong> {item.department}</p>
                  <p className="text-muted mb-2 small"><strong className="text-light">Designation:</strong> {item.designation}</p>
                  <p className="text-muted mb-0 small"><strong className="text-light">Qualification:</strong> {item.qualification}</p>
                </div>
                <a href={`mailto:${item.email}`} className="text-decoration-none text-info mt-3 mb-4 d-block small">{item.email}</a>
                <button 
                  className="btn btn-primary mt-auto w-100 fw-bold shadow-sm"
                  style={{background: 'linear-gradient(135deg, var(--secondary-accent), var(--primary-accent))', border: 'none'}}
                  onClick={() => handleShowProfile(item)}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Faculty Profile Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered contentClassName="glass-card text-white border-secondary">
        <Modal.Header closeButton className="border-secondary" closeVariant="white">
          <Modal.Title style={{fontFamily: 'Outfit', color: 'var(--primary-accent)'}}>{selectedFaculty?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFaculty && (
            <div>
              <div className="text-center mb-4">
                <h4 className="fw-bold gradient-text" style={{fontFamily: 'Outfit'}}>{selectedFaculty.designation}</h4>
                <p className="text-muted">{selectedFaculty.department} Department {selectedFaculty.is_hod ? <span style={{color: 'var(--tertiary-accent)'}}>• HOD</span> : ""}</p>
              </div>
              
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent text-white border-secondary px-0">
                  <strong>🎓 Qualification:</strong> {selectedFaculty.qualification}
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary px-0">
                  <strong>📧 Email:</strong> <a href={`mailto:${selectedFaculty.email}`} className="text-decoration-none text-primary">{selectedFaculty.email}</a>
                </li>
                {selectedFaculty.experience && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>👨‍💼 Experience:</strong> {selectedFaculty.experience}
                  </li>
                )}
                {selectedFaculty.education_history && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>🎓 Education History:</strong> <br/> 
                    <span style={{ whiteSpace: "pre-line" }}>{selectedFaculty.education_history}</span>
                  </li>
                )}
                {selectedFaculty.area_of_expertise && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>🧠 Area of Expertise:</strong> {selectedFaculty.area_of_expertise}
                  </li>
                )}
                {selectedFaculty.projects && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>🚀 Notable Projects / Research:</strong> <br/>
                    <span style={{ whiteSpace: "pre-line" }}>{selectedFaculty.projects}</span>
                  </li>
                )}
                {selectedFaculty.room_no && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>🏢 Room No:</strong> {selectedFaculty.room_no}
                  </li>
                )}
                {selectedFaculty.office_hours && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>🕒 Office Hours:</strong> {selectedFaculty.office_hours}
                  </li>
                )}
                {selectedFaculty.subjects_handled && (
                  <li className="list-group-item bg-transparent text-white border-secondary px-0">
                    <strong>📚 Subjects Handled:</strong> {selectedFaculty.subjects_handled}
                  </li>
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Faculty;