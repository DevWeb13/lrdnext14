const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export default async function connect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function connectToCollection(collectionName: string) {
  const client = await connect();
  const db = client.db();
  const collection = db.collection(collectionName);
  return { client, collection };
}
