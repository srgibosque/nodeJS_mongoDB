const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  // findAll is a sequelize method to interact with the db
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products'
      });
    })
    .catch(err => console.error(err));
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  // findById is a sequelize method to interact with the db
  Product.findAll({ where: { id: productId } })
    .then((products) => {
      if (products.length > 0) {
        res.render('shop/product-detail', {
          product: products[0],
          pageTitle: products[0].title,
          path: '/products'
        });
      }
    })
    .catch(err => console.error(err));
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then((cart) => {
      // I can execute getProducts cause a Cart has been associated with many products Cart.belongsToMany(Product, { through: CartItem });
      return cart.getProducts()
    })
    .then((products) => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: products
      });
    })
    .catch(err => console.error(err));
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.error(err));
}

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0];
      //Destroy the product only in the cartItem table, not the product table
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch(err => console.error(err))
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders
      });
    })
    .catch(err => console.error(err))

}

exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProduct(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product;
          }));
        })
        .catch(err => console.error(err));
    })
    .then(result => {
      fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.error(err));
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
}

