import express from 'express';
import bcrypt from 'bcrypt';
import userModel from '../oldmodels/users.js';
import jsonwebtoken from 'jsonwebtoken';
import { SECRET } from '../config.js';

const router = express.Router();

router.post('/register', async function (req, res) {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      res.status(400).json({
        success: false,
        message: 'All inputs is required',
      });
    }

    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exist. Please login',
      });
    }

    let encryptedPassword = await bcrypt.hash(password, 10);

    let user = await userModel.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jsonwebtoken.sign(
      {
        user_id: user._id,
        email,
      },
      SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      auth: true,
      message: 'User created',
      user,
      token,
    });
  } catch (e) {
    console.log('e', e);
  }
});

router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({
        success: false,
        message: 'All input is required',
      });
    }

    const user = await userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jsonwebtoken.sign(
        {
          user_id: user._id,
          email,
        },
        SECRET,
        { expiresIn: '2h' }
      );

      let { _id, name } = user;

      res.status(200).json({
        auth: true,
        message: 'User authenticate!',
        user: {
          _id,
          name,
          email,
        },
        token,
      });
    }

    res.status(400).send({
      success: false,
      message: 'Invalid Credentials',
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/update-user', async (req, res, next) => {
  try {
    const { _id, name, email } = req.body;

    const filter = { _id };
    const update = { name, email };

    const user = await userModel.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: true,
    });

    if (user) {
      res.status(200).json({
        user,
        message: 'User updated',
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get('/', async (req, res, next) => {
  res.status(200).json({
    msg: 'hello',
  });
});

export default router;
