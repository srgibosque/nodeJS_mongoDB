const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/add-product',
    isEditing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (product) {
        res.render('admin/edit-product', {
          pageTitle: 'Edit product',
          path: '/edit-product',
          isEditing: editMode,
          product: product
        });
      }
    })
    .catch(err => console.error(err));

};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Thanks to the association sequelize creates the method for creating a product from the user object. It is stored in the db
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then((result) => {
      console.log('Created product');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Product.findOne({ where: { id: prodId } })
    .then((product) => {
      if (!product) {
        console.log("Product not found");
        return
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      //method provided by sequelize. Updates the changes to the db. It returns a promise
      return product.save();
    })
    .then(result => {
      console.log("Product successfully updated");
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      //returns a promise that the product will be deleted
      return product.destroy();
    })
    .then(result => {
      console.log('Product deleted successfully');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
  // we shall retriev only the products for one user
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.error(err));

}