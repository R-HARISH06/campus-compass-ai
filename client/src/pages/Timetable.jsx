import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Spinner } from "react-bootstrap";

function Timetable() {
  const [departments] = useState(["CSE", "IT", "ECE", "EEE", "AIDS", "AIML", "MECH", "MBA"]);
  const [years] = useState([1, 2, 3, 4]);
  
  const [selectedDept, setSelectedDept] = useState("CSE");
  const [selectedYear, setSelectedYear] = useState(1);
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchTimetable();
  }, [selectedDept, selectedYear]);

  const fetchTimetable = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/timetable?dept=${selectedDept}&year=${selectedYear}`);
      if (!res.ok) throw new Error("Failed to fetch timetable data.");
      const data = await res.json();
      setTimetableData(data.timetable);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPeriod = (dayRecords, slotName) => {
    return dayRecords.find(p => p.time_slot === slotName);
  };

  return (
    <div className="container position-relative" style={{ paddingTop: '120px' }}>
      <div className="text-center mb-4 animate-fade-in-up">
        <h1 className="display-5 fw-bold gradient-text" style={{fontFamily: 'Outfit'}}>Weekly Timetable</h1>
        <p className="text-muted">Anna University (Regulation 2021) • 9:15 AM to 4:45 PM</p>
      </div>

      <div className="row justify-content-center mb-4 animate-fade-in-up delay-1">
        <div className="col-md-4 mb-3">
          <label className="text-light fw-bold mb-2">Department</label>
          <select 
            className="form-select bg-dark text-white border-secondary"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="text-light fw-bold mb-2">Year</label>
          <select 
            className="form-select bg-dark text-white border-secondary"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(yr => <option key={yr} value={yr}>Year {yr}</option>)}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Generating schedule...</p>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && timetableData && (
        <div className="table-responsive animate-fade-in-up delay-2 glass-card p-3" style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
          <table className="table table-borderless table-hover text-center align-middle text-white mb-0" style={{ minWidth: "1200px" }}>
            <thead className="border-bottom border-secondary">
              <tr>
                <th style={{ width: "100px" }} className="text-white">Day / Time</th>
                <th className="text-white">P1<br/><small className="text-muted">9:15 - 10:05</small></th>
                <th className="text-white">P2<br/><small className="text-muted">10:05 - 10:55</small></th>
                <th className="text-warning border-start border-end border-secondary" style={{ width: "60px", background: "rgba(255,255,255,0.02)" }}>Break<br/><small>15m</small></th>
                <th className="text-white">P3<br/><small className="text-muted">11:10 - 12:00</small></th>
                <th className="text-white">P4<br/><small className="text-muted">12:00 - 12:50</small></th>
                <th className="text-danger border-start border-end border-secondary" style={{ width: "80px", background: "rgba(255,255,255,0.02)" }}>Lunch<br/><small>45m</small></th>
                <th className="text-white">P5<br/><small className="text-muted">1:35 - 2:20</small></th>
                <th className="text-white">P6<br/><small className="text-muted">2:20 - 3:05</small></th>
                <th className="text-warning border-start border-end border-secondary" style={{ width: "60px", background: "rgba(255,255,255,0.02)" }}>Break<br/><small>10m</small></th>
                <th className="text-white">P7<br/><small className="text-muted">3:15 - 4:00</small></th>
                <th className="text-white">P8<br/><small className="text-muted">4:00 - 4:45</small></th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {daysOrder.map((day, idx) => {
                const dayRecords = timetableData[day] || [];
                return (
                  <tr key={day} className="border-bottom border-secondary">
                    <td className="fw-bold text-white border-end border-secondary" style={{ background: "rgba(255,255,255,0.02)" }}>{day}</td>
                    
                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 1')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 1')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 1')?.room}</small>
                    </td>
                    
                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 2')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 2')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 2')?.room}</small>
                    </td>

                    {idx === 0 && <td rowSpan="5" className="text-warning fw-bold align-middle border-start border-end border-secondary" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", background: "rgba(255,255,255,0.02)" }}>MORNING BREAK (10:55 - 11:10)</td>}

                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 3')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 3')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 3')?.room}</small>
                    </td>
                    
                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 4')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 4')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 4')?.room}</small>
                    </td>

                    {idx === 0 && <td rowSpan="5" className="text-danger fw-bold align-middle border-start border-end border-secondary" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", background: "rgba(255,255,255,0.02)" }}>LUNCH BREAK (12:50 - 1:35)</td>}

                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 5')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 5')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 5')?.room}</small>
                    </td>
                    
                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 6')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 6')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 6')?.room}</small>
                    </td>

                    {idx === 0 && <td rowSpan="5" className="text-warning fw-bold align-middle border-start border-end border-secondary" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", background: "rgba(255,255,255,0.02)" }}>EVENING BREAK (3:05 - 3:15)</td>}

                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 7')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 7')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 7')?.room}</small>
                    </td>
                    
                    <td className="p-2">
                      <div className="fw-bold text-info" style={{fontSize: "0.9rem"}}>{getPeriod(dayRecords, 'Period 8')?.subject || '-'}</div>
                      <small className="text-muted d-block">{getPeriod(dayRecords, 'Period 8')?.faculty_name}</small>
                      <small className="text-muted">{getPeriod(dayRecords, 'Period 8')?.room}</small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Timetable;
