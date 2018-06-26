const Dal = require('../core/app.service.dal');
const DalConst = require('../../const/app.const.dal');
const Model = require('../../model/dal/app.model.dal.user')

class UserService {

    constructor() {
        this.service = new Dal.DatabaseService();
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
    createUser(email) {
        return this.service
            .connect()
            .then(function (database) {

                // create user
                const user = new Model.User(null, email);

                // insert to database
                database.collection(DalConst.DAL_USERS_COLLECTION).insertOne(user);

                return user;

            });
    }

    /**
     * Creates a new user
     */
    // module.updateUser(email) {

    // }

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

exports.UserService = UserService;