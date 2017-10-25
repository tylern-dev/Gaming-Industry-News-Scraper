let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    headline:{
        type: String,
        required: true
    },
    summary: {
        type: String

    },
    href: {
        type:String

    },
    author: {
        type:String

    },
    pic: {
        type: String
    },
    note:[{
        //refering to the object ID of the Notes schema and storing it in this array
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;