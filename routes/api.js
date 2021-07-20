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
          message: "All input is required"
        });
      }

      const oldUser = await User.findOne({ email });
      if(oldUser) {
        return res.status(409).json({
          success: false,
          message: "User Already Exist. Please Login"
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

      user.token = token;

      console.log("token", token);

      res.status(201).json({
        success: true,
        message: "user created",
        data: user
      });

    } catch(e) {
      console.log('e', e);
    }
  });

  router.post('/login', function(req, res) {

  });

  return router;
};