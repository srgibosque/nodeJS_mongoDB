const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;  // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this);
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    })
    // returns all elements where the id is mentioned in the array, which will hold only the products that are on the cart
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products => {
        return products.map((p) => {
          return {
            ...p, quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          }
        })
      }))
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    //The product already exists
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity })
    }
    const updatedCart = {
      items: updatedCartItems
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );

  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  getOrders() {
    const db = getDb();
    //returns only the documents that have the property id of the user matching the user in the constructor (the current user)
    return db
      .collection('orders')
      .find({ 'user._id': this._id })
      .toArray();
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            username: this.username,
          }
        }
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: this._id },
            { $set: { cart: { items: [] } } }
          );
      })
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: ObjectId.createFromHexString(userId) })
  }
}

module.exports = User;