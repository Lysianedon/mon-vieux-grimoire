const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//------------ MODELS -----------------//
const User = require("../models/User");

exports.signup = (req,res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
    })
    .catch(error => res.status(500).json(error))
};

exports.login = (req,res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
            return res.status(401).json({error: true, message: "email and/or password incorrect(s)"})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(isValid => {
                if (!isValid) {
                    return res.status(401).json({error: true, message: "email and/or password incorrect(s)"})
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        {userId: user._id},
                        process.env.SECRET_KEY,
                        {expiresIn: '24h'}
                    )
                })
                
            })
            .catch(error => res.status(500).json(error))
        }
    })
    .catch(error => res.status(500).json(error))
};