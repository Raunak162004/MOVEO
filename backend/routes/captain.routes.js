const express = require("express");
const {body} = require("express-validator");
const { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain } = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post('/register', [
    body('email').isEmail().isLength({min: 5}).withMessage('Email must be at least 5 characters long'),
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characters long'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be car, motorcycle or auto')
], registerCaptain);

router.post('/login', [
    body('email').isEmail().isLength({min: 5}).withMessage('Email must be at least 5 characters long'),
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characters long')
], loginCaptain)

router.get("/profile", authMiddleware.authCaptain, getCaptainProfile);

router.get("/logout", authMiddleware.authCaptain, logoutCaptain);

module.exports = router;