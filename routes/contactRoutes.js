const express = require("express");
const router = express.Router();
const {
    getContact,
    createContact,
    getContactbyid,
    deleteContact,
    editContact
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route('/').get(getContact);
router.route('/').post(createContact);
router.route('/:id').get(getContactbyid);
router.route('/:id').delete(deleteContact);
router.route('/:id').put(editContact);

module.exports = router;