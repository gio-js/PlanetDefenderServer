// requires
const express = require('express');
const bodyParser = require('body-parser');
const serviceConst = require('./const/app.const.service');

// services
const app = express();
const UserService = require('./services/business/app.service.user');
const jsonParser = bodyParser.json(); //app.use(bodyParser.json());

app.listen(serviceConst.LISTENING_PORT, (err) => {
  if (err) {
    return console.log('Error starting server: ', err)
  }

  console.log(`Server listening on ${serviceConst.LISTENING_PORT}`)
})

/**
 * Base default
 */
app.get('/', function (req, res, next) {
  res.write('Planet defender server is on.');
});

/**
 * Users, Retrieve all users 
 */
app.get(serviceConst.BASE_URL_SERVICE + '/users', function (req, res, next) {
  const service = new UserService();
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
app.post(serviceConst.BASE_URL_SERVICE + '/users', jsonParser, function (req, res, next) {
  var id = req.body.id;
  var email = req.body.email;

  const service = new UserService();
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
app.delete(serviceConst.BASE_URL_SERVICE + '/users/:id', function (req, res, next) {
  var id = req.params.id;

  const service = new UserService();
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
