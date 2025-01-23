const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Ensure this path is correct
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('combined')); // Use Morgan for logging
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Sample movie data
let movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, genre: "Sci-Fi" },
    { id: 2, title: "The Godfather", director: "Francis Ford Coppola", year: 1972, genre: "Crime" },
    { id: 3, title: "The Dark Knight", director: "Christopher Nolan", year: 2008, genre: "Action" }
];

// User registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('Username already taken');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        username,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Invalid username or password');
    }

    // Check the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).send('Invalid username or password');
    }

    res.status(200).send('Login successful');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});