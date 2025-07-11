import express from 'express'
import createTitle from '../controllers/createTitle.js';
import getAllTitles  from '../controllers/getAllTitles.js';
import { authenticate,authorizeAdmin } from '../middlewares/authMiddleware.js';
import updateTitle from '../controllers/updateTitle.js';
import deleteTitle from '../controllers/deleteTitle.js';
import checkValidId from '../middlewares/checkValidId.js';

const router = express.Router();

router.post('/',authenticate,authorizeAdmin,createTitle);
router.put('/:id',authenticate,authorizeAdmin,checkValidId,updateTitle);
router.delete('/:id',authenticate,authorizeAdmin,checkValidId,deleteTitle);
router.get('/',getAllTitles);

export default router;