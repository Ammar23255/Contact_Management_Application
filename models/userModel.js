const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the user name"]
    },
    useremail: {
        type: String,
        required: [true, "Please add the user email addres"],
        unique: [true, "Email address already taken"]
    },
    userpassword: {
        type: String,
        required: [true, "Please add the password"]
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Users", userSchema);