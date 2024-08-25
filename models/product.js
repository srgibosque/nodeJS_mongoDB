const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb'); 

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => console.error(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products
      })
      .catch( err => console.error(err));
  }

  static findById(prodId){
    const db = getDb();
    return db
      .collection('products')
      .find({_id: ObjectId.createFromHexString(prodId)})
      .next()
      .then(product => {
        return product;
      })
      .catch( err => console.error(err));
  }
}

module.exports = Product;