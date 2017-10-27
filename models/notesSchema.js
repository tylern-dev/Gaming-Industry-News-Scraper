let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let notesSchema = new Schema({
    author: {
        type: String
    },
    comment: {
        type: String
    },
    submitDate:{
        type: Date,
        default: Date.now
    }
});

let Note = mongoose.model("Note", notesSchema);

module.exports = Note;