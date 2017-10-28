let path = require('path');
let db = require(path.join(__dirname,'../models/index'));

module.exports = function(app){

    // gathers all the notes for the specific saved article from the db
    app.get('/notes/:id', (req, res) =>{
        let articleID = req.params.id

        db.Article.findById({_id: articleID})
            .populate('note')
            .catch((error)=>res.render('notes', {error: error}))
            .then((result)=>{
                console.log(result)
                res.render('notes', {data: result})
            })

    });




    app.post('/api/notes', (req, res)=>{
        let articleID = req.body.id;
        
        // creates the note in the db and then associates that noteID with the specific article
        db.Note.create({author: req.body.author, comment:req.body.comment})
            .catch((error) => res.json(error))
            .then((dbNote) =>{
                // finds the correct article and pushes the noteID to the article note array
                return db.Article.findOneAndUpdate({ _id: articleID }, {$push: { note: dbNote._id }}, { new: true });
            })
            .then((dbArticle) =>{
                res.render('notes');
            })
            .catch((error)=>{
                res.send(error);
            })
    });

    app.delete('/api/notes/:noteId', (req, res) => {
        let noteID = req.params.noteId;

        db.Note.remove({_id:noteID})
            .catch((error) => res.send(error))
            .then((result) => res.redirect('back'))
    })
            
    

        
    

}