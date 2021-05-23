const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const keys = require("../config/keys");



exports.create_user = async(req, res) => {


    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save().then(user => {

            const response = {
                message: `Created user successfully`,
                user: user
            }
            return res.status(201).json({ response });


        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


exports.login_user = async(req, res) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            keys.secretOrKey, {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            },
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


exports.getLoggedIn = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}