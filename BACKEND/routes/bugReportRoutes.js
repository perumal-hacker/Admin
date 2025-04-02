import express from "express";
import createBugReport from '../controllers/bugReport/bugReport.js';
import createContact from '../controllers/bugReport/contactUs.js';
import createFeedback from '../controllers/bugReport/feedback.js';
const router = express.Router();


router.post('/bug-reports', createBugReport);
router.post('/contact/:googleId', createContact);
router.post('/feedback', createFeedback);

export default router;