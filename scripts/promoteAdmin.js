const db = require('../server/config/db');

// Simple script to promote a user to admin role based on email
const email = process.argv[2];
if (!email) {
  console.error('Usage: node promoteAdmin.js <email>');
  process.exit(1);
}

db.query('UPDATE users SET role = ? WHERE email = ?', ['admin', email])
  .then(([result]) => {
    if (result.affectedRows === 0) {
      console.log('No user found with that email.');
    } else {
      console.log(`User ${email} promoted to admin.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error promoting user:', err);
    process.exit(1);
  });
