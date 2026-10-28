import { Router } from 'express';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  togglePin,
} from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  sendMessageSchema,
  editMessageSchema,
  addReactionSchema,
} from '../validators/chat.validator.js';

const router = Router();

router.get('/conversations/:id/messages', authenticate, getMessages);
router.post('/conversations/:id/messages', authenticate, validateBody(sendMessageSchema), sendMessage);
router.patch('/messages/:id', authenticate, validateBody(editMessageSchema), editMessage);
router.delete('/messages/:id', authenticate, deleteMessage);
router.post('/messages/:id/reactions', authenticate, validateBody(addReactionSchema), toggleReaction);
router.post('/messages/:id/pin', authenticate, togglePin);

export default router;
