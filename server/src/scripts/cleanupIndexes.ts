import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanup = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anoncare';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('users');
    console.log('Checking indexes...');
    
    try {
      await collection.dropIndex('email_1');
      console.log('Successfully dropped email_1 index');
    } catch (e: any) {
      if (e.codeName === 'IndexNotFound') {
        console.log('Index email_1 not found, skipping...');
      } else {
        throw e;
      }
    }

    console.log('Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
