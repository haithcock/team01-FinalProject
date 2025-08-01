const validator = require('../helpers/validate');

const saveUser = (req, res, next) => {
  const validationRule = {
    userName: ['required', 'string', 'regex:/^\\S+$/'],
    email: 'required|email'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};


const saveUserRole = (req, res, next) => {
  const validationRule = {
    role: 'required|string|in:client,kitchen,cashier,admin'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};

module.exports = {
  saveUser, saveUserRole
};