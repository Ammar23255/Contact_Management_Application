const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModel");
const { contacts } = require("../constants");

const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contacts.find({ user_id: req.user.id });
    res.status(200).json({ contacts });
});

const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is : ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All Fields must be filled");
    }
    const contact = await Contacts.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json({ message: `Create new contact for ${contact.name}` });
});

const getContactbyid = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("There is no contact");
    };
    res.status(201).json(contact);
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("There is no contact");
    };

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission");
    };

    await contact.deleteOne({ _id: req.params.id });

    res.status(200).json(`Deleted the contact for: ${contact.name}`);
});

const editContact = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("There is no contact");
    };

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission");
    };

    const updatedContact = await Contacts.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});

module.exports = {
    getContact,
    createContact,
    getContactbyid,
    deleteContact,
    editContact
};
