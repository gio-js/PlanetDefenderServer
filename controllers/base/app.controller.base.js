const serviceConst = require('../../const/app.const.service');
const jwt = require('jsonwebtoken');

const BaseController = {

    processAnonymous : (businessLogicCallback) => {

        return function(request, response, next) {
            // do internal stuff

            if (businessLogicCallback) {
                businessLogicCallback(request, response, next);
            }

            return null;
        }

    },

    processWithAuthentication : (businessLogicCallback) => {

        return function(request, response, next) {
            // do authentication stuffs
            var token = request.body.token || request.query.token || request.headers['x-access-token'];

            // verifies secret and checks exp
            jwt.verify(token, serviceConst.AUTH_TOKEN_SECRET, function(err, decoded) {      
                if (err) {
                    response.send(401);
                    return response.json({ success: false, message: 'Failed to authenticate token.' });    
                } 
                // else {
                //     // if everything is good, save to request for use in other routes
                //     request.decoded = decoded;    
                // }
            });

            if (businessLogicCallback) {
                businessLogicCallback(request, response, next);
            }

            return null;
        }

    }
}


exports.Instance = BaseController;