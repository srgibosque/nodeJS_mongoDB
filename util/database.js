const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient
    .connect('mongodb+srv://srgibosque:NNQ3XHX3%40!8Nyrn@cluster0.oyxb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.error(err)
      throw err;
    });
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw 'No database found'
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;