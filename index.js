// consts
const BASE_URL_SERVICE = '/api/v1';

// requires
const express = require('express');
const serviceConst = require('./const/app.const.service');
const bodyParser = require('body-parser');

// services
const app = express();
const Dal = require('./services/business/app.service.user');
const jsonParser = bodyParser.json(); //app.use(bodyParser.json());

app.listen(serviceConst.LISTENING_PORT, (err) => {
  // if (err) {
  //   return console.log('something bad happened', err)
  // }

  // console.log(`server is listening on ${socketConst.LISTENING_PORT}`)
})

/**
 * Users, Retrieve all users 
 */
app.get(BASE_URL_SERVICE + '/users', function (req, res, next) {
  const service = new Dal.UserService();
  return service.getAllUsers()
    .then(function (items) {
      service.dispose();

      return res.json(items);
    })
    .catch(function (error) {
      service.dispose();

      return next(error);
    });

});

/**
 * Users, Create 
 */
app.post(BASE_URL_SERVICE + '/users', jsonParser, function (req, res, next) {
  var id = req.body.id;
  var email = req.body.email;

  const service = new Dal.UserService();
  return service.createUser(email)
    .then(function (user) {
      service.dispose();

      return res.json(user);
    })
    .catch(function (error) {
      service.dispose();

      return next(error);
    });

});

/**
 * Users, Delete 
 */
app.delete(BASE_URL_SERVICE + '/users/:id', function (req, res, next) {
  var id = req.params.id;

  const service = new Dal.UserService();
  return service.deleteUser(id)
    .then(function () {
      service.dispose();

      return res.json(true);
    })
    .catch(function (error) {
      service.dispose();

      return next(error);
    });

});
