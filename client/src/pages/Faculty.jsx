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

  const getAvatar = (name) => {
    const n = name.toLowerCase();
    
    // Simple hash function to deterministically assign an avatar based on name
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const renderImage = (src) => (
      <img 
        src={src} 
        alt="Faculty" 
        className="rounded-circle shadow-sm mb-3" 
        style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.1)' }} 
      />
    );

    const maleImages = ["/images/faculty_male.png", "/images/faculty_male_2.png", "/images/faculty_male_3.png"];
    const femaleImages = ["/images/faculty_female.png", "/images/faculty_female_2.png", "/images/faculty_female_3.png"];
    
    const getMaleImg = () => maleImages[hash % maleImages.length];
    const getFemaleImg = () => femaleImages[hash % femaleImages.length];

    if (n.startsWith("mr.")) return renderImage(getMaleImg());
    if (n.startsWith("ms.") || n.startsWith("mrs.")) return renderImage(getFemaleImg());
    
    // Simple heuristic for Dr. names in our dataset
    const femaleNames = ['punitha', 'senthamil', 'mohana', 'rajalakshmi', 'rachel', 'maria', 'shapna', 'roshini', 'sathya', 'parkavi', 'mohanappriya', 'ramya', 'rohini', 'sugantha', 'nagalakshmi', 'kavitha', 'revathi', 'geetha', 'nandhini', 'sandhya', 'meena', 'swathi', 'vimala', 'priya', 'lakshmi', 'divya', 'anitha', 'delphin'];
    for (let fn of femaleNames) {
      if (n.includes(fn)) return renderImage(getFemaleImg());
    }
    return renderImage(getMaleImg()); // default
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="text-center mb-5 animate-fade-in-up">
        <h1 className="display-5 fw-bold gradient-text">Faculty Directory</h1>
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
        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <div className="row g-4">
          {faculty.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div className={`card text-center h-100 py-4 hover-scale animate-fade-in-up delay-${(index % 4) + 1}`}>
              <div className="card-body">
                <div className="display-4 mb-3">{getAvatar(item.name)}</div>
                <h2 className="card-title h4 fw-bold">{item.name} {item.is_hod ? "⭐ (HOD)" : ""}</h2>
                <p className="text-muted mb-1"><strong className="text-light">Department:</strong> {item.department}</p>
                <p className="text-muted mb-1"><strong className="text-light">Designation:</strong> {item.designation}</p>
                <p className="text-muted mb-3"><strong className="text-light">Qualification:</strong> {item.qualification}</p>
                <a href={`mailto:${item.email}`} className="text-decoration-none text-primary mb-3 d-block">{item.email}</a>
                <button 
                  className="btn btn-primary mt-2 w-100"
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
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>{selectedFaculty?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedFaculty && (
            <div>
              <div className="text-center mb-4">
                <div className="display-1 mb-2">{getAvatar(selectedFaculty.name)}</div>
                <h4 className="fw-bold gradient-text">{selectedFaculty.designation}</h4>
                <p className="text-muted">{selectedFaculty.department} Department {selectedFaculty.is_hod ? "• HOD" : ""}</p>
              </div>
              
              <ul className="list-group list-group-flush bg-dark text-white">
                <li className="list-group-item bg-dark text-white border-secondary">
                  <strong>🎓 Qualification:</strong> {selectedFaculty.qualification}
                </li>
                <li className="list-group-item bg-dark text-white border-secondary">
                  <strong>📧 Email:</strong> <a href={`mailto:${selectedFaculty.email}`} className="text-decoration-none text-primary">{selectedFaculty.email}</a>
                </li>
                {selectedFaculty.experience && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>👨‍💼 Experience:</strong> {selectedFaculty.experience}
                  </li>
                )}
                {selectedFaculty.education_history && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>🎓 Education History:</strong> <br/> 
                    <span style={{ whiteSpace: "pre-line" }}>{selectedFaculty.education_history}</span>
                  </li>
                )}
                {selectedFaculty.area_of_expertise && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>🧠 Area of Expertise:</strong> {selectedFaculty.area_of_expertise}
                  </li>
                )}
                {selectedFaculty.projects && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>🚀 Notable Projects / Research:</strong> <br/>
                    <span style={{ whiteSpace: "pre-line" }}>{selectedFaculty.projects}</span>
                  </li>
                )}
                {selectedFaculty.room_no && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>🏢 Room No:</strong> {selectedFaculty.room_no}
                  </li>
                )}
                {selectedFaculty.office_hours && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>🕒 Office Hours:</strong> {selectedFaculty.office_hours}
                  </li>
                )}
                {selectedFaculty.subjects_handled && (
                  <li className="list-group-item bg-dark text-white border-secondary">
                    <strong>📚 Subjects Handled:</strong> {selectedFaculty.subjects_handled}
                  </li>
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Faculty;