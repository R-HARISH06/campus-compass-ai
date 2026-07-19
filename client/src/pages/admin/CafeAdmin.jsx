import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Spinner, Badge } from "react-bootstrap";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

function CafeAdmin() {
  const { token } = useAuth();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, item_name: "", item_type: "lunch", price: "", is_available: true });

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cafe/menu`);
      const data = await res.json();
      setMenu(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const isEditing = !!formData.id;
    const url = isEditing ? `${API_BASE_URL}/cafe/menu/${formData.id}` : `${API_BASE_URL}/cafe/menu`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, price: Number(formData.price) })
      });
      if (res.ok) {
        setShowModal(false);
        fetchMenu();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cafe/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cafe/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...item, is_available: !item.is_available })
      });
      if (res.ok) fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h3>Cafe & Canteen Management</h3>
        <Button variant="success" onClick={() => { setFormData({ id: null, item_name: "", item_type: "lunch", price: "", is_available: true }); setShowModal(true); }}>
          + Add Menu Item
        </Button>
      </div>
      
      <Table variant="dark" hover responsive>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id}>
              <td>{item.item_name}</td>
              <td><Badge bg="secondary">{item.item_type}</Badge></td>
              <td>₹{item.price}</td>
              <td>
                <Button variant={item.is_available ? "outline-success" : "outline-danger"} size="sm" onClick={() => toggleAvailability(item)}>
                  {item.is_available ? "Available" : "Sold Out"}
                </Button>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => { setFormData(item); setShowModal(true); }}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} variant="dark">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>{formData.id ? "Edit Item" : "Add Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control type="text" required value={formData.item_name} onChange={e => setFormData({...formData, item_name: e.target.value})} className="bg-secondary text-white border-0" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select value={formData.item_type} onChange={e => setFormData({...formData, item_type: e.target.value})} className="bg-secondary text-white border-0">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snacks">Snacks</option>
                <option value="beverage">Beverage</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-secondary text-white border-0" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Save Item</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CafeAdmin;
