
import express from "express";
import { createUser } from "../controllers/createUser.js";
import loginUser from "../controllers/loginUser.js";
import logoutUser from "../controllers/logoutuser.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import allUsers from "../controllers/allUsers.js";
import userProfile from "../controllers/userprofile.js";
import updateUser from "../controllers/updateuser.js";
import deleteUser from "../controllers/deleteUser.js";
import checkValidId from "../middlewares/checkValidId.js";
import getUserCount from "../controllers/getUserCount.js";


const router = express.Router();

router.post('/',createUser)
router.get('/',authenticate,authorizeAdmin,allUsers)
router.post('/auth',loginUser)
router.post('/logout',logoutUser)
router.get('/count',authenticate,authorizeAdmin,getUserCount)
router.get('/profile' ,authenticate, userProfile)
router.put('/profile' ,authenticate, updateUser)
router.delete('/delete',authenticate,deleteUser)

router.delete('/delete/:id',authenticate,authorizeAdmin,checkValidId,deleteUser)





export default router;