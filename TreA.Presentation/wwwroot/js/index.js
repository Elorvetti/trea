"use strict"
var appController = (function(){
    
    //Set header image, menu and abous us
    var getHeader = function(){
        //1. Menu 
        fetch('Home/GetAllCategory', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        createMenu(data)
                    })
            })

        //2. Sub Menu
        fetch('Home/GetAllArgument', {method: 'POST'})
        .then(function(res){
            res.json()
                .then(function(data){
                    createSubMenu(data)
                })
        })
        
        //3. Background-image
        fetch('Home/GetHeader', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        headerData(data)
                    })
            })
    };

    var createMenu = function(data){
        var element = '';
        element = element + '<ul class="category text-right">';

        for(var i in data){
            element = element + '<li id="' + data[i].id + '" class="margin-right-xsmall color-white" data-href="Route/Index' + data[i].slug + '">' + data[i].name + '</li>';
        }
        element = element + '</ul>'

        //Display for desktop
        $('h1.title').after(element);
    };

    var createSubMenu = function(data){
        var elementToAppend = '';
        elementToAppend = elementToAppend + '<ul class="border-radius-small">';
                        
        for(var i in data){
            elementToAppend = elementToAppend + '<li id="' + data[i].id + '" class="padding-left-small color-white" data-href="Route/Index' + data[i].slug + '">' + data[i].name + '</li>';
                            
            var element = $('ul.category > li').filter(function(){
                return $(this).attr('id') == data[i].categoryId;
            });

        }

        elementToAppend = elementToAppend + '</ul>';

        element.attr('child', 'close');
        element.append(elementToAppend);
    };

    var headerData = function(data){
        var url = 'url(' + data.headerBackgroundImage + ')';
        var aboutUsTitle = data.headerTitolo;
        var aboutUsText = data.headerTesto;

        $('header').css('background-image', url)
        $('div.about-us > h3').text(aboutUsTitle);
        $('div.about-us > p').html(aboutUsText);
    }

    /* TOGGLE MENU AND SUB MENU*/
    var toggleMenu = function(){
        $(this).toggleClass('active');
        $('section#sidebar').toggleClass('active');

        if($('section#sidebar').hasClass('active')){
            $('body').css('overflow-y', 'hidden');
        } else {
            $('body').css('overflow-y', 'scroll');
        }
    }

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

    var fixNav = function(event){
        if(event.currentTarget.scrollY >= 50){
            $('header > div.nav-container').addClass('fixed')
        } else {
            $('header > div.nav-container').removeClass('fixed')
        }
    }

    //CREATE OVERLAY
    var createOverlay = function(){
        
        var overlay = '';
        var overlay = '<div id="overlay"><span id="close" class="btn close"></span></div>';
    
        //append overlay to DOM
        $('body').append(overlay);
        $('body').css('overflow', 'hidden');

        //trigger close click
        $(document).on('click', '#close', removeOverlay);

        //return selector for append element to overlay
        var $selector = $('#close');

        return $selector;
    };
    
    var removeOverlay = function(){
        $('div#overlay').remove();
        $('body').css('overflow-y', 'scroll');
    };

    var routing = function(){
        var url = $(this).attr('data-href');
        fetch(url, {method: 'POST'});
    }


    return{
        getHeader: getHeader,
        toggleMenu: toggleMenu,
        toggleSubList: toggleSubList,
        createOverlay: createOverlay,
        fixNav: fixNav,
        removeOverlay: removeOverlay,
        routing: routing
    }
})();

var appUI = (function(){
    var DOM = {
        btnHamburger: 'span.menu',
        btnSubMenu: 'ul.category > li',
        btnReturn: '.btn.return',
        btnRoute: '*[data-href]'
    }

    return {
        DOMElement: DOM
    }
})();

var app = (function(appUI, appCtrl){
    var DOMElement = appUI.DOMElement;

    var init = function(){
        appCtrl.getHeader();

        $(document).on('click', DOMElement.btnHamburger, appCtrl.toggleMenu);
        $(document).on('click', DOMElement.btnSubMenu, appCtrl.toggleSubList);

        //On scroll fix navbar
        $(window).on('scroll', appCtrl.fixNav)
        
        //Add event listerner to btn
        $(document).on('click', DOMElement.btnReturn, appCtrl.removeOverlay);

        //menu navigation
        $(document).on('click', DOMElement.btnRoute, appCtrl.routing)
    }

    return{
        init: init,
        createOverlay: appCtrl.createOverlay
    }
})(appUI, appController)