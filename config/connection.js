

module.exports = function (mongoose) {
    // Setup the Mongoose connections and DB
    let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
    mongoose.connect(MONGODB_URI);
    
        let dbConnect = mongoose.connection;
        dbConnect.on("error", function (error) {
            console.log("Mongoose Error: ", error);
        });
        dbConnect.once('open', function () {
            console.log('You are connected to the DB');
        });
    
    mongoose.Promise = global.Promise;
}