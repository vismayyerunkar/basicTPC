import express from 'express';

import { addIntrest, addResultLink, addTestLink, apply, changeJobExamStatus, createJob, getAllJobs, getApplications } from "../controllers/JobController.js";
import { checkAuth } from "../middlewares/UserMiddleWare.js";
const router = express.Router();


router.post('/createJob',checkAuth,createJob);
router.get('/getJobs',checkAuth,getAllJobs);
router.post('/getApplications',checkAuth,getApplications);
router.post('/apply',checkAuth,apply);
router.post('/addIntrest',checkAuth,addIntrest);
router.post('/addResultLink',checkAuth,addResultLink);
router.post('/addTestLink',checkAuth,addTestLink);
router.post('/changeJobExamStatus',checkAuth,changeJobExamStatus);

export default router;
