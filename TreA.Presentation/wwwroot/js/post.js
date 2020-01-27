var postController = (function(){
    
    //Display Related Post
    var relatedPost = function(){
        var activePost = $('div#post-display').attr('post');
        
        $('div.related-post > ul > li').each(function(){
            $(this).removeClass('active');

            if($(this).attr('id') == activePost){
                $(this).addClass('active');
            }
        })
    }
    
    //Get album id and display first image with n° of element 
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

    //Display Album image or Video
    var displayAlbum = function(){
        var albumId = $('div#album > input').val();
        
        var type = $(this).attr('id');

        if(type === 'image'){
            displayAlbumImages(albumId);
        } else if(type === 'video') {
            displayAlbumVideos(albumId);
        }
    }

    var displayAlbumImages = function(id){
        fetch('/Post/DisplayAlbumImage/' + id, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){                        
                        //display overlay 
                        var $overlay = app.createOverlay();
                        
                        //element to append
                        var element = '';
                        element = element + '<div class="album-display background-color-white margin-top-medium text-center">'
                        
                        for(var image in data.imagePath){
                            if(image == 0){
                                element = element + '<span id="' + image +'" class="image active border-radius-small" style="background-image: url('+ data.imagePath[image] +')"></span>'
                                element = element + '<ul class="list text-center owl-carousel border-radius-small">'
                                element = element + '<li id="' + image +'" class="active border-radius-small" style="background-image: url('+ data.imagePath[image] +')"></li>'
                            } else {
                                element = element + '<li id="' + image +'" class="border-radius-small" style="background-image: url('+ data.imagePath[image] +')"></li>'
                            }
                            if(image == data.imagePath.length){
                                element = element + '</ul>'
                            }
                        }

                        $('div#overlay').addClass('album');
                        $overlay.after(element);
                        carouselInit('.owl-carousel')
                    })
            })
    }

    var displayAlbumVideos = function(id){
        fetch('/Post/DisplayAlbumVideo/' + id, {method: 'POST'})
        .then(function(res){
            res.json()
                .then(function(data){
                      //display overlay 
                      var $overlay = app.createOverlay();
                        
                      //element to append
                      var element = '';
                      element = element + '<div class="album-display background-color-white margin-top-medium text-center">'
                      
                      for(var video in data.videoPath){
                          if(video == 0){
                            element = element + '<video class="border-radius-small" controls><source src="' +  data.videoPath[video] + '"></video>';
                            element = element + '<ul class="list owl-carousel text-center border-radius-small">'
                            element = element + '<li id="' + video +'" class="active border-radius-small">'
                            element = element + '<video><source src="' + data.videoPath[video]  + '"></video>'
                            element = element + '</li>'
                          } else {
                              element = element + '<li id="' + video +'" class="border-radius-small">'
                              element = element + '<video><source src="' + data.videoPath[video]  + '"></video>'
                              element = element + '</li>'
                          }
                          if(video == data.videoPath.length){
                              element = element + '</ul>'
                          }
                      }
                      
                      $('div#overlay').addClass('album');
                      $overlay.after(element);
                      carouselInit('.owl-carousel')
                })
        })
    }

    //navigation in album
    var changeDisplayAlbum = function(){
        var backgroundImage =  $(this).attr('style');
        var id = $(this).attr('id');

        //remove active class
        $('ul.list li').each(function(){
            $(this).removeClass('active');
        })

        //change display image and id
        $('span.image.active').attr('style', backgroundImage);
        $('span.image.active').attr('id', id);

        $(this).addClass('active');
    }

    //post review
    var validateReview = function(){

        $.validator.addMethod("lettersonly", function(value, element) {
            return this.optional(element) || /^[a-z]+$/i.test(value);
          }, "In questo campo sono ammessi solo caratteri"); 
        
        return $('div#review > form').validate({
                rules: {
                    name: {
                        required: true,
                        lettersonly: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    review: {
                        required: true
                    }
                },
                message: {
                    name:{
                        required: 'Il campo Nome è obbligatorio'
                    }, 
                    email: {
                        required: 'Il campo Email è obbligatorio',
                        email: 'Formato Email non valido'
                    },
                    review: {
                        required: 'Il campo Commento è obbligatorio'
                    }
                }
            });
    }

    var sendReview = function(event){
        event.preventDefault();

        var state = validateReview();
        var valid = true;

        var invalid = state.invalid.name === true || state.invalid.email === true || state.invalid.review === true;
       
        $('div#review > form :input').each(function(){
            if(invalid || $(this).val() === ""){
                if($('div#review > form > span.field-validation-error').length === 0){
                    var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
                    $('div#review > form').prepend(errorMessage);
                };
                valid = false;
            };
        });

        if(valid){
            $.ajax({
                method: 'POST',
                data: $('div#review > form').serialize(),
                url: '/Post/AddReview',
                success: function(result){
                    if(result !== "Error"){
                        $('div#review > form').remove();
                        var $overlay = app.createOverlay();
                        var element = '<span class="box-shadow border-radius-small success text-center color-white"> Grazie, <br/ > per il tuo contributo</span>';
                        $overlay.after(element);
                    }
                }
            })
        };

    }

    //carousel Init
    var carouselInit = function(element){
        $(element).owlCarousel({
            responsiveClass:true,    
            responsive:{
                0:{
                    loop: false,
                    margin: 10,
                    items: 2,
                    nav: false,
                    dots: true,
                    dotsEach: 2, 
                },
                768:{
                    loop: false,
                    margin: 10,
                    items: 6,
                    nav: false,
                    dots: true,
                    dotsEach: 6, 
                },
                1024:{
                    loop: false,
                    margin: 20,
                    items: 10,
                    nav: false,
                }
            }
        })
    }

    return {
        relatedPost: relatedPost,
        getAlbum: getAlbum,
        displayAlbum : displayAlbum,
        changeDisplayAlbum: changeDisplayAlbum,
        sendReview: sendReview,
        validateReview: validateReview
    }

})();

var postUI = (function(){
    var DOM = {
        album: 'span.skeleton',
        albumList: 'ul.list li',
        btnSubmitReview: 'div#review > form input[type="submit"]'
    }
    
    return {
        DOMElement: DOM
    }
})();

var post = (function(postUI, postCtrl){
    var DOMElement = postUI.DOMElement;
    
    var init = function(){
        console.log('post init FE')

        postCtrl.relatedPost();
        postCtrl.getAlbum();
        postCtrl.validateReview();

        //DISPLAY ALBUM IMAGES
        $(document).on('click', DOMElement.album, postCtrl.displayAlbum);
        $(document).on('click', DOMElement.albumList, postCtrl.changeDisplayAlbum)
        
        //SEND REVIEW
        $(document).on('click', DOMElement.btnSubmitReview, postCtrl.sendReview);
    
    }
    
    return {
        init: init
    }
})(postUI, postController);