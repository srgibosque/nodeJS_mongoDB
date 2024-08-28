const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne({ _id: ObjectId.createFromHexString(this._id) }, {
        $set: {
          title: this.title,
          price: this.price,
          imageUrl: this.imageUrl,
          description: this.description,
        }
      });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
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
      .catch(err => console.error(err));
  }

  static findById(prodId) {
    const db = getDb();

    return db
      .collection('products')
      .findOne({ _id: ObjectId.createFromHexString(prodId) })
      .then(product => {
        return product;
      })
      .catch(err => console.error(err));
  }
}

module.exports = Product;