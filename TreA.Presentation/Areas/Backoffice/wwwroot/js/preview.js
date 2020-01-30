var previewController = (function(){
    
    //remove sidebar
    var removeSidebar = function(){
        $('#sidebar').remove();
        $('header + section').remove();
    }

    //Update Header
    var changeHeaderImage = function(){
        var coverImagePath = $('input#coverImage').val();
        var backgroundImage = 'url("' + coverImagePath + '")';
        $('section.header').css('background-image', backgroundImage);
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

            if(i === 0){
                if($(this).css('background-image').indexOf('Images') > 0){
                    element = element + '<span id="' + i +'" class="image active border-radius-small" style="background-image:'+ $(this).css('background-image').replace(/"/g, "") +'"></span>'
                } else {
                    element = element + '<span id="' + i +'" class="image active border-radius-small"><video><source src=' +  $(this).find('source').attr('src').replace(/"/g, "") +'"></video></span>'
                }

                element = element + '<ul class="list text-center owl-carousel border-radius-small">'
                if($(this).css('background-image').indexOf('Images') > 0){
                    element = element + '<li id="' + i +'" class="image active border-radius-small" style="background-image:'+ $(this).css('background-image').replace(/"/g, "") +'"></li>'
                } else {
                    element = element + '<li id="' + i +'" class="image active border-radius-small"><video><source src="' +  $(this).find('source').attr('src').replace(/"/g, "") +'"></video></li>'
                }
            
            } else {

                if($(this).css('background-image').indexOf('Images') > 0){
                    element = element + '<li id="' + i +'" class="image border-radius-small" style="background-image:'+ $(this).css('background-image').replace(/"/g, "") +'"></li>'
                } else {
                    element = element + '<li id="' + i +'" class="image border-radius-small"><video><source src="' +  $(this).find('source').attr('src').replace(/"/g, "") +'"></video></li>'
                }
            }
        })
        element = element + '</ul>'

            $('div#overlay').addClass('album')
            $overlay.after(element);
            carouselGalleryInit('.owl-carousel')
    }

    //navigation in album
    var changeDisplayAlbum = function(){
        var id = $(this).attr('id');

        //remove active class
        $('ul.list li').each(function(){
            $(this).removeClass('active');
        })

        if($(this).css('background-image').indexOf('Images') > 0){
            var backroundImage =  $(this).css('background-image').replace(/"/g, "");
            $('span > video').remove();
            $('span.image.active').css('background-image', backroundImage)
        } else {
            var videoSrc = $(this).find('source').attr('src').replace(/"/g, "");
            var element = '';
            $('span.image.active').css('background-image', element);
            element = element + '<video controls><source src=' + videoSrc +'></video>'
            $('span.image.active').append(element);
        }

        //change display image and id
        $('span.image.active').attr('id', id);

        $(this).addClass('active');
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

    var carouselGalleryInit = function(element){
        $(element).owlCarousel({
            responsiveClass:true,    
            responsive:{
                0:{
                    loop: false,
                    margin: 10,
                    items: 3,
                    nav: false,
                    dots: false,
                    dotsEach: 1, 
                    stagePadding: 20
                },
                768:{
                    loop: false,
                    margin: 10,
                    items: 3,
                    nav: false,
                    dots: false,
                    dotsEach: 1, 
                    stagePadding: 50
                },
                1024:{
                    loop: false,
                    margin: 15,
                    items: 5,
                    nav: true,
                    dots: false,
                    stagePadding: 40
                },
                1440:{
                    loop: false,
                    margin: 5,
                    items: 12,
                    nav: true,
                    dots: false,
                    stagePadding: 40
                }
            }
        })
    }

    return {
        removeSidebar: removeSidebar,
        changeHeaderImage: changeHeaderImage,
        relatedPost: relatedPost,
        relatedArgument: relatedArgument,
        carouselInit: carouselInit,
        showGallery: showGallery,
        changeDisplayAlbum: changeDisplayAlbum,
    }

})();

var previewUI = (function(){
    var DOM = {
        gallery: 'ul#gallery.owl-carousel',
        galleryImages: 'li.gallery',
        imageOfGallery: 'li.image',
        btnSubmitReview: 'div#review > form input[type="submit"]'
    }
    
    return {
        DOMElement: DOM
    }
})();

var preview = (function(previewUI, previewCtrl){
    var DOMElement = previewUI.DOMElement;
    
    var init = function(){
        console.log('preview init FE')

        previewCtrl.removeSidebar();
        previewCtrl.changeHeaderImage();
        previewCtrl.relatedPost();
        previewCtrl.relatedArgument();
        previewCtrl.carouselInit(DOMElement.gallery);
        
        //SHOW GALLERY
        $(document).on('click', DOMElement.galleryImages, previewCtrl.showGallery)
        $(document).on('click', DOMElement.imageOfGallery, previewCtrl.changeDisplayAlbum)
    
    }
    
    return {
        init: init
    }
})(previewUI, previewController);