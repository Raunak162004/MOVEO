const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    const { firstname, lastname } = req.body.fullname;
    const {email, password } = req.body;

    try{
        const user = await userService.createUser({ firstname, lastname, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}