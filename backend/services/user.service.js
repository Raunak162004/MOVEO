const User = require("../models/user.model");


module.exports.createUser = ({firstname, lastname, email, password}) => {
    if(!firstname || !email || !password) {
        throw new Error("All fields are required");
    }
    
    const createdUser = User.create({fullname: {firstname, lastname}, email, password})
    return createdUser;
}