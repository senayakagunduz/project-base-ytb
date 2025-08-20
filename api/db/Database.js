const mongoose = require("mongoose");
let instance = null;

class Database {
    constructor() {
        if (!instance) {
            this.mongoConnection = null;
            this.instance = this;
        }
        return this.instance;
    }


    async connect(options) {
        try {
            let db = await mongoose.connect(options.Connection_STRING);
            this.mongoConnection = db;
            console.log("MongoDB connected");
        } catch (error) {
            console.log("MongoDB connection error", error);
            process.exit(1);
        }

    }
}
module.exports = Database;
