import express from 'express';

const resetpassword = require('../controllers/resetpassword/resetpassword');

const router = express.Router();

router.post('/', resetpassword);


export default router;