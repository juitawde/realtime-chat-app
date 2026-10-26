import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';
import { Conversation } from '../models/Conversation.js';

export const PUBLIC_CHANNELS = [
  { name: 'General', description: 'General community discussion and catch-up.' },
  { name: 'Developers', description: 'Engineering, architecture, and code discussions.' },
  { name: 'Gaming', description: 'Gaming chat, recommendations, and streams.' },
  { name: 'Random', description: 'Casual, miscellaneous, and off-topic topics.' },
];

function maskMongoUri(uri: string): string {
  try {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
  } catch {
    return 'mongodb://***';
  }
}

let isConnected = false;

export function getDatabaseStatus(): 'connected' | 'connecting' | 'disconnected' {
  const state = mongoose.connection.readyState;
  if (state === 1) return 'connected';
  if (state === 2) return 'connecting';
  return 'disconnected';
}

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const maskedUri = maskMongoUri(config.mongoUri);

  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info(`✦ MongoDB connection established: ${maskedUri}`);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('⚠️ MongoDB disconnected. Attempting automatic reconnection...');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err: err.message }, 'MongoDB connection error encountered');
    });

    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 15000,
      retryWrites: true,
      maxPoolSize: 10,
    });

    // Ensure public channels exist with proper Capitalization (Section 7)
    for (const channel of PUBLIC_CHANNELS) {
      // Check case-insensitively to prevent duplicates
      const exists = await Conversation.findOne({
        name: { $regex: new RegExp(`^${channel.name}$`, 'i') },
        isPublicChannel: true,
      });

      if (!exists) {
        await Conversation.create({
          type: 'channel',
          name: channel.name,
          description: channel.description,
          isPublicChannel: true,
          code: channel.name.toUpperCase(),
        });
        logger.info(`✦ Initialized persistent public channel: #${channel.name}`);
      } else if (exists.name !== channel.name) {
        // Normalize capitalization for existing channel
        exists.name = channel.name;
        exists.code = channel.name.toUpperCase();
        await exists.save();
        logger.info(`✦ Updated channel capitalization to #${channel.name}`);
      }
    }
  } catch (error: any) {
    logger.error({ err: error.message }, `Failed to connect to MongoDB (${maskedUri})`);
    throw error;
  }
}
