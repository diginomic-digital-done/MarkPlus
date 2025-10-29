const bcrypt = require('bcrypt');

const plainPassword = 'securepassword'; // Replace with the plain text password
const hashFromDB = '$2b$10$OVyzf9pDu4qHg9zrqtdJjuyavgfBWtpbF7Pt3ss6m4sHKfKhMRVt6'; // Replace with the hash from the database

bcrypt.compare(plainPassword, hashFromDB).then((result) => {
  console.log('Comparison Result:', result);
}).catch((error) => {
  console.error('Error during comparison:', error);
});