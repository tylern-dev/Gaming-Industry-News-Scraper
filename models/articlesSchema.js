let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
    headline:{
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    url: {
        type:String
    },
    notes:[{
        //refering to the object ID of the Notes schema and storing it in this array
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }]
});

let Article = mongoose.model('Article', articleSchema);
module.exports = Article;