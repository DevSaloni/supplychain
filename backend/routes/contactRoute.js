const express = require("express");
const {createContact} = require("../controllers/ContactController");

const router = express.Router();

//post request
router.post("/contact", createContact);

module.exports = router;
