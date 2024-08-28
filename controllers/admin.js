const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/add-product',
    isEditing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, price, imageUrl, description);
  product.save()
    .then((result) => {
      console.log('Created product');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
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

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  console.log('Incoming request:', req.method, req.url, req.params);
  const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDescription, prodId);
  console.log(product);
  product
    .save()
    .then(result => {
      console.log("Product successfully updated");
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
  // we shall retriev only the products for one user
  Product
    .fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.error(err));
}