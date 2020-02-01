var homeController = (function(){
   
    /* INIT CAROUSEL */
    var carouselInit = function(element){
        $(element).owlCarousel({
            responsiveClass:true,    
            responsive:{
                0:{
                    loop: false,
                    margin: 40,
                    items: 1,
                    nav: false,
                    dots: true,
                    dotsEach: 1, 
                },
                768:{
                    loop: false,
                    margin: 20,
                    items: 2,
                    nav: false,
                    dots: true,
                    dotsEach: 2, 
                },
                1024:{
                    loop: false,
                    margin: 20,
                    items: 3,
                    nav: false,
                },
                1440:{
                    loop: false,
                    margin: 20,
                    items: 5,
                    nav: false,
                },
            }
        })
    }

    var carouselFiftyInit = function(element){
        $(element).owlCarousel({
            responsiveClass:true,    
            responsive:{
                0:{
                    loop: false,
                    margin: 40,
                    items: 1,
                    nav: false,
                    dots: true,
                    dotsEach: 1, 
                },
                768:{
                    loop: false,
                    margin: 20,
                    items: 2,
                    nav: false,
                    dots: true,
                    dotsEach: 2, 
                },
                1024:{
                    loop: false,
                    margin: 20,
                    items: 1,
                    nav: false,
                },
                1440:{
                    loop: false,
                    margin: 20,
                    items: 2,
                    nav: false,
                },
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
                        console.log(insta)
                        var images = insta.data;
                        for(var i in images){
                            element = element + '<div id="' + images[i].id + '" class="item carousel__photo box-shadow margin-xsmall">';
                            element = element + '<section class="image text-center" style="background-image: url(\'' + images[i].images.standard_resolution.url + '\')"></section>'
                            element = element + '<section class="user-data">'
                            element = element + '<span class="btn-circle avatar" style="background-image: url(\'' + images[i].user.profile_picture + '\')"></span>'
                            element = element + '<span class="user-name padding-left-small">'
                            element = element + '<p class="color-black">' + images[i].user.full_name + '</p>'
                            element = element + '<p class="color-black">@' + images[i].user.username + '</p>'
                            element = element + '</span>'
                            element = element + '</section>'
                            element = element + '<a class="link" target="_blank" href="' + images[i].link  + '"></a>' 
                            element = element + '</div>';
                        }

                        element = element + '</div>';
                        element = element + '</div>';

                        $(elem).append(element);

                        //Init carousel
                        carouselFiftyInit('.owl-carousel');

                    })
            })

    }

    return {
        carouselInit: carouselInit,
        carouselFiftyInit: carouselFiftyInit,
        instagram: instagram,
    }
})();

var homeUI = (function(){
    var DOM = {
        carousel: '.owl-carousel',
        carouselPodcast: '.owl-carousel-podcast',
        instagramContainer: 'div#instafeed',
    }

    return {
        DOMElement: DOM
    }
})();

var home = (function(homeUI, homeCtrl){
    var DOMElement = homeUI.DOMElement;

    var init = function(){
        homeCtrl.carouselInit(DOMElement.carousel);
        homeCtrl.carouselFiftyInit(DOMElement.carouselPodcast);
        homeCtrl.instagram(DOMElement.instagramContainer);
    }

    return {
        init : init
    }
})(homeUI, homeController);