import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
// It is best practice to store the connection string in an environment variable and refrence it here
const uri = process.env.URI;
const dbName = 'sample_restaurants';
const collectionName = 'restaurants';

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

// Transactions

async function runTransaction() {
  // Start a session.
  const session = client.startSession();

  try {
    // Begin transaction.
    await session.withTransaction(async () => {
      const collection = client.db(dbName).collection(collectionName);

      // Example operations.
      // It could be possible to use already established functions above, like updateSingleDocument and
      // deleteSingleDocument, but in order to do that I would need to modify those functions slightly to accept
      //  a session as an additional parameter and include the session in the operations, which I avoided to keep
      // example simplicity.
      await collection.updateOne(
        { _id: new ObjectId('5eb3d668b31de5d588f4292e') },
        { $set: { name: "New Restaurant Name" } },
        { session }
      );

      await collection.deleteOne(
        { _id: new ObjectId('5eb3d668b31de5d588f42930') },
        { session }
      );

      console.log("Transaction successfully committed.");
    });
  } catch (err) {
    console.error("Transaction aborted due to an error: ", err);
  } finally {
    await session.endSession();
    await client.close();
  }
}

