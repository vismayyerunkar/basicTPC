import express from "express"
import {changePassword, forgotPassword, login, register, setPassword, verifyOtp} from "../controllers/UserController.js"
import { checkAuth } from "../middlewares/UserMiddleWare.js";
const router = express.Router();


router.post('/register',register);
router.post('/login',login);
router.post('/changePassword',checkAuth,changePassword);
router.post('/forgotPassword',forgotPassword);
router.post('/setPassword',setPassword);
router.post('/verifyOtp',verifyOtp);

export default router;

