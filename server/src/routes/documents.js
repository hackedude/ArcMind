import { Router } from 'express';
import { upload, list, getOne, remove } from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';
import { upload as uploadMiddleware } from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/upload', uploadMiddleware.single('file'), upload);
router.get('/:id', getOne);
router.delete('/:id', remove);

export default router;
