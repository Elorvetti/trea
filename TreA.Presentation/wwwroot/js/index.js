"use strict"
var appController = (function(){
    
    //Set header image, menu and abous us
    var getHeader = function(){
        //1. Menu 
        fetch('/Home/GetAllCategory', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        createMenu(data)
                    })
            })
        
        //3. Background-image
        fetch('/Home/GetHeader', {method: 'POST'})
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
        for(var i in data.categoryMenus){
            element = element + '<li id="' + data.categoryMenus[i].id + '" class="category margin-right-xsmall color-white" child="' + data.categoryMenus[i].hasChild  + '" display="false">';
            if(data.categoryMenus[i].hasChild){
                element = element + '<a class="color-white">' + data.categoryMenus[i].name + '</a>';
            } else {
                element = element + '<a class="color-white" href="' + data.categoryMenus[i].slug + '">' + data.categoryMenus[i].name + '</a>';
            }
        }
        element = element + '</ul>'

        //Display for desktop
        $('h1.title').after(element);
    };

    var getChildMenu = function(){
        var self = $(this);
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

        var url = '/Home/GetArgument?categoryId=' + id + '&livello=' + livello + '&idPadre=' + idPadre;
        
        fetch(url, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        var element = '';
                        element = element + '<ul class="argument padding-left-small margin-bottom-xsmall text-right background-color-blue">';
                        for(var i in data.argumentMenus){
                            element = element + '<li id="' + data.argumentMenus[i].id + '" class="argument color-white" child="' + data.argumentMenus[i].hasChild  + '" display="false" category-id="' + data.argumentMenus[i].categoryId + '">';
                            if(data.argumentMenus[i].hasChild){
                                element = element + '<a class="color-white">' + data.argumentMenus[i].name + '</a>';
                            } else{
                                element = element + '<a class="color-white" href="' + data.argumentMenus[i].slug + '">' + data.argumentMenus[i].name  + '</a>';
                            }
                        }
                        element = element + '</ul>'
                        if(self.attr('display') == 'true'){
                            self.append(element);
                        }
                    })
            })
    }

    var headerData = function(data){
        var url = 'url(' + data.headerBackgroundImage + ')';
        var aboutUsTitle = data.headerTitolo;
        var aboutUsText = data.headerTesto;

        if($('div#post-display').length == 0){
            $('header').css('background-image', url)
            $('div.about-us > h2').text(aboutUsTitle);
            $('div.about-us > p').html(aboutUsText);
        } else {
            $('div.about-us').remove();
            $('input.search-bar').addClass('post-view')
        }
        
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
                    $('div.nav-container').addClass('open-child')
                    break;
                case "open":
                    $(this).attr('child', 'close');
                    $('div.nav-container').removeClass('open-child')
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

    /* SEARCH */
    var search = function(){
        var value = $(this).val();
        var self = $(this);
        if(value .length >= 3){
            var url = '/Post/Search/' + value;
            fetch(url, {method: 'POST'})
                .then(function(res){
                    res.json()
                        .then(function(data){

                            if($('section#search-result').length > 0){
                                $('section#search-result').remove();
                            }
                            
                            var element = '';
                            
                            if($('div#post-display').length == 0){
                                element = element + '<section id="search-result" class="border-radius-small box-shadow background-color-white">';
                            } else {
                                element = element + '<section id="search-result" class="post-view border-radius-small box-shadow background-color-white">';
                            }

                            element = element + '<ul class="text-center">'
                            
                            for(var i in data){
                                element = element + '<li>' ;
                                element = element + '<span class="border-radius-small image" style="background-image: url(\'' + data[i].coverImage + '\')"></span>';
                                element = element + '<span class="padding-left-xsmall text-container">'
                                element = element + '<p class="font-weight-600 text-uppercase">' + data[i].title + '</p>';
                                element = element + '<p>' +  data[i].testo + '</p>';
                                element = element + '</span>'
                                element = element + '<a href="' +  data[i].slug  + '"></a>';
                                element = element + '</li>';
                            }
                            
                            element = element + '</ul>';
                            element = element + '</section>';

                            self.after(element);
                        })
                })
        } else {
            if($('section#search-result').length > 0){
                $('section#search-result').remove();
            }
        }
    }
    
    /* CREATE OVERLAY */
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

    return{
        getHeader: getHeader,
        toggleMenu: toggleMenu,
        toggleSubList: toggleSubList,
        getChildMenu: getChildMenu,
        createOverlay: createOverlay,
        fixNav: fixNav,
        search: search,
        removeOverlay: removeOverlay
    }
})();

var appUI = (function(){
    var DOM = {
        btnHamburger: 'span.menu',
        btnSubMenu: 'ul.category > li',
        btnDisplayChild: 'ul > li.category[child="true"]',
        btnDisplayArgumentChild: 'ul > li.argument[child="true"]',
        btnReturn: '.btn.return',
        searchBox: 'input.search-bar',
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
        $(document).on('click', DOMElement.btnDisplayChild, appCtrl.getChildMenu);
        $(document).on('click', DOMElement.btnDisplayArgumentChild, appCtrl.getChildMenu);
        //On scroll fix navbar
        $(window).on('scroll', appCtrl.fixNav)
        
        //Add event listerner to btn
        $(document).on('click', DOMElement.btnReturn, appCtrl.removeOverlay);

        //Search post
        $(document).on('keyup', DOMElement.searchBox, appCtrl.search);
    }

    return{
        init: init,
        createOverlay: appCtrl.createOverlay
    }
})(appUI, appController)