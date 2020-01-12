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
            element = element + '<li id="' + data[i].id + '" class="margin-right-xsmall color-white" data-href="' + data[i].slug + '">' + data[i].name + '</li>';
        }
        element = element + '</ul>'

        //Display for desktop
        $('h1.title').after(element);
    };

    var createSubMenu = function(data){
        var elementToAppend = '';
        elementToAppend = elementToAppend + '<ul class="border-radius-small">';
                        
        for(var i in data){
            elementToAppend = elementToAppend + '<li id="' + data[i].id + '" class="padding-left-small color-white" data-href="' + data[i].slug + '">' + data[i].name + '</li>';
                            
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

    return{
        getHeader: getHeader,
        toggleMenu: toggleMenu,
        toggleSubList: toggleSubList
    }
})();

var appUI = (function(){
    var DOM = {
        btnHamburger: 'span.menu',
        btnSubMenu: 'ul.category > li'
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
    }

    return{
        init: init
    }
})(appUI, appController)