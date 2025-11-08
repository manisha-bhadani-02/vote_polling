require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const pollRoutes = require('./routes/polls');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jwt-role-server';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/polls', pollRoutes);


app.get('/', (req, res) => res.send('JWT Role Server is running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
