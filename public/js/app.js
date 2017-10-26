(function(){

    $('body').on('click', '#save-btn', (event)=>{
        // event.preventDefault();
        let articleId = event.currentTarget.dataset.articleid;
        let articlePic = event.currentTarget.dataset.articlepic;
        let articleHeadline = event.currentTarget.dataset.articleheadline;
        let articleLink = event.currentTarget.dataset.articlelink;
        let articleSummary = event.currentTarget.dataset.articlesummary;
        
        let articleData = {
            storyID: articleId,
            headline: articleHeadline,
            summary: articleSummary,
            href: articleLink,
            pic: articlePic,
            saved: true
        }

        $.ajax({
            method: "POST",
            url: "/api/save-article",
            data: articleData,
            success: Materialize.toast('Success! Article Saved', 1000*4)
        }).done(function(result){
            console.log('data saved ', result)
        }); 
    });


    //delete the article
    // $('.delete-article').on('click', (event)=>{
    //     let articleID = event.currentTarget.id;
    //     $.ajax({
    //         method: "DELETE",
    //         url: `/api/delete/${articleID}`,
    //         success: console.log(`Deleted article ${articleID}`)
    //     }).done(function(){
    //         console.log('article deleted!!!!')
    //     })
    // })

}());