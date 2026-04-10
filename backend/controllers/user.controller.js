const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlackList = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    // console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.body);
    const { firstname, lastname } = req.body.fullname;
    const {email, password } = req.body;

    try{
        const user = await userService.createUser({ firstname, lastname, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.loginUser = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "24h"});

    res.cookie("token", token)

    res.status(200).json({token, user});
}

module.exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req,res) => {
    res.clearCookie("token");

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await BlackList.create({token});

    res.status(200).json({message: "Logged out successfully"});
}