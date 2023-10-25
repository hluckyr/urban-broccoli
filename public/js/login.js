
const mysql = require('mysql2/promise');

// create the connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'yourdatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    try {
      // get a connection from the pool
      const connection = await pool.getConnection();

      // execute the query
      const [rows, fields] = await connection.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

      // release the connection
      connection.release();

      if (rows.length > 0) {
        document.location.replace('/');
      } else {
        alert('Failed to log in.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to log in.');
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    try {
      // get a connection from the pool
      const connection = await pool.getConnection();

      // execute the query
      const [rows, fields] = await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);

      // release the connection
      connection.release();

      if (rows.affectedRows > 0) {
        document.location.replace('/');
      } else {
        alert('Failed to sign up.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to sign up.');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
  