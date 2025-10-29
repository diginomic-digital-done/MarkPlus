const bcrypt = require('bcrypt');

const password = 'securepassword'; // Replace with the actual plain text password
bcrypt.hash(password, 10).then((hash) => {
  console.log('Hashed Password:', hash);
});