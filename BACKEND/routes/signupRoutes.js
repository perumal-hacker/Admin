import express from "express";
const router = express.Router();
const  signupUser  = require('../controllers/signup/signup');

router.post('/signup', signupUser);

module.exports = router;
