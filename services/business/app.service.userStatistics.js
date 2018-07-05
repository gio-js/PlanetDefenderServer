const uuidv1 = require('uuid/v1');
const DatabaseService = require('../core/app.service.dal');
const DalConst = require('../../const/app.const.dal');
const SecurityService = require('../../services/business/app.service.security');
const PlanetDefenderCore = require('planet-defender-core');

class UserStatisticsService {

    constructor() {
        this.service = new DatabaseService.Class();
    }

    /**
     * Get user statistics
     */
    getStatistics(userId) {
        return this.service
            .connect()
            .then(function (database) {

                const stats = new PlanetDefenderCore.UserStatistics();
                stats.UserId = userId;

                // Insert a single document
                return database.collection(DalConst.DAL_STATISTICS_COLLECTION).findOne(stats);

            });
    }

    /**
     * Deletes the specified user
     */
    insertOrUpdate(stats) {
        return this.service
            .connect()
            .then(function (database) {

                // Insert a single user stats
                return database.collection(DalConst.DAL_USERS_COLLECTION).save(stats);

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

exports.Class = UserStatisticsService;