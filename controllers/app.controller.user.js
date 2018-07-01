const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const BaseController = require("./base/app.controller.base");
const UserService = require('../services/business/app.service.user');

class UsersController {
  constructor() {}

  register(apiRoutes) {


    /**
     * Users, Create
     */
    apiRoutes.post("/users/register", jsonParser, BaseController.Instance.processAnonymous((request, response, next) => {
        var id = req.body.id;
        var email = req.body.email;
  
        const service = new UserService.Class();
        return service
          .createUser(email)
          .then(function(user) {
            service.dispose();
  
            return res.json(user);
          })
          .catch(function(error) {
            service.dispose();
  
            return next(error);
          });
      }));

    /**
     * Users, Retrieve all users
     */
    apiRoutes.get("/users", BaseController.Instance.processWithAuthentication((request, response, next) => {
      const service = new UserService.Class();
      return service
        .getAllUsers()
        .then(function(items) {
          service.dispose();

          return res.json(items);
        })
        .catch(function(error) {
          service.dispose();

          return next(error);
        });
    }));

    /**
     * Users, Delete
     */
    apiRoutes.delete("/users/:id", BaseController.Instance.processWithAuthentication((request, response, next) => {
      var id = req.params.id;

      const service = new UserService.Class();
      return service
        .deleteUser(id)
        .then(function() {
          service.dispose();

          return res.json(true);
        })
        .catch(function(error) {
          service.dispose();

          return next(error);
        });
    }));
  }
}

exports.Class = UsersController;