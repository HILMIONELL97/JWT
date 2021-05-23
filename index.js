const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const passport = require('passport');

//Config App
require('dotenv').config();
require('./config/db');
const app = express();

// CORS Handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

//Middlewares
app.use(express.json());
app.use(cors());
app.use(expressValidator());
if (process.env.NODE_ENV === 'developpement') app.use(morgan());

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

// Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is running on port ${port}`));