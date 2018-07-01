const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const BaseController = require("./base/app.controller.base");
const SecurityService = require('../services/business/app.service.security');

class AuthenticationController {
  constructor() {}

  register(apiRoutes) {


    /**
     * Users, Create
     */
    apiRoutes.post("/authentication/login", jsonParser, BaseController.Instance.processAnonymous((request, response, next) => {
        var email = request.body.email;
        var password = request.body.password;
  
        const service = new SecurityService();
        return security
          .authenticate(email, password)
          .then(function(authInfo) {
            service.dispose();
  
            return response.json(authInfo);
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
      const service = new UserService();
      return service
        .getAllUsers()
        .then(function(items) {
          service.dispose();

          return response.json(items);
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
      var id = request.params.id;

      const service = new UserService();
      return service
        .deleteUser(id)
        .then(function() {
          service.dispose();

          return response.json(true);
        })
        .catch(function(error) {
          service.dispose();

          return next(error);
        });
    }));
  }
}

exports.Class = AuthenticationController;