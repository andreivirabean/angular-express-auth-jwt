const express = require('express');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../models/user');

const mongoose = require('mongoose');

const db = require('../config/keys').MongoURI;

/**
 * Connects to the MongoDB Database
 */
mongoose.connect(db, { useNewUrlParser: true }, error => {
  if (error) {
    console.log(`ERROR [MongoDB]: ${error}`);
  } else {
    console.log(`Connected to MongoDB Successfully.`);
  }
});

/**
 * Verifies if the request has a valid token
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Callback
 */
function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }

  let payload = jwt.verify(token, 'CFuSDe3qnk3eKT6G');
  if (!payload) {
    return res.status(401).send('Unauthorized request');
  }

  res.userId = payload.subject;
  next();
}

function userAlreadyInDatabase(email) {
  return User.findOne({ email: email }, (error, user) => {
    if (error) {
      console.log(`ERROR: ${error}`);
    } else {
      if (!user) {
        return false;
      } else {
        return true;
      }
    }
  });
}

// API ROUTES

// Authentication Methods
router.post('/register', (req, res) => {
  let userData = req.body;

  // Check if the email is already registered
  userAlreadyInDatabase(userData.email)
    .then((found) => {
      if (found) {
        console.log('User is already registered.');
        res.status(401).send('User is already registered.');
        return;
      } else {
        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(userData.password, salt, (err, hash) => {
            if (err) {
              console.log('ERROR [BCrypt]: ', err)
              return;
            }

            userData.password = hash;

            let user = new User(userData);

            user.save((error, registeredUser) => {
              if (error) {
                console.log(`ERROR: ${error}`);
              } else {
                let payload = { subject: registeredUser._id }
                let token = jwt.sign(payload, 'CFuSDe3qnk3eKT6G');
                res.status(200).send({ token });
              }
            });
          }));
      }
    })
});

router.post('/login', (req, res) => {
  let userData = req.body;

  User.findOne({ email: userData.email }, (error, user) => {
    if (error) {
      console.log(`ERROR: ${error}`);
    } else {
      if (!user) {
        res.status(401).send('Invalid email')
      } else
        if (!bcrypt.compare(user.password, userData.password)) {
          res.status(401).send('Invalid password')
        } else {
          let payload = { subject: user._id };
          let token = jwt.sign(payload, 'CFuSDe3qnk3eKT6G');
          res.status(200).send({ token });
        }
    }
  })
});

// GET Methods
router.get('/books', verifyToken, (req, res) => {
  let books = require('../mock/books').Books;
  res.json(books);
});

router.get('/bookRequests', verifyToken, (req, res) => {
  let requests = require('../mock/bookRequests').BookRequests;
  res.json(requests);
});

module.exports = router;