import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({
      status: 400,
      message: errors.array().map(error => ({
        path: error.path,
        msg: error.msg,
      })),
    });

  next();
};

export default { validate };
