import express from 'express';
import { createMessage, deleteMessage, getByRoomid, getByUserid, getMessageCount, updateMessage } from '../controllers/messageControllers.js';
import checkValidId from '../middlewares/checkValidId.js';
import {authenticate ,authorizeAdmin} from '../middlewares/authMiddleware.js'


const router = express.Router();

router.post('/',createMessage)
router.get('/user/:id',checkValidId,getByUserid)
router.get('/count',authenticate,authorizeAdmin,getMessageCount)
router.get('/:id',checkValidId,getByRoomid)
router.put('/:id',checkValidId,updateMessage)
router.delete('/:id',checkValidId,deleteMessage)




export default router;