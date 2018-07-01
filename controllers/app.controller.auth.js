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
  
        const service = new SecurityService.Class();
        return service
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

  }
}

exports.Class = AuthenticationController;