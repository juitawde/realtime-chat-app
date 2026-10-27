import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { User } from '../models/User.js';

// Initialize Cloudinary if configured via environment variables
if (config.cloudinary?.isConfigured) {
  if (config.cloudinary.url) {
    cloudinary.config({ url: config.cloudinary.url });
  } else {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      secure: true,
    });
  }
  logger.info('✦ Storage service initialized with Cloudinary persistent object storage');
} else {
  logger.info(`✦ Storage service initialized with local disk storage (directory: ${config.uploadDir})`);
}

export interface StoredFileResult {
  url: string;
  storageType: 'cloudinary' | 'local';
  publicId?: string;
}

/**
 * Ensures the configured upload directory exists on disk.
 */
export function ensureUploadDirExists(): string {
  const dir = config.uploadDir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Saves an uploaded avatar image.
 * If Cloudinary is configured, uploads to Cloudinary and deletes the temporary file.
 * Otherwise, stores the file on local disk and returns the canonical relative path (/uploads/filename).
 */
export async function saveAvatar(file: Express.Multer.File): Promise<StoredFileResult> {
  if (config.cloudinary?.isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'chatterly/avatars',
        transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
      });

      // Remove temporary disk file after cloud upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        storageType: 'cloudinary',
      };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Failed to upload avatar to Cloudinary, falling back to local file');
    }
  }

  // Local / persistent disk storage
  return {
    url: `/uploads/${file.filename}`,
    storageType: 'local',
  };
}

/**
 * Saves an uploaded attachment (chat image, document, audio, video).
 * If Cloudinary is configured, uploads to Cloudinary and deletes the temporary file.
 * Otherwise, stores the file on local disk and returns the canonical relative path (/uploads/filename).
 */
export async function saveAttachment(file: Express.Multer.File): Promise<StoredFileResult> {
  if (config.cloudinary?.isConfigured) {
    try {
      const isImage = file.mimetype.startsWith('image/');
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'chatterly/attachments',
        resource_type: isImage ? 'image' : 'raw',
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        storageType: 'cloudinary',
      };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Failed to upload attachment to Cloudinary, falling back to local file');
    }
  }

  return {
    url: `/uploads/${file.filename}`,
    storageType: 'local',
  };
}

/**
 * Cleans up an old avatar file when a user replaces or removes their avatar.
 * Guarantees:
 * 1. Checks if any other user references the same avatar before deleting.
 * 2. Safely deletes Cloudinary images or local disk files without path traversal.
 * 3. Never deletes single-letter avatars or external third-party URLs.
 */
export async function cleanupOldAvatar(oldAvatarUrl?: string | null, currentUserId?: string): Promise<void> {
  if (!oldAvatarUrl || typeof oldAvatarUrl !== 'string') return;
  const trimmed = oldAvatarUrl.trim();
  if (!trimmed || trimmed.length <= 3) return; // e.g. initial letters 'A', 'M'

  // Safety check: verify no other user references this exact avatar
  if (currentUserId) {
    try {
      const isReferenced = await User.exists({
        _id: { $ne: currentUserId },
        avatar: trimmed,
      });
      if (isReferenced) {
        logger.info(`Old avatar is still referenced by another user; preserving file: ${trimmed}`);
        return;
      }
    } catch {
      // If DB check fails, err on the side of caution and do not delete
      return;
    }
  }

  // If stored in Cloudinary
  if (trimmed.includes('cloudinary.com') && config.cloudinary?.isConfigured) {
    try {
      const matches = trimmed.match(/\/v\d+\/(chatterly\/[^\.]+)/);
      if (matches && matches[1]) {
        await cloudinary.uploader.destroy(matches[1]);
        logger.info(`Destroyed previous Cloudinary avatar: ${matches[1]}`);
      }
    } catch (err: any) {
      logger.warn({ err: err.message }, 'Could not destroy old Cloudinary avatar');
    }
    return;
  }

  // If stored on local disk (/uploads/<filename>)
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const filename = path.basename(trimmed);
    const targetPath = path.resolve(config.uploadDir, filename);

    // Prevent path traversal
    if (targetPath.startsWith(config.uploadDir) && fs.existsSync(targetPath)) {
      try {
        fs.unlinkSync(targetPath);
        logger.info(`Cleaned up previous local avatar: ${filename}`);
      } catch (err: any) {
        logger.warn({ err: err.message }, `Failed to delete local avatar file: ${targetPath}`);
      }
    }
  }
}

/**
 * Helper to safely delete an uploaded file from disk if processing fails.
 */
export function safelyRemoveFile(filePath?: string): void {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Ignore cleanup error
  }
}
