(function(){

    $(document).ready(function(){
        // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
    });

    // building the note submit send ajax 
    $('.submit-btn').on('click', (event)=>{
        event.preventDefault();
        let author = $('#author').val().trim();
        let note = $('#note').val().trim();
        let articleID = $('#note').data('article');
        
        let data = {
            author: author,
            comment: note,
            id: articleID
        }

        $.ajax({
            url: '/api/notes/',
            method: 'POST',
            data: data
        }).done((data) => {
            $('.modal').modal()
            console.log('DATATATATATA',data)
        });
    })
}());