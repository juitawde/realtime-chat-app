import fs from 'fs';
import { Response } from 'express';
import { User } from '../models/User.js';
import { Block } from '../models/Block.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { broadcastUserProfileUpdate } from '../sockets/index.js';

export async function searchUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const q = String(req.query.q || '').trim();
    const userId = req.user!.id;

    if (!q) {
      res.json({ users: [] });
      return;
    }

    // Get blocked users
    const blocks = await Block.find({
      $or: [{ blocker: userId }, { blocked: userId }],
    });
    const blockedIds = blocks.map((b) => (b.blocker.toString() === userId ? b.blocked.toString() : b.blocker.toString()));

    const users = await User.find({
      _id: { $nin: [...blockedIds, userId] },
      isSuspended: false,
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
      ],
    })
      .select('username displayName avatar statusMessage lastActive')
      .limit(20);

    const mappedUsers = users.map((u) => ({
      id: u._id.toString(),
      _id: u._id.toString(),
      username: u.username,
      displayName: u.displayName,
      avatar: u.avatar,
      statusMessage: u.statusMessage,
      lastActive: u.lastActive,
    }));

    res.json({ users: mappedUsers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users.' });
  }
}

export async function blockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    if (id === userId) {
      res.status(400).json({ error: 'Cannot block yourself.' });
      return;
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    await Block.findOneAndUpdate(
      { blocker: userId, blocked: id },
      { blocker: userId, blocked: id },
      { upsert: true }
    );

    res.json({ message: 'User blocked successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block user.' });
  }
}

export async function unblockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await Block.deleteOne({ blocker: userId, blocked: id });
    res.json({ message: 'User unblocked successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user.' });
  }
}

export async function getBlockedUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const blocks = await Block.find({ blocker: userId }).populate('blocked', 'username displayName avatar');
    const blockedUsers = blocks.map((b) => b.blocked);
    res.json({ blockedUsers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blocked users.' });
  }
}

export async function updateAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Please select an image file to upload.' });
      return;
    }
    const userId = req.user!.id;
    let fileUrl = `/uploads/${req.file.filename}`;
    if (req.file.path && fs.existsSync(req.file.path) && req.file.size < 3 * 1024 * 1024) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const mime = req.file.mimetype || 'image/jpeg';
        fileUrl = `data:${mime};base64,${fileBuffer.toString('base64')}`;
      } catch {
        fileUrl = `/uploads/${req.file.filename}`;
      }
    }
    const user = await User.findByIdAndUpdate(userId, { avatar: fileUrl }, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    broadcastUserProfileUpdate({ userId, displayName: user.displayName, avatar: user.avatar });
    res.json({
      message: 'Profile picture updated successfully.',
      avatarUrl: fileUrl,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        statusMessage: user.statusMessage,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile picture.' });
  }
}

export async function removeAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await User.findByIdAndUpdate(userId, { avatar: '' }, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    broadcastUserProfileUpdate({ userId, displayName: user.displayName, avatar: '' });
    res.json({
      message: 'Profile picture removed. Reverted to initial avatar.',
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: '',
        statusMessage: user.statusMessage,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove profile picture.' });
  }
}
