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

// Each of the following functions open and close connections, which is not efficient for performing multible operations.
// Each of the functions is just used to show how these operatons could be made for learning purposes.
async function testDbConnection() {
  try {
    await client.connect();
    console.log(`Successfully connected to the ${dbName} database!`);
    return true;
  } catch(err) {
    console.error(`Database connection not successfull.`, err);
    throw err;
  } finally {
    await client.close();
  }
}

async function findSingleDocument(documentQuery, projection = null) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    const options = {};
    if (projection) {
      options.projection = projection;
    }

    const result = await collection.findOne(documentQuery, options);
    console.log(`One file found.`, result);
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}


async function findDocuments(documentQuery, projection = null, limit = null) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    
    let result = collection.find(documentQuery);
    
    // Apply projection if provided
    if (projection) {
      result = result.project(projection);
    }
    
    // Apply limit if provided
    if (limit) {
      result = result.limit(limit);
    }
    
    let docCount = await collection.countDocuments(documentQuery);
    
    // Print each document
    for await (const doc of result) {
      console.log(doc);
    }
    
    console.log(`Found ${docCount} documents`);
    if(limit) console.log(`Returned ${limit} documents`);

    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}


async function insertSingleDocument(document) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    const result = await collection.insertOne(document);
    console.log(`Inserted New Document: ${result.insertedId}`);
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}

async function insertDocuments(documents) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    const result = await collection.insertMany(documents);
    console.log(`Inserted ${result.insertedCount} documents`);
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}

async function updateSingleDocument(documentQuery, documentUpdate) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const result = await collection.updateOne(documentQuery, documentUpdate);
    result.modifiedCount === 1
      ? console.log('Updated one document!')
      : console.log('No documents updated');
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}

async function updateDocuments(documentQuery, documentUpdate) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const result = await collection.updateMany(documentQuery, documentUpdate);
    console.log(`Successfully updated ${result.modifiedCount} documents!`);
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}

async function deleteSingleDocument(documentQuery) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const result = await collection.deleteOne(documentQuery);
    result.deletedCount === 1
    ? console.log("Deleted one document.")
    : console.log(`No documents deleted. Query: ${JSON.stringify(documentQuery)}`);
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}

async function deleteDocuments(documentQuery) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const result = await collection.deleteMany(documentQuery);
    result.deletedCount > 0
    ? console.log(`Deleted ${result.deletedCount} documents`)
    : console.log("No documents deleted")
    return result;
  } catch (err) {
    console.error(`An error has occurred`, err);
    throw err;
  } finally {
    await client.close();
  }
}

const newdocument1 = {
  address: {},
  borough: "Maple Grove",
  cuisine: "Food Type 2",
  grades: {},
  name: "New Restaurant Name 1"
}
const newdocument2 = {
  address: {},
  borough: "Dayton",
  cuisine: "Food Type 3",
  grades: {},
  name: "New Restaurant Name 2"
}
// example on how these functions could be used.
findSingleDocument([newdocument1, newdocument2]);
