import mongoose from 'mongoose';

export async function connectDB(retries = 10, delayMs = 2000) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    return;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    if (retries > 0) {
      const nextDelay = Math.min(Math.floor(delayMs * 1.5), 15000);
      console.log(`Retrying MongoDB connection in ${delayMs}ms... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, nextDelay), delayMs);
    }
  }
}
