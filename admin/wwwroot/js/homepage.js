"use strict";

var hpController = (function(){

    /* EMULATOR DEVICE WIDTH */
    var changeDeviceView = function(){
        $('ul#home > li').each(function(){
            $(this).removeClass('active');
        })

        $(this).addClass('active');
        
        var deviceType = $(this).attr('device');
        setContainerWidth(deviceType);
        carouselInit();
    }

    var setContainerWidth = function(deviceType){
        var width = "";
        switch(deviceType){
            case "mobile":
                width = 320 + 'px';            
                break;
            case "tablet":
                width = 768 + 'px';
                break;
            case "desktop":
                width= 1440 + 'px';
                break;
        }

        $('form#container').css('width', width);
        $('form#container').attr('device', deviceType);
    }

    /* MENU */
    var toggleSubList = function(){
        var subchildAttr = $(this).attr('child');
        if(subchildAttr !== undefined){
            switch (subchildAttr){
                case "close":
                    $(this).attr('child', 'open');
                    break;
                case "open":
                    $(this).attr('child', 'close');
                    break;
            }
        }
    }

    var toggleMenu = function(){
        $(this).toggleClass('active');
        $('section#sidebarFE').toggleClass('active');

        if($('section#sidebarFE').hasClass('active')){
            $('form#container').css('overflow-y', 'hidden');
        } else {
            $('form#container').css('overflow-y', 'scroll');
        }
    }

    var getMenu = function(){
        var event = {};
        event.data = new app.Data(false, null, 'Home/GetAllCategory', false, null);
        app.callback(event, createMenuList);

        getSubMenu();
    }

    var getSubMenu = function(){
        var url = 'Home/GetAllArgument';
        fetch(url,{method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        var elementToAppend = '';
                        elementToAppend = elementToAppend + '<ul class="border-radius-small">';
                        for(var i in data){
                            elementToAppend = elementToAppend + '<li id="' + data[i].id + '" class="padding-left-small color-white">' + data[i].name + '</li>';
                            
                            var element = $('ul.category > li').filter(function(){
                                return $(this).attr('id') == data[i].categoryId;
                            });
                            
                        }
                        elementToAppend = elementToAppend + '</ul>';

                        element.attr('child', 'close');
                        element.append(elementToAppend);
                    })
            })
    }

    var createMenuList = function(data){
        var element = '';
        element = element + '<ul class="category text-right">';
        for(var i in data){
            element = element + '<li id="' + data[i].id + '" class="margin-right-xsmall color-white">' + data[i].name + '</li>';
        }
        element = element + '</ul>'

        //Display for desktop
        $('form#container h1').after(element);
    }

    /* EDIT HEADER */
    var editHeader = function(){
        var $overlay = app.createOverlay();
        var elementToAppend = '';
        
        var headerTitle = $('input#titleHeader').val();
        var headerText = $('input#testoHeader').val();
        
        elementToAppend = elementToAppend  + '<form id="edit-header" class="box-shadow border-radius-small text-center background-color-white" autocomplete="off">';
        elementToAppend = elementToAppend  + '<input name="title" class="name" id="title" placeholder="Titolo" autocolplete="off" value="' + headerTitle + '" required />';
        elementToAppend = elementToAppend  + '<textarea name="testo" id="editor">' + headerText + '</textarea>';
        
        elementToAppend = elementToAppend + '<div class="text-right">';
        elementToAppend = elementToAppend + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        elementToAppend = elementToAppend + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        elementToAppend = elementToAppend + '</div>';
        
        elementToAppend = elementToAppend  + '</form>';
        
        $overlay.after(elementToAppend);

        summernoteInit($('#editor'));
    }

    var saveHeader = function(event){
        event.preventDefault();

        var headerTitle = $('form#edit-header > input').val();
        var headerText = $('form#edit-header > textarea').val();

        //update input
        $('input#titleHeader').val(headerTitle);
        $('input#testoHeader').val(headerText);

        //update view 
        $('div.about-us > h3').text(headerTitle);
        $('div.about-us > p').html(headerText);

        $('#overlay').remove();
    }

    /* LAST 5 POST */
    var getLastPost = function(){
        var element = ''
        fetch('Post/GetLast/4', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        element = element + '<div class="carousel-wrapper">';
                        element = element + '<div class="owl-carousel owl-theme">';
                        
                        for(var i in data){
                            element = element + '<div id="' + data[i].id + '" class="item carousel__photo border-radius-small box-shadow" style="background-image: url(\'' + data[i].coverImage + '\')">';
                            element = element + '<h3 class="text-center color-white border-radius-small">' + data[i].title + '</h3>';
                            element = element + '</div>';
                        }
                        element = element + '</div>';
                        element = element + '</div>';

                        $('div#lastPost').append(element);
                        
                        //Init carousel
                        carouselInit();
                    })
            })
    }

    /* INSTAGRAM PHOTOS */
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
                        carouselInsta();

                    })
            })

    }

    var youtube = function(elem){
        var element = '';
        var data = {
            part: 'snipped',
            chanelId: 'UCAwsqjnD-64ZpWJ-umXfTaA'
        }

        var url = 'https://www.googleapis.com/youtube/v3/playlists?part='+ data.part +'&channelId=' + data.chanelId;
        fetch(url)
            .then(function(res){
                res.json()
                    .then(function(data){
                        console.log(data)    
                })
            })
    }

    /* CAROUSEL INIT */
    var carouselInit = function(){
        if($('form#container').attr('device') === 'mobile'){
            $(".owl-carousel").owlCarousel('destroy'); 
            $(".owl-carousel").owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                items: 2,
            });
        } else if($('form#container').attr('device') === 'tablet'){
            $(".owl-carousel").owlCarousel('destroy'); 
            $(".owl-carousel").owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                dotsEach: 2, 
                items: 2,
            });
        } else {
            $(".owl-carousel").owlCarousel('destroy'); 
            $(".owl-carousel").owlCarousel({
                loop: false,
                margin: 20,
                nav: false,
                items: 4,
            });
        }
    }

    var carouselInsta = function(){
        if($('form#container').attr('device') === 'mobile'){
            $(".owl-carousel").owlCarousel('destroy'); 
            $(".owl-carousel").owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                items: 2,
            });
        } else if($('form#container').attr('device') === 'tablet'){
            $(".owl-carousel").owlCarousel('destroy'); 
            $(".owl-carousel").owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                dotsEach: 2, 
                items: 2,
            });
        } else {
            $(".owl-carousel").owlCarousel('destroy'); 
            $(".owl-carousel").owlCarousel({
                loop: false,
                margin: 20,
                nav: false,
                items: 4,
            });
        }
    }

    /* SUMMERNOTE */
    var summernoteInit = function(elem){
        elem.summernote({
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['height', ['height']],
                ['insert', ['link']],
                ['view', ['fullscreen', 'codeview']],
                ['style', ['style']],
            ],
        });

    }  


    return{
        changeDeviceView: changeDeviceView,
        setContainerWidth: setContainerWidth,
        getMenu: getMenu,
        toggleMenu: toggleMenu,
        toggleSubList: toggleSubList,
        editHeader: editHeader,
        saveHeader: saveHeader, 
        getLastPost: getLastPost,
        instagram: instagram,
        youtube: youtube,
        summernoteInit: summernoteInit
    }

})();

var hpUI = (function(){
    var DOM = {
        btnDevice: 'ul#home > li',
        btnHamburger: 'span.menu',
        btnSubMenu: 'ul.category > li',
        btnEditorHeader: 'span#addEditorHeader',
        btnSaveHeader: 'input#save',
        instagramContainer: 'div#instafeed',
    }

    return {
        DOMElement : DOM
    }

})();

var hp = (function(hpUI, hpCtrl){
    var DOMElement = hpUI.DOMElement;

    var init = function(){
        console.log('hp init');

        $('span#add').remove();
        hpCtrl.setContainerWidth('mobile');

        //Get all category and argument for manage menu
        hpCtrl.getMenu();

        //Get Last 5 post insert
        hpCtrl.getLastPost();

        //Add instagram photos
        hpCtrl.instagram(DOMElement.instagramContainer);

        //Add video from youtube playlists
        hpCtrl.youtube();
        
        $(document).on('click', DOMElement.btnDevice, hpCtrl.changeDeviceView);
        $(document).on('click', DOMElement.btnHamburger, hpCtrl.toggleMenu);
        $(document).on('click', DOMElement.btnSubMenu, hpCtrl.toggleSubList);

        //Editor header
        $(document).on('click', DOMElement.btnEditorHeader, hpCtrl.editHeader);
        $(document).on('click', DOMElement.btnSaveHeader, hpCtrl.saveHeader);
    }

    return{
        init : init
    }

})(hpUI, hpController)