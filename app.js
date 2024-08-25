const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

// Sets ejs as the default template engine
app.set('view engine', 'ejs');
// tells express in which folder the templates are located
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//It parses the requests
app.use(bodyParser.urlencoded({ extended: false }));
//loads static files like css
app.use(express.static(path.join(__dirname, 'public')));

//Middleware to pass a user to every incoming request
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then(user => {
  //     //We assing a new property to the req object
  //     req.user = user;
  //     // Goes to the next request
  //     next();
  //   })
  //   .catch(err => console.error(err));
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

