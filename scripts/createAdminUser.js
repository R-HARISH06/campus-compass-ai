const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const name = 'Test Admin';
const email = 'testadmin@example.com';
const password = 'AdminPass123'; // plain password
const role = 'admin';

(async () => {
  try {
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query('INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)', [name, email, hashed, role]);
    const user = { id: result.insertId, name, email, role };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Created admin user with ID', result.insertId);
    console.log('JWT token:', token);
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
})();
