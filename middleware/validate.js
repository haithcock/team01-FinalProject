const validator = require('../helpers/validate');
const Validator = require('validatorjs');
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

const validateMenuItem = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    description: 'required|string',
    imageUrl: ['required', 'regex:/^\\/images\\/.+\\.(jpg|jpeg|png|gif)$/i'],
    price: 'required|numeric',
    category: 'required|string',
    servingSize: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};
const validatecreateOrders = (req, res, next) => {
  const validationRule = {
    orderItems: 'required|array',
    'orderItems.*.menuItemId': 'required|string',
    'orderItems.*.quantity': 'required|integer|min:1',
    orderStatus: 'required|string|in:Preparing,Completed,Cancelled',
    orderType: 'required|string|in:Take-out,Dine-in,Delivery'

  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

function validateUpdateOrders(req, res, next) {
    const rules = {
       orderItems: 'required|array',
    'orderItems.*.menuItemId': 'required|string',
    'orderItems.*.quantity': 'required|integer|min:1',
      orderStatus: 'required|string|in:Preparing,Completed,Cancelled',
      orderType: 'required|string|in:Take-out,Dine-in,Delivery'
    };

    // Only include keys that exist in request body (so all are optional)
    const data = {};
    Object.keys(rules).forEach(key => {
        if (req.body[key] !== undefined) {
            data[key] = req.body[key];
        }
    });

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};

function validateUpdateOrderStatus(req, res, next) {
  const rules = {
    orderStatus: 'required|string|in:Preparing,Completed,Cancelled',
  };

  // Only include keys that exist in request body
  const data = {};
  Object.keys(rules).forEach(key => {
    if (req.body[key] !== undefined) {
      data[key] = req.body[key];
    }
  });

  const validation = new Validator(data, rules);

  if (validation.fails()) {
    return res.status(422).json(validation.errors.all());
  }

  next();
}

function validateDeleteOrder(req, res, next) {
    const data = {
        id: req.params.id || req.body.id
    };

    const rules = {
        id: 'required|string|size:24' // size:24 for MongoDB ObjectId
    };

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};

function validatePayment(req, res, next) {
  const rules = {
    orderId: [
      'required',
      'string',
      'regex:/^[0-9a-fA-F]{24}$/', // MongoDB ObjectId check
    ],
    paymentMethod: 'required|string|in:Cash,Credit Card,Debit Card,GCash'
  };

  // Only validate provided keys
  const data = {};
  Object.keys(rules).forEach(key => {
    if (req.body[key] !== undefined) {
      data[key] = req.body[key];
    }
  });

  const validation = new Validator(data, rules);

  if (validation.fails()) {
    return res.status(422).json(validation.errors.all());
  }

  next();
}


function validateUpdatePayment(req, res, next) {
  const rules = {
    isPaid: 'required|boolean',
    paymentMethod: 'required|string|in:Cash,Credit Card,Debit Card,GCash'
  };

  // Only validate keys that exist in request body
  const data = {};
  Object.keys(rules).forEach(key => {
    if (req.body[key] !== undefined) {
      data[key] = req.body[key];
    }
  });

  const validation = new Validator(data, rules);

  if (validation.fails()) {
    return res.status(422).json(validation.errors.all());
  }
  next();

}

function validateDeletePayments(req, res, next) {
    const data = {
        id: req.params.id || req.body.id
    };

    const rules = {
        id: 'required|string|size:24' // size:24 for MongoDB ObjectId
    };

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};





module.exports = {
  saveUser, saveUserRole, validateMenuItem, validatecreateOrders, validateUpdateOrders, validateDeleteOrder, validateUpdateOrderStatus, validatePayment, validateUpdatePayment, 
  validateDeletePayments, 
};