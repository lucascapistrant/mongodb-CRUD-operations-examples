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

// this pipline gives the top ten most popular restaurant types in brooklyn.
const pipeline = [
    {
        $match: {
            borough: 'Brooklyn'
        }
    },
    {
        $group: {
            _id: '$cuisine',
            number_of_restaurants: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            number_of_restaurants: -1
        }
    },
    {
        $limit: 10
    }
]

async function operation() {
    try {
      await client.connect();
      console.log(`Connected to the ${dbName} database!`)
      const collection = client.db(dbName).collection(collectionName);
  
      const results = await collection.aggregate(pipeline);
      for await (const doc of results) {
        console.log(doc);
      }
    } catch (err) {
      console.error(`An error has occurred`, err);
      throw err;
    } finally {
      await client.close();
    }
}

operation();