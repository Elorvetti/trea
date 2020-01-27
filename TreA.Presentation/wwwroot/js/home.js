var homeController = (function(){
   
    /* INIT CAROUSEL */
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
                    items: 2,
                    nav: false,
                    dots: true,
                    dotsEach: 2, 
                },
                1024:{
                    loop: false,
                    margin: 20,
                    items: 4,
                    nav: false,
                }
            }
        })
    }

    /* INSTAGRAM */
    var instagram = function(elem){
        var element = ''

        var  data = {
            get: 'users',
            userId: '2276800813',
            accessToken: '2276800813.1677ed0.654454a21887433286b9b67dfdd9c767',
            limit: 10
        }

        var url = 'https://api.instagram.com/v1/' + data.get + '/' + data.userId + '/media/recent?access_token=' + data.accessToken + '&count=' + data.limit;
        
        fetch(url)
            .then(function(res){
                res.json()
                    .then(function(insta){
                        element = element + '<div class="carousel-wrapper">';
                        element = element + '<div class="owl-carousel owl-theme">';

                        var images = insta.data;

                        for(var i in images){
                            element = element + '<div id="' + images[i].id + '" class="item carousel__photo border-radius-small box-shadow" style="background-image: url(\'' + images[i].images.standard_resolution.url + '\')">';
                            element = element + '<section class="interactions border-radius-small text-center">'
                            element = element + '<h3 class="text-center color-white border-radius-small padding-top-large">' + images[i].caption.text + '</h3>';
                            element = element + '<span class="text-center margin-right-small color-white border-radius-small likes">' + images[i].likes.count + '</span>';
                            element = element + '<span class="text-center color-white border-radius-small comments">' + images[i].comments.count + '</span>';
                            element = element + '</section>'
                            element = element + '</div>';
                        }

                        element = element + '</div>';
                        element = element + '</div>';

                        $(elem).append(element);

                        //Init carousel
                        carouselInit('.owl-carousel');

                    })
            })

    }

    return {
        carouselInit: carouselInit,
        instagram: instagram
    }
})();

var homeUI = (function(){
    var DOM = {
        carousel: '.owl-carousel',
        instagramContainer: 'div#instafeed'
    }

    return {
        DOMElement: DOM
    }
})();

var home = (function(homeUI, homeCtrl){
    var DOMElement = homeUI.DOMElement;

    var init = function(){
        homeCtrl.carouselInit(DOMElement.carousel);
        homeCtrl.instagram(DOMElement.instagramContainer);

    }

    return {
        init : init
    }
})(homeUI, homeController);