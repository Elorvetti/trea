"use strict";

var hpController = (function(){

    /* EMULATOR DEVICE: MOBILE, TABLET, DESKTOP */
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

    /* SAVE SETTING */
    var saveSetting = function(event){
        event.data = new app.Data(true, null, null, '/Backoffice/Home/Index', false, null);
        app.callback(event, getSetting);
    }
 
    /* GET SETTING */
    var getSetting = function(){
        fetch('Home/GetSetting', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        var headerImageurl = 'url('+ data.headerBackgroundImage +')';
                        var newsletterImageurl = 'url('+ data.newsletterBackgroundImage +')';

                        $('div.about-us > h2').text(data.headerTitolo);
                        $('input#titleHeader').val(data.headerTitolo);
                        $('div.about-us > p').html(data.headerTesto);
                        $('input#testoHeader').val(data.headerTesto);

                        $('section.header').css('background-image', headerImageurl);
                        $('input#idHeaderImage').val(data.headerImageId);
                        
                        $('div.newsletter').css('background-image', newsletterImageurl);
                        $('input#idNewsletterImage').val(data.newsletterImageId);
                    });
            });
    };

    /* MENU */
    var getMenu = function(){
        var event = {};
        event.data = new app.Data(false, null, null, 'Home/GetCategory', false, null);
        app.callback(event, createMenu);
    }

    var createMenu = function(data){
        var element = '';
        element = element + '<ul class="category text-right">';
        for(var i in data.categoryMenus){
            element = element + '<li id="' +data.categoryMenus[i].id + '" class="category margin-right-xsmall color-white" child="' + data.categoryMenus[i].hasChild  + '" display="false">' + data.categoryMenus[i].name;
            if(data.categoryMenus[i].hasChild){
                element = element + '<span class="fake-btn"></span>'   
            }
        }
        element = element + '</ul>'

        //Display for desktop
        $('form#container h1').after(element);
    }

    var getChildMenu = function(){
        var self = $(this).parent();
        var id = self.attr('id');
        var idPadre = 0;
        var livello = 1;

        if(self.attr('display') == 'false'){
            self.attr('display', 'true');
        } else {
            self.attr('display', 'false');

        }
        if(self.find('ul').length > 0){
            self.find('ul').remove();
        }

        if(self.hasClass('argument')){
            id = self.attr('category-id');
            idPadre = self.attr('id');
            livello = 2
        } else {
            $('div.nav-container').toggleClass('open-child');
        }

        var url = 'Home/GetArgument?categoryId=' + id + '&livello=' + livello + '&idPadre=' + idPadre;
        
        fetch(url, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        var element = '';
                        element = element + '<ul class="argument text-right background-color-blue">';
                        for(var i in data.argumentMenus){
                            element = element + '<li id="' + data.argumentMenus[i].id + '" class="argument color-white" child="' + data.argumentMenus[i].hasChild  + '" display="false" category-id="' + data.argumentMenus[i].categoryId + '">' + data.argumentMenus[i].name        
                            if(data.argumentMenus[i].hasChild){
                                element = element + '<span class="fake-btn"></span>'   
                            }
                        }
                        element = element + '</ul>'
                        if(self.attr('display') == 'true'){
                            self.append(element);
                        }
                    })
            })
    }

    /* MENU EVENT */
    var toggleMenu = function(){
        $(this).toggleClass('active');
        $('section#sidebarFE').toggleClass('active');

        if($('section#sidebarFE').hasClass('active')){
            $('form#container').css('overflow-y', 'hidden');
        } else {
            $('form#container').css('overflow-y', 'scroll');
        }
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
        $('div.about-us > h2').text(headerTitle);
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
                        element = element + '<div class="owl-carousel post owl-theme">';

                        for(var i in data){
                            element = element + '<div id="' + data[i].id + '" class="item carousel__photo text-center">';
                            element = element + '<section class="card-head border-radius-small box-shadow" style="background-image: url(\'' + data[i].coverImage + '\')"></section>'
                            element = element + '<section class="card-body padding-xsmall box-shadow margin-bottom-medium background-color-white">'
                            element = element + '<h3 class="font-weight-600">' + data[i].title + '</h3>';
                            element = element + '<p>' + data[i].testo + '</p>'
                            element = element + '</section>'
                            element = element + '<span class="text-center background-color-blue color-white border-radius-small text-uppercase btn readmore"> Leggi di più </span>'
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
            userId: '27660395555',
            accessToken: '27660395555.1677ed0.4396f6f9464a4e909c7f895c09fa2855',
            limit: 10
        }

        var url = 'https://api.instagram.com/v1/' + data.get + '/' + data.userId + '/media/recent?access_token=' + data.accessToken + '&count=' + data.limit;
        
        fetch(url)
            .then(function(res){
                res.json()
                    .then(function(insta){
                        element = element + '<div class="carousel-wrapper">';
                        element = element + '<div class="owl-carousel insta owl-theme">';

                        var images = insta.data;
                        for(var i in images){
                            element = element + '<div id="' + images[i].id + '" class="item carousel__photo box-shadow margin-xsmall">';
                            element = element + '<section class="image text-center" style="background-image: url(\'' + images[i].images.standard_resolution.url + '\')"></section>'
                            element = element + '<section class="user-data">'
                            element = element + '<span class="btn-circle avatar" style="background-image: url(\'' + images[i].user.profile_picture + '\')"></span>'
                            element = element + '<span class="user-name">'
                            element = element + '<p class="color-black">' + images[i].user.full_name + '</p>'
                            element = element + '<p class="color-black">@' + images[i].user.username + '</p>'
                            element = element + '</span>'
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

    /* CAROUSEL INIT */
    var carouselInit = function(){
        if($('form#container').attr('device') === 'mobile'){
            $(".owl-carousel.post").owlCarousel('destroy'); 
            $(".owl-carousel.post").owlCarousel({
                loop: false,
                margin: 20,
                nav: false,
                dots: true,
                items: 1,
            });
        } else if($('form#container').attr('device') === 'tablet'){
            $(".owl-carousel.post").owlCarousel('destroy'); 
            $(".owl-carousel.post").owlCarousel({
                loop: false,
                margin: 0,
                nav: false,
                dots: true,
                dotsEach: 2, 
                items: 2,
            });
        } else {
            $(".owl-carousel.post").owlCarousel('destroy'); 
            $(".owl-carousel.post").owlCarousel({
                loop: false,
                margin: 20,
                nav: false,
                items: 4
            });
        }
    }

    var carouselInsta = function(){
        if($('form#container').attr('device') === 'mobile'){
            $(".owl-carousel.insta").owlCarousel('destroy'); 
            $(".owl-carousel.insta").owlCarousel({
                loop: false,
                margin: 10,
                nav: false,
                dots: true,
                dotsEach: 1,
                items: 1
            });
        } else if($('form#container').attr('device') === 'tablet'){
            $(".owl-carousel.insta").owlCarousel('destroy'); 
            $(".owl-carousel.insta").owlCarousel({
                loop: false,
                margin: 20,
                nav: false,
                dots: true,
                items: 2,
                dotsEach: 2,
            });
        } else {
            $(".owl-carousel.insta").owlCarousel('destroy'); 
            $(".owl-carousel.insta").owlCarousel({
                loop: false,
                margin: 20,
                nav: false,
                dots: true,
                items: 2,
                dotsEach: 2,
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
        getChildMenu: getChildMenu,
        toggleMenu: toggleMenu,
        editHeader: editHeader,
        saveHeader: saveHeader,
        saveSetting: saveSetting, 
        getSetting: getSetting,
        getLastPost: getLastPost,
        instagram: instagram,
        summernoteInit: summernoteInit
    }

})();

var hpUI = (function(){
    var DOM = {
        btnDevice: 'ul#home > li',
        btnHamburger: 'span.menu',
        btnDisplayChild: 'ul > li.category[child="true"] > span.fake-btn',
        btnDisplayArgumentChild: 'ul > li.argument[child="true"] > span.fake-btn',
        btnEditorHeader: 'span#addEditorHeader',
        btnSaveHeader: 'input#save',
        btnSaveSetting: 'span#saveSetting',
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
        $('span#filter').remove();
        hpCtrl.setContainerWidth('mobile');

        //Get all category and argument for manage menu
        hpCtrl.getMenu();

        //Get setting
        hpCtrl.getSetting();

        //Get Last 5 post insert
        hpCtrl.getLastPost();

        //Add instagram photos
        hpCtrl.instagram(DOMElement.instagramContainer);

        $(document).on('click', DOMElement.btnDevice, hpCtrl.changeDeviceView);
        $(document).on('click', DOMElement.btnHamburger, hpCtrl.toggleMenu);
        $(document).on('click', DOMElement.btnDisplayChild, hpCtrl.getChildMenu);
        $(document).on('click', DOMElement.btnDisplayArgumentChild, hpCtrl.getChildMenu);
    
        //Editor header
        $(document).on('click', DOMElement.btnEditorHeader, hpCtrl.editHeader);
        $(document).on('click', DOMElement.btnSaveHeader, hpCtrl.saveHeader);

        //Save setting
        $(document).on('click', DOMElement.btnSaveSetting, hpCtrl.saveSetting);
    }

    return{
        init : init
    }

})(hpUI, hpController)