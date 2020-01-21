var postController = (function(){
    
    var realtedActive = function(){
        var activePost = $('div#post-display').attr('post');
        
        $('div.related-post > ul > li').each(function(){
            $(this).removeClass('active');

            if($(this).attr('id') == activePost){
                $(this).addClass('active');
            }
        })
    }

        
    var getAlbum = function(){
        var element = '';

        var id = $('div#album > input').val();
        fetch('/Post/GetAlbum/' + id, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        element = element + '<div class="skeleton-container text-center">'
                        
                        if(data.imagePath.length > 0){
                            element = element +'<span id="image" class="skeleton border-radius-small" style="background-image:url('+ data.imagePath[0] +')">';
                            element = element + '<p class="text-center color-white skeleton"> +' + data.imagePath.length + '</p>'
                            element = element + '</span>'
                        }
                        
                        if(data.videoPath.length > 0){
                            element = element +'<span id="video" class="skeleton border-radius-small">';
                            element = element + '<video><source src="' + data.videoPath[0]  + '"></video>'
                            element = element + '<p class="text-center color-white skeleton"> +' + data.videoPath.length + '</p>'
                            element = element + '</span>'
                        }

                        element = element + '</div>'

                        $('div#album').append(element);
                    })
            })
    }

    return {
        realtedActive: realtedActive,
        getAlbum: getAlbum
    }

})();

var postUI = (function(){

})();

var post = (function(postUI, postCtrl){
    var init = function(){
        console.log('post init FE')

        postCtrl.realtedActive();
        postCtrl.getAlbum();
    }
    
    return {
        init: init
    }
})(postUI, postController);