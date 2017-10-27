let path = require('path');

// exporting an object containing all of our models
module.exports = {
    Article: require(path.join(__dirname, "./articlesSchema")),
    Note: require(path.join(__dirname, "./notesSchema")),
    
}