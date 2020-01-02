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

    /* LAST 5 POST */
    var getLastPost = function(){
        var element = ''
        fetch('Post/GetLast/4', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        element = element + '<div class="carousel-wrapper">';
                        element = element + '<div class="carousel">';
                        
                        for(var i in data){
                            element = element + '<section id="' + data[i].id + '" class="item carousel__photo border-radius-small box-shadow" style="background-image: url(\'' + data[i].coverImage + '\')">';
                            element = element + '<h3 class="text-center color-white border-radius-small">' + data[i].title + '</h3>';
                            element = element + '</section>';
                        }

                        element = element + '<div class="carousel__button--next box-shadow"></div>';
                        element = element + '<div class="carousel__button--prev box-shadow"></div>';
                        element = element + '</div>';
                        element = element + '</div>';

                        $('div#lastPost').append(element);
                        
                        //Init carousel
                        carousel.init();
                    })
            })
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
                ['insert', ['link',"picture"]],
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
        getLastPost: getLastPost,
        summernoteInit: summernoteInit
    }

})();

var hpUI = (function(){
    var DOM = {
        btnDevice: 'ul#home > li',
        btnHamburger: 'span.menu',
        btnSubMenu: 'ul.category > li'
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

        //Add editor
        hpCtrl.summernoteInit($('#aboutUsTesto'));
        hpCtrl.summernoteInit($('#newsletterTesto'));

        //Get all category and argument for manage menu
        hpCtrl.getMenu();

        //Get Last 5 post insert
        hpCtrl.getLastPost();
        
        $(document).on('click', DOMElement.btnDevice, hpCtrl.changeDeviceView);
        $(document).on('click', DOMElement.btnHamburger, hpCtrl.toggleMenu);
        $(document).on('click', DOMElement.btnSubMenu, hpCtrl.toggleSubList);


    }

    return{
        init : init
    }

})(hpUI, hpController)