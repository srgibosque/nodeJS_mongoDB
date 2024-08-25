exports.get404 = (req, res, next) => {
  res.status(404).render('page-not-found', { 
    pageTitle: 'Page not found', 
    path: 'not-found'
  });
}