const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const BaseController = require("./base/app.controller.base");
const UserService = require('../services/business/app.service.user');
const SecurityService = require('../services/business/app.service.security');

class UsersController {
  constructor() {}

  register(apiRoutes) {


    /**
     * Users, Create
     */
    apiRoutes.post("/users/register", jsonParser, BaseController.Instance.processAnonymous((request, response, next) => {
        var email = req.body.email;
        var password = req.body.password;
  
        const service = new UserService.Class();
        const security = new SecurityService.Class();
        
        return service
          .register(email, password)
          .then(function(user) {
            service.dispose();
  
            return res.json(security.generateTokenInfo(user));
          })
          .catch(function(error) {
            service.dispose();
            security.dispose();
  
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