import { Router } from 'express';
import { list, create, getOne, remove } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', create);
router.get('/:id', getOne);
router.delete('/:id', remove);

export default router;
