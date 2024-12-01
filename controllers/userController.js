const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
    const { username, useremail, userpassword } = req.body;
    if (!username || !useremail || !userpassword) {
        res.status(400);
        throw new Error("All Fields must be filled");
    };
    const userAvaliable = await Users.findOne({ useremail });
    if (userAvaliable) {
        res.status(400);
        throw new Error("The user already registered!!");
    };

    const hashedPassword = await bcrypt.hash(userpassword, 10);

    const user = await Users.create({
        username,
        useremail,
        userpassword: hashedPassword
    });

    if (user) {
        res.status(201).json({ id: user.userpassword, email: user.useremail })
    } else {
        res.status(400);
        throw new Error("User date is not valid");
    };
    res.json({ Message: "Register the user" });
});

const loginUser = asyncHandler(async (req, res) => {
    const { useremail, userpassword } = req.body;
    if (!useremail || !userpassword) {
        res.status(400);
        throw new Error("All Fields must be filled");
    };

    const user = await Users.findOne({ useremail });

    if (user && (await bcrypt.compare(userpassword, user.userpassword))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                useremail: user.useremail,
                id: user.id
            },
        }, process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or Password are wrong!!");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
})

module.exports = { registerUser, loginUser, currentUser };