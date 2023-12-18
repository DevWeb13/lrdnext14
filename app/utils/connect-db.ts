import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI!;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

/**
 * The function `connect` connects to a database using the `mongoose` library in TypeScript.
 * @returns The function `connect` is returning `undefined`.
 */
const connect = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('Already connected to database');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to database');
  } catch (error) {
    throw new Error('Error connecting to database');
  }
};
export default connect;
