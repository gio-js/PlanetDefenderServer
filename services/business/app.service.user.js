const uuidv1 = require('uuid/v1');
const DatabaseService = require('../core/app.service.dal');
const DalConst = require('../../const/app.const.dal');
const SecurityService = require('../../services/business/app.service.security');
const PlanetDefenderCore = require('planet-defender-core');

class UserService {

    constructor() {
        this.service = new DatabaseService.Class();
    }

    /**
     * Creates a new user
     */
    getAllUsers() {
        return this.service
            .connect()
            .then(function (database) {

                // Insert a single document
                return database.collection(DalConst.DAL_USERS_COLLECTION).find().toArray() || [];

            });
    }

    /**
     * Creates a new user
     */
    register(email, password) {
        return this.service
            .connect()
            .then(function (database) {

                // create hash
                const security = new SecurityService();

                // salt
                const salt = uuidv1();

                // create user
                const user = new PlanetDefenderCore.User(email, security.encrypt(password, salt), salt);

                // insert to database
                database.collection(DalConst.DAL_USERS_COLLECTION).insertOne(user);

                return user;

            });
    }

    /**
     * Deletes the specified user
     */
    deleteUser(id) {
        return this.service
            .connect()
            .then(function (database) {

                const user = new User();
                user.id = id;

                // Insert a single document
                return database.collection(DalConst.DAL_USERS_COLLECTION).deleteOne(user);

            });
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

exports.Class = UserService;