const express = require('express');
    const path = require('path');
    const fs = require('fs');
    const app = express();
    const port = 3000;

    // Add JSON body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '.')));

    const dbFilePath = path.join(__dirname, 'db.json');

    // Ensure db.json exists
    if (!fs.existsSync(dbFilePath)) {
      fs.writeFileSync(dbFilePath, JSON.stringify([]));
    }

    // Read users from JSON file
    function readUsers() {
      try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        console.log('Read users data:', data);
        return JSON.parse(data);
      } catch (err) {
        console.error('Error reading users:', err);
        return [];
      }
    }

    // Write users to JSON file
    function writeUsers(users) {
      try {
        const jsonData = JSON.stringify(users, null, 2);
        fs.writeFileSync(dbFilePath, jsonData);
        console.log('Users written to file:', jsonData);
      } catch (err) {
        console.error('Error writing users:', err);
      }
    }

    // Serve main page
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });

    // Registration route
    app.post('/register', (req, res) => {
      console.log('Received registration request');
      console.log('Request body:', req.body);

      const { username, password, email, phone } = req.body;

      // Validate input
      if (!username || !password || !email || !phone) {
        return res.status(400).send('All fields are required');
      }

      const users = readUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }

      // Create new user
      const newUser = { username, password, email, phone };
      users.push(newUser);

      // Write updated users to file
      writeUsers(users);

      console.log('User registered successfully:', newUser);
      res.status(201).send('Registration successful');
    });

    // Login route
    app.post('/login', (req, res) => {
      console.log('Login attempt:', req.body);

      const { username, password } = req.body;
      const users = readUsers();

      console.log('Registered users:', users);

      const user = users.find(u => 
        u.username === username && u.password === password
      );

      if (user) {
        console.log('Login successful for user:', username);
        res.redirect('/dashboard');
      } else {
        console.log('Login failed for user:', username);
        res.status(401).send('Invalid credentials');
      }
    });

    // Dashboard route
    app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'dashboard.html'));
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
