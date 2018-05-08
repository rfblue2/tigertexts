// e.g. include=classes.title becomes [ 'classes.title' ]
const parseInclude = (req, res, next) => {
  const { include } = req.query;
  req.fields = [];
  req.fields = include ? include.split(',') : [];
  next();
};

// add include fields to mongodb queries
const populateQuery = (req, res, next) => {
  req.fields.forEach((f) => {
    if (f.includes('.')) {
      const [field, sub] = f.split('.');
      req.query.populate(field, sub);
    } else {
      req.query.populate(f);
    }
  });
  next();
};

export {
  parseInclude,
  populateQuery,
};
