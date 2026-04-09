const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./db/db');
const cookieParser = require('cookie-parser');


//routes
const userRoutes = require('./routes/user.routes');

const app = express();


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/v1/users', userRoutes);

module.exports = app;