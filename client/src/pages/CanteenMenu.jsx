import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Spinner, Badge } from "react-bootstrap";
import "./Canteen.css";

function CanteenMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API_BASE_URL}/cafe/menu`)
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load menu", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container text-center h-100 d-flex justify-content-center align-items-center position-relative page-wrapper" >
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  const filteredMenu = filter === "all" ? menu : menu.filter(item => item.item_type === filter);

  return (
    <div className="container position-relative page-wrapper" >
      <div className="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h1 className="fw-bold gradient-text" style={{fontFamily: 'Outfit'}}><i className="bi bi-cup-hot-fill me-2" style={{color: 'var(--tertiary-accent)'}}></i> Campus Canteen Menu</h1>
      </div>
      
      <p className="text-muted animate-fade-in-up">Freshly prepared meals and snacks for students and faculty. Don't worry about lunch, we've got you covered!</p>

      {/* Filter Tabs */}
      <ul className="nav nav-pills mb-4 animate-fade-in-up delay-1 custom-pills">
        <li className="nav-item">
          <button className={`nav-link ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All Items</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${filter === "breakfast" ? "active" : ""}`} onClick={() => setFilter("breakfast")}>Breakfast</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${filter === "lunch" ? "active" : ""}`} onClick={() => setFilter("lunch")}>Lunch</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${filter === "snacks" ? "active" : ""}`} onClick={() => setFilter("snacks")}>Snacks</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${filter === "beverage" ? "active" : ""}`} onClick={() => setFilter("beverage")}>Beverages</button>
        </li>
      </ul>

      <div className="row g-4 animate-fade-in-up delay-2">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="col-md-4 col-lg-3">
              <div className="glass-card h-100 p-4 d-flex flex-column skeleton-loader">
                <div style={{ height: '24px', width: '70%', marginBottom: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div style={{ height: '20px', width: '40%', marginBottom: 'auto', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div className="mt-4 border-top border-secondary pt-3">
                  <div style={{ height: '28px', width: '50%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredMenu.length === 0 ? (
          <div className="col-12">
            <div className="alert glass-card text-center text-white border-0">
              No items available in this category at the moment.
            </div>
          </div>
        ) : (
          filteredMenu.map(item => (
            <div key={item.id} className="col-md-4 col-lg-3">
              <div 
                className={`glass-card h-100 menu-card hover-scale ${!item.is_available ? 'opacity-50' : ''}`}
                style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.1)', background: 'rgba(11, 14, 20, 0.4)' }}
              >
                <div className="card-body d-flex flex-column p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0" style={{fontFamily: 'Outfit', color: 'var(--primary-accent)'}}>{item.item_name}</h5>
                    {item.is_available ? (
                      <Badge bg="success" className="shadow-sm">Available</Badge>
                    ) : (
                      <Badge bg="danger" className="shadow-sm">Sold Out</Badge>
                    )}
                  </div>
                  <Badge className="mb-3 align-self-start border-0 text-dark" style={{background: 'var(--secondary-accent)'}}>{item.item_type.toUpperCase()}</Badge>
                  
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top" style={{borderColor: 'rgba(255,255,255,0.05) !important'}}>
                    <span className="fs-4 fw-bold" style={{fontFamily: 'Outfit', color: 'var(--tertiary-accent)'}}>₹{Number(item.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CanteenMenu;
