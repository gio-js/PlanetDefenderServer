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
            var token = req.body.token || req.query.token || req.headers['x-access-token'];

            // verifies secret and checks exp
            jwt.verify(token, serviceConst.AUTH_TOKEN_SECRET, function(err, decoded) {      
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    next();
                }
            });

            if (businessLogicCallback) {
                return businessLogicCallback(request, response, next);
            }

            return null;
        }

    }
}


exports.Instance = BaseController;