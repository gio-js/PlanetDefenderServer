class BaseController {

    processAnonymous(request, response, next, businessLogicCallback) {

        // do internal stuff

        if (businessLogicCallback) {
            businessLogicCallback(request, response, next);
        }

        return null;

    }

    processWithAuthentication(request, response, next, businessLogicCallback) {

        // do authentication stuffs

        if (businessLogicCallback) {
            return businessLogicCallback(request, response, next);
        }

        return null;

    }
}


exports = BaseController;