const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

module.exports = function(router) {
  router.post('/register', async function(req, res) {
    try {
      const { name, email, password } = req.body;

      if(!(name && email && password)) {
        res.status(400).json({
          success: false,
          message: "All inputs is required"
        });
      }

      const oldUser = await User.findOne({ email });
      if(oldUser) {
        return res.status(409).json({
          success: false,
          message: "User already exist. Please login"
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);

      let user = await User.create({
        name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email
        },
        config.secret,
        { expiresIn: "2h" }
      );

      res.status(201).json({
        auth: true,
        message: "User created",
        user,
        token
      });

    } catch(e) {
      console.log('e', e);
    }
  });

  router.post('/login', async function(req, res) {
    try {
      const { email, password } = req.body;

      if(!(email && password)) {
        res.status(400).json({
          success: false,
          message: "All input is required"
        });
      }
  
      const user = await User.findOne({ email });
  
      console.log('user', user);
  
      if(user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            user_id: user._id,
            email
          },
          config.secret,
          { expiresIn: "2h" }
        );
  
        res.status(200).json({
          auth: true,
          message: "User authenticate!",
          user,
          token
        });
      }
  
      res.status(400).send({
        success: false,
        message: "Invalid Credentials"
      });
    } catch(e) {
      console.log(e);
    }
  });
  
  router.get('/test', async (req, res, next) => {
    res.json({
      test: true,
      msg: "test"
    })
  })

  return router;
};