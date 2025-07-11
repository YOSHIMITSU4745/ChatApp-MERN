import express from 'express'
import { createRoom } from '../controllers/createRoom.js';
import getRooms from '../controllers/getRooms.js';
import updateRoom from '../controllers/updateRoom.js';
import getRoom from '../controllers/getRoom.js';
import deleteRoom from '../controllers/deleteRoom.js';
import searchRooms from '../controllers/searchRooms.js';
import {authenticate ,authorizeAdmin} from '../middlewares/authMiddleware.js'
import getJoinedRooms from '../controllers/getJoinedRooms.js';
import removeParticipant from '../controllers/removeParticipant.js';
import checkValidId from '../middlewares/checkValidId.js';
import getRoomCount from '../controllers/getRoomCount.js';


const router = express.Router();

router.get('/search',authenticate,searchRooms)
router.get('/joinedrooms',authenticate,getJoinedRooms)
router.get('/count',authenticate,authorizeAdmin,getRoomCount)
router.put('/updateparticipant/:name',authenticate,removeParticipant)

router.post('/',createRoom)
router.get('/',getRooms)
router.put('/:id',checkValidId,updateRoom)
router.get('/:id',checkValidId,getRoom)
router.delete('/:id',checkValidId,deleteRoom)

export default router;