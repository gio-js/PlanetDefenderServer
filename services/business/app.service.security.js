const Dal = require('../core/app.service.dal');
const DalConst = require('../../const/app.const.dal');
const sha256 = require('sha256');

class SecurityService {

    constructor() {
        this.service = new Dal.DatabaseService();
    }

    /**
     * Creates a new user
     */
    authenticate(email, password) {
        return this.service
            .connect()
            .then(function (database) {

                let authenticated = false;

                // Insert a single document
                const user = database.collection(DalConst.DAL_USERS_COLLECTION).find({ 'Email': email }).findOne();
                if (user) {

                    const encryptedPassword = this.encrypt(password, user.salt);
                    if (user.PasswordHash === encryptedPassword) {
                        authenticated = true;
                    }

                }

                if (!authenticated) {
                    throw new Error('Authentication failed');
                }

            });
    }

    /**
     * Creates a new user
     */
    encrypt(password, salt) {
        return sha256(password + salt);

    }

    /**
     * Dispose function, removes any internal resource pointer
     */
    dispose() {
        if (this.service) {
            this.service.dispose();
            this.service = null;
        }
    }

}

exports.default = SecurityService;