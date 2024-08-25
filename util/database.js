// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node_firstproject' , 'root' , 'root', {
//   dialect: 'mysql', 
//   host: 'localhost',
//   port: '3307'
// });

// module.exports = sequelize;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://srgibosque:NNQ3XHX3@!8Nyrn@cluster0.oyxb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient
    .connect('mongodb+srv://srgibosque:NNQ3XHX3%40!8Nyrn@cluster0.oyxb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
      console.log('Connected!');
      callback(client);
    })
    .catch(err => console.error(err));
};

module.exports = mongoConnect;