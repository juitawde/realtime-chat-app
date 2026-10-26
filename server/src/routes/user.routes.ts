import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  searchUsers,
  blockUser,
  unblockUser,
  getBlockedUsers,
  updateAvatar,
  removeAvatar,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Configure Multer for attachments
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, safeName);
  },
});

const uploadAttachment = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for avatars
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

router.use(authenticate);

router.get('/search', searchUsers);
router.post('/avatar', uploadAvatar.single('avatar'), updateAvatar);
router.delete('/avatar', removeAvatar);
router.post('/:id/block', blockUser);
router.delete('/:id/block', unblockUser);
router.get('/blocked', getBlockedUsers);

router.post('/upload', uploadAttachment.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    name: req.file.originalname,
    url: fileUrl,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });
});

export default router;
