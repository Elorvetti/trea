"use strict";

var appController = (function(){

    var feedbackEvent = function(success, message){
        var element;
        
        if(success){
            element = '<span class="box-shadow border-radius-small success text-center color-white">';    
        } else {
            element = '<span class="box-shadow border-radius-small error text-center color-white">';    
        }
        element = element + message;
        element = element + '</span>';

        return element;
        
    }

    var callbackServer = function(event, callback){
        var parameter = {
            post : event.data.post,
            url: event.data.url,
        }

        if(event.data.post){
            event.preventDefault();

            var data = $('form').serialize();

            callbackPOST(event, data, parameter.url, callback)
           
        } else {
            callbackGET(event, parameter.url, callback);
        }
    }

    var callbackUpload = function(event, callback){
        event.preventDefault();

        var files = $(event.data.input).prop('files');
        var data = new FormData();

        for (var i = 0; i != files.length; i++) {
            data.append("files", files[i]);
        }

        $.ajax({
            method: 'POST',
            contentType: false,
            processData: false,
            data: data,
            url: event.data.url,
            success: function (result) {    
                if(result === "Error"){
                    feedbackEvent(false, 'Dati non validi');
                    return;
                }
                callback(event)
            }
        })

    }

    var callbackPOST = function(event, data, url, callback){

        $.ajax({
            method: 'POST',
            data: data,
            url: url,
            success: function (result) {    
                if(result === "Error"){
                    feedbackEvent(false, 'Dati non validi');
                    return;
                }
                callback(event)
            }
        })

    }

    var callbackGET = function(event, url, callback){
        fetch(url,{method: 'POST'})
                .then(function(res){
                    return res.json()
                        .then(function(data){
                            if(event.data.updateList){
                                for(var i in data){
                                    var element = callback(data, i);
                                    $(event.data.mainList).append(element);
                                }
                            } else {
                                var $overlay = createOverlay();
                                var element = callback(data);
                                $overlay.after(element);
                            }
                        })
                })
    }

    var createOverlay = function(){
        
        var overlay = '';
        var overlay = '<div id="overlay"><span id="close" class="btn close"></span></div>';
    
        //append overlay to DOM
        $('body').append(overlay);

        //trigger close click
        $(document).on('click', '#close', removeOverlay);

        //return selector for append element to overlay
        var $selector = $('#close');

        return $selector;
    }
    
    var removeOverlay = function(){
        $('div#overlay').remove();
    }

    //Constructor
    var Data = function(post, id, url, updateList, mainList){
        this.post = post;
        this.id = id;
        if(id === null || id === undefined){
            this.url = url;
        } else {
            this.url = url + this.id;
        }
        this.updateList = updateList;
        this.mainList = mainList;
    }

    return{
        createOverlay: createOverlay,
        removeOverlay: removeOverlay, 
        Data: Data,
        callbackServer: callbackServer,
        feedbackEvent: feedbackEvent,
        callbackUpload: callbackUpload
    }

})();

var appUI = (function(){

    var toogleSidebar = function(){
        if($(DOMSidebar.element).hasClass(DOMSidebar.showClass)){
            $(DOMSidebar.element).removeClass(DOMSidebar.showClass)
        } else {
            $(DOMSidebar.element).addClass(DOMSidebar.showClass)
        }
    }

    var sectionActive = function(){
        var section = DOMSidebar.section;
        var mainId = $(DOMElement.Main.list).attr('id')
        
        //if section have same id of area add class active else remove it
        for(var menu in section){
            var menuId = $(section[menu]).attr('id')
            if(menuId === mainId){
                $(section[menu]).addClass('active');
            } else{ 
                $(section[menu]).removeClass('active');
            }
            
        }
    }
    
    var DOMSidebar = {
        element : '#sidebar',
        showClass: 'active',
        section: {
            user: 'li#user',
            category: 'li#category',
            photo: 'li#photo',
            video: 'li#video',
            podcast: 'li#podcast',
            arguments: 'li#argument',
            post: 'li#post'    
        }
    }

    var DOMElement = {
        Menu: {
            btn: '.btn-hamburger',
        },
        Main: {
            btnReturn: '.btn.return',
            list: 'ul.list'
        }
    }

    return {
        DOM: DOMElement,
        sectionActive: sectionActive,
        toogleSidebar: toogleSidebar,
    }

})();

var app = (function(UICtrl, appCtrl){
    var DOMElement = UICtrl.DOM;
    
    var init = function(){
        console.log('App init');

        //Display sidebar on mobile view
        $(document).on('click', DOMElement.Menu.btn, appUI.toogleSidebar);

        //Toggle class Active to sublist menu
        $(window).on('load', appUI.sectionActive);

        //Add event listerner to btn
        $(document).on('click', DOMElement.Main.btnReturn, appCtrl.removeOverlay);
    }

    return {
        init: init,
        Data: appCtrl.Data,
        callback: appCtrl.callbackServer,
        createOverlay: appCtrl.createOverlay,
        feedbackEvent: appCtrl.feedbackEvent,
        callbackUpload: appCtrl.callbackUpload
    }

})(appUI, appController)