import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom Icon for special locations
const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41]
});

// Saranathan College Coordinates
const centerPosition = [10.7589, 78.6534];

// Key Locations (approximate relative to center)
const locations = [
  { 
    id: 1, 
    name: "Main Block (Admin & ECE)", 
    pos: [10.75885, 78.65345], 
    desc: "Principal Office, Admin, ECE Dept",
    polygon: [
      [10.7590, 78.6533], [10.7590, 78.6536], [10.7587, 78.6536], [10.7587, 78.6533]
    ],
    color: "blue"
  },
  { 
    id: 2, 
    name: "CSE/IT Block", 
    pos: [10.7592, 78.65305], 
    desc: "Computer Science & IT Departments",
    polygon: [
      [10.7593, 78.6529], [10.7593, 78.6532], [10.7591, 78.6532], [10.7591, 78.6529]
    ],
    color: "green"
  },
  { 
    id: 3, 
    name: "Central Library", 
    pos: [10.7586, 78.6538], 
    desc: "Reference books and reading halls",
    polygon: [
      [10.7587, 78.6537], [10.7587, 78.6539], [10.7585, 78.6539], [10.7585, 78.6537]
    ],
    color: "purple"
  },
  { 
    id: 4, 
    name: "College Canteen", 
    pos: [10.75845, 78.6531], 
    desc: "Fresh food and snacks!",
    polygon: [
      [10.7585, 78.6530], [10.7585, 78.6532], [10.7584, 78.6532], [10.7584, 78.6530]
    ],
    color: "orange"
  },
  { 
    id: 5, 
    name: "Boys Hostel", 
    pos: [10.7598, 78.6540], 
    desc: "Accommodation for boys",
    polygon: [
      [10.7599, 78.6539], [10.7599, 78.6541], [10.7597, 78.6541], [10.7597, 78.6539]
    ],
    color: "red"
  },
  { 
    id: 6, 
    name: "Girls Hostel", 
    pos: [10.7580, 78.6525], 
    desc: "Accommodation for girls",
    polygon: [
      [10.7581, 78.6524], [10.7581, 78.6526], [10.7579, 78.6526], [10.7579, 78.6524]
    ],
    color: "red"
  },
  { 
    id: 7, 
    name: "Sports Ground", 
    pos: [10.7575, 78.6545], 
    desc: "Football, Cricket, and Athletics",
    polygon: [
      [10.7578, 78.6542], [10.7578, 78.6548], [10.7572, 78.6548], [10.7572, 78.6542]
    ],
    color: "yellow"
  }
];

function CampusMap() {
  return (
    <div className="container mb-5 position-relative page-wrapper" >
      <div className="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h1 className="fw-bold gradient-text" style={{fontFamily: 'Outfit'}}><i className="bi bi-geo-alt-fill me-2" style={{color: 'var(--tertiary-accent)'}}></i> Campus Map</h1>
      </div>
      
      <p className="text-muted mb-4 animate-fade-in-up">
        Navigate through Saranathan College of Engineering, Panchapur, Trichy. Use this interactive map to find departments, hostels, and the canteen.
      </p>

      <div className="glass-card border-0 shadow-lg animate-fade-in-up delay-1 overflow-hidden" style={{ borderRadius: "20px", boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
        <div style={{ height: "600px", width: "100%" }}>
          <MapContainer center={centerPosition} zoom={18} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            
            {/* Free OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Polygons for precise buildings */}
            {locations.map(loc => (
              <React.Fragment key={loc.id}>
                {loc.polygon && (
                  <Polygon 
                    positions={loc.polygon} 
                    pathOptions={{ color: loc.color, fillColor: loc.color, fillOpacity: 0.4 }} 
                  />
                )}
                <Marker position={loc.pos} icon={customIcon}>
                  <Popup>
                    <strong>{loc.name}</strong><br/>
                    <small className="text-muted">{loc.desc}</small>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default CampusMap;
