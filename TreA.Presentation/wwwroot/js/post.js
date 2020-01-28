var postController = (function(){
    
    //Update Header
    var changeHeaderImage = function(){
        var coverImagePath = $('input#coverImage').val();
        var backgroundImage = 'url("' + coverImagePath + '")';
        $('header').css('background-image', backgroundImage);
    }

    //Display Related Post / Argument
    var relatedPost = function(){
        var activePost = $('div#post-display').attr('post');
        
        $('div.related-post > ul > li').each(function(){
            $(this).removeClass('active');

            if($(this).attr('id') == activePost){
                $(this).addClass('active');
            }
        })
    }

    var relatedArgument = function(){
        var activeArgument = $('div#post-display').attr('argument');
        
        $('div.related-argument > ul > li').each(function(){
            $(this).removeClass('active');

            if($(this).attr('id') == activeArgument){
                $(this).addClass('active');
            }
        })
    }

    //Show gallery 
    var showGallery = function(){
        var $overlay = app.createOverlay();
        var element = '';
        element = element + '<div class="album-display background-color-white margin-top-medium text-center">'
        $('li.gallery').each(function(i, e){
            console.log($(this).css('background-image'))
            if(i === 0){
                if($(this).css('background-image').indexOf('Images') > 0){
                    element = element + '<span id="' + i +'" class="image active border-radius-small" style="background-image:'+ $(this).css('background-image') +'></span>'
                } else {
                    element = element + '<span id="' + i +'" class="image active border-radius-small"><video><source src="' +  $(this).find('source').attr('src') +'"></video></span>'
                }

                element = element + '<ul class="list text-center owl-carousel border-radius-small">'
                if($(this).css('background-image').indexOf('Images') > 0){
                    element = element + '<span id="' + i +'" class="image active border-radius-small" style="background-image:'+ $(this).css('background-image') +'"></span>'
                } else {
                    element = element + '<span id="' + i +'" class="image active border-radius-small"><video><source src="' +  $(this).find('source').attr('src') +'"></video></span>'
                }
                element 
            } else {

                if($(this).css('background-image').indexOf('Images') > 0){
                    element = element + '<span id="' + i +'" class="image active border-radius-small" style="background-image:'+ $(this).css('background-image') +')"></span>'
                } else {
                    element = element + '<span id="' + i +'" class="image active border-radius-small"><video><source src="' +  $(this).find('source').attr('src') +'"></video></span>'
                }
            }
        })
        element = element + '</ul>'

            $('div#overlay').addClass('album')
            $overlay.after(element);
            carouselInit('.owl-carousel')
    }

    //var displayAlbumVideos = function(id){
    //    fetch('/Post/DisplayAlbumVideo/' + id, {method: 'POST'})
    //    .then(function(res){
    //        res.json()
    //            .then(function(data){
    //                  //display overlay 
    //                  var $overlay = app.createOverlay();
    //                    
    //                  //element to append
    //                  var element = '';
    //                  element = element + '<div class="album-display background-color-white margin-top-medium text-center">'
    //                  
    //                  for(var video in data.videoPath){
    //                      if(video == 0){
    //                        element = element + '<video class="border-radius-small" controls><source src="' +  data.videoPath[video] + '"></video>';
    //                        element = element + '<ul class="list owl-carousel text-center border-radius-small">'
    //                        element = element + '<li id="' + video +'" class="active border-radius-small">'
    //                        element = element + '<video><source src="' + data.videoPath[video]  + '"></video>'
    //                        element = element + '</li>'
    //                      } else {
    //                          element = element + '<li id="' + video +'" class="border-radius-small">'
    //                          element = element + '<video><source src="' + data.videoPath[video]  + '"></video>'
    //                          element = element + '</li>'
    //                      }
    //                      if(video == data.videoPath.length){
    //                          element = element + '</ul>'
    //                      }
    //                  }
    //                  
    //                  $('div#overlay').addClass('album');
    //                  $overlay.after(element);
    //                  carouselInit('.owl-carousel')
    //            })
    //    })
    //}

    //navigation in album
    //var changeDisplayAlbum = function(){
    //    var backgroundImage =  $(this).attr('style');
    //    var id = $(this).attr('id');
//
    //    //remove active class
    //    $('ul.list li').each(function(){
    //        $(this).removeClass('active');
    //    })
//
    //    //change display image and id
    //    $('span.image.active').attr('style', backgroundImage);
    //    $('span.image.active').attr('id', id);
//
    //    $(this).addClass('active');
    //}

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
                    items: 1,
                    nav: true,
                    dots: false,
                    dotsEach: 1, 
                },
                768:{
                    loop: false,
                    margin: 10,
                    items: 1,
                    nav: true,
                    dots: false,
                    dotsEach: 1, 
                },
                1024:{
                    loop: false,
                    margin: 20,
                    items: 1,
                    nav: true,
                    dots: false
                }
            }
        })
    }

    return {
        changeHeaderImage: changeHeaderImage,
        relatedPost: relatedPost,
        relatedArgument: relatedArgument,
        carouselInit: carouselInit,
        showGallery: showGallery,
        sendReview: sendReview,
        validateReview: validateReview
    }

})();

var postUI = (function(){
    var DOM = {
        gallery: 'ul#gallery.owl-carousel',
        galleryImages: 'li.gallery',
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

        postCtrl.changeHeaderImage();
        postCtrl.relatedPost();
        postCtrl.relatedArgument();
        postCtrl.carouselInit(DOMElement.gallery);
        postCtrl.validateReview();
        
        //SHOW GALLERY
        $(document).on('click', DOMElement.galleryImages, postCtrl.showGallery)

        //SEND REVIEW
        $(document).on('click', DOMElement.btnSubmitReview, postCtrl.sendReview);
    
    }
    
    return {
        init: init
    }
})(postUI, postController);