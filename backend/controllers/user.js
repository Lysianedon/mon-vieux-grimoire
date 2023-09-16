const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//------------ MODELS -----------------//
const User = require("../models/User");

exports.signup = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error});
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(401)
                .json({ error: "email and/or password incorrect(s)" });
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);

        if (!isValid) {
            return res
                .status(401)
                .json({ error: "email and/or password incorrect(s)" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "24h"
        });

        res.status(200).json({
            userId: user._id,
            token
        });
    } catch (error) {
        res.status(500).json({error});
    }
};
