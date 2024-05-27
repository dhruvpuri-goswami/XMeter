// Import the MongoDB client and the ServerApiVersion from the MongoDB Node.js driver
const { MongoClient, ServerApiVersion } = require('mongodb');
// Import the dotenv module
require('dotenv').config();
// Connection URI
const uri = process.env.MONGO_URI; // Change the URI as per your MongoDB configuration


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return mongoClient;
  } catch (err) {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}

module.exports = connectToMongo;