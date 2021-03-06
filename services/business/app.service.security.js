const DatabaseService = require('../core/app.service.dal');
const DalConst = require('../../const/app.const.dal');
const serviceConst = require('../../const/app.const.service');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const PlanetDefenderCore = require('planet-defender-core');

class SecurityService {

    constructor() {
        this.service = new DatabaseService.Class();
    }

    /**
     * Creates a new user
     */
    authenticate(email, password) {
        console.log(email);
        console.log(password);
        return this.service
            .connect()
            .then((database) => {

                let authenticated = false;

                // Insert a single document
                return database.collection(DalConst.DAL_USERS_COLLECTION).findOne({ 'Email': email }).then(user => {
                    console.log(user);

                    if (user) {

                        const encryptedPassword = this.encrypt(password, user.Salt);
                        if (user.PasswordHash === encryptedPassword) {
                            authenticated = true;
                        }

                    }

                    if (!authenticated) {
                        throw new Error('Authentication failed');
                    }

                    return this.generateTokenInfo(user);
                });

            });
    }

    /**
     * Generated token info for client requests
     */
    generateTokenInfo(user) {
        const payload = {
            admin: user.Email 
        };

        var token = jwt.sign(payload, serviceConst.AUTH_TOKEN_SECRET, {
            expiresIn: serviceConst.AUTH_TOKEN_EXPIRATION_TIME
        });

        const authInfo = new PlanetDefenderCore.AuthenticationInfo();
        authInfo.UserId = user._id;
        authInfo.UserName = user.Email;
        authInfo.AuthenticationToken = token;
        return authInfo;
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

exports.Class = SecurityService;