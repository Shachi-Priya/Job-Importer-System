const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const importRoutes = require('./routes/importRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/import', importRoutes);

module.exports = app;
