const MongoClient = require('mongodb').MongoClient;
const serviceConst = require('../../const/app.const.service');

class DatabaseService {

    constructor() {
        this.client = null;
        this.database = null;
    }

    /**
     * Connect mongo database
     */
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.database) {

                MongoClient
                    .connect(serviceConst.MONGO_URL)
                    .then(client => {
                        this.client = client;
                        this.database = client.db(serviceConst.MONGO_DATABASE);

                        resolve(this.database);
                    });

            } else {
                resolve(this.database);
            }
        });
    }

    /**
     * Dispose function, removes any internal resource pointer
     */
    dispose() {
        if (this.client) {
            this.client.close();
        }

        this.client = null;
        this.database = null;
    }

}

exports.default = DatabaseService;