﻿"use strict";

var appController = (function(){

    var feedbackEvent = function(success, message){
        var element;
        
        if(success){
            element = '<span class="box-shadow border-radius-small success text-center color-white">';    
        } else {
            element = '<span class="box-shadow border-radius-small error text-center color-white padding-small">';    
        };
        element = element + message;
        element = element + '</span>';
        
        $('#overlay').remove();
        var $overlay = createOverlay();
        $overlay.after(element);
    };

    var callbackServer = function(event, callback){
        var parameter = {
            post : event.data.method,
            url: event.data.url,
        }

        if(event.data.method){
            event.preventDefault();

            var data = $('form').serialize();

            callbackPOST(event, data, parameter.url, callback);
           
        } else {
            callbackGET(event, parameter.url, callback);
        };
    };

    var callbackUpload = function(event, callback){
        event.preventDefault();

        var files = $(event.data.input).prop('files');
        var data = new FormData();
        
        for (var i = 0; i != files.length; i++) {
            data.append("files", files[i]);
        };

        $.ajax({
            method: 'POST',
            contentType: false,
            processData: false,
            data: data,
            url: event.data.url,
            success: function (result) {    
                if(result === "Error"){
                    feedbackEvent(false, 'Impossibile eseguire l\'azione, ti preghiamo di riprovare più tardi.');
                    return;
                };
                callback(event);
            }
        });

    };

    var callbackPOST = function(event, data, url, callback){

        $.ajax({
            method: 'POST',
            data: data,
            url: url,
            success: function (result) {    
                if(result === "Error"){
                    feedbackEvent(false, 'Impossibile eseguire l\'azione, ti preghiamo di riprovare più tardi.');
                    return;
                };
                callback(event)
            }
        });

    };

    var callbackGET = async function(event, url, callback){
        var param = {
            father: event.data.father,
            updateList: event.data.updateList,
        };
        
        await fetch(url,{method: 'POST'})
                .then(function(res){
                    return res.json()
                        .then(function(data){
                            var element = callback(data);
                            var paginator = addPagination(data);

                            if(param.updateList){
                                $(param.father).append(element);
                                if($(event.target).parent().find('.paginator').length === 0){
                                    $(param.father).append(paginator);
                                }
                            } else {
                                $(param.father).after(element);
                            };
                        })
                });
    };

    var addPagination = function(data){
        var element = '';
        var i = 1;

        if(data.displayPagination){
            element = element + '<div class="paginator text-center">'
            
            for(i; i <= data.pageTotal; i++){
                
                if(i === 1){
                    element = element + '<span class="btn paginator active box-shadow text-center" section="' + data.sectionName + '" page="?pageSize=' + data.pageSize + '&pageNumber=' + i +'">' + i + '</span>'
                } else {
                    element = element + '<span class="btn paginator text-center box-shadow" section="' + data.sectionName + '" page="?pageSize=' + data.pageSize + '&pageNumber=' + i +'">' + i + '</span>'
                }
            }

            element = element + '</div>'
        }

        return element;
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
    };
    
    var removeOverlay = function(){
        $('div#overlay').remove();
    };

    //Constructor
    var Data = function(method, id, parameter, url, updateList, father){

        this.method = method;
        this.id = id;
        this.parameter = parameter;
        this.url = url;

        if(id !== null && id !== undefined){
            this.url = url + this.id;
        } else if (parameter !== null) {
            this.url = url + this.parameter;
        };
        
        this.updateList = updateList;
        this.father = father;
    };

    return{
        createOverlay: createOverlay,
        removeOverlay: removeOverlay, 
        Data: Data,
        callbackServer: callbackServer,
        feedbackEvent: feedbackEvent,
        callbackUpload: callbackUpload
    };

})();

var appUI = (function(){

    var toogleSidebar = function(){
        $(this).toggleClass('active');
        if($(DOMSidebar.element).hasClass(DOMSidebar.showClass)){
            $(DOMSidebar.element).removeClass(DOMSidebar.showClass);
        } else {
            $(DOMSidebar.element).addClass(DOMSidebar.showClass);
        };
    };

    var init = function(){

        var event = {};
        var section = DOMSidebar.section;
        var mainId = $(DOMElement.Main.list).attr('id');
    
        //if section have same id of area add class active else remove it
        for(var menu in section){
            var menuId = $(section[menu]).attr('id');
            if(menuId === mainId){
                $(section[menu]).addClass('active');
            } else{ 
                $(section[menu]).removeClass('active');
            };
        };

        //Get user on context and display user name
        fetch('/Backoffice/User/GetUserContext', {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        $('#username').text(data.user);
                        var image = 'url(' + data.photoPath + ')';
                        $('span.user-image').css('background-image', image);
                        $('span.user-image').css('background-size', 'cover');
                })
            })
    
    };
    
    var DOMSidebar = {
        element : '#sidebar',
        showClass: 'active',
        section: {
            user: 'li#user',
            siteTree: 'li#siteTree',
            category: 'li#category',
            photo: 'li#photo',
            video: 'li#video',
            podcast: 'li#podcast',
            arguments: 'li#argument',
            post: 'li#post',
            home: 'li#home',
            review: 'li#review'    
        }
    };

    var DOMElement = {
        Menu: {
            btn: '.menu.home',
        },
        Main: {
            btnReturn: '.btn.return',
            list: 'ul.list'
        }
    };

    return {
        DOM: DOMElement,
        init: init,
        toogleSidebar: toogleSidebar,
    };

})();

var app = (function(UICtrl, appCtrl){
    var DOMElement = UICtrl.DOM;
    
    var init = function(){
        console.log('App init');

        //Toggle class Active to sublist menu
        appUI.init();
        
        //Display sidebar on mobile view
        $(document).on('click', DOMElement.Menu.btn, appUI.toogleSidebar);


        //Add event listerner to btn
        $(document).on('click', DOMElement.Main.btnReturn, appCtrl.removeOverlay);
    };

    return {
        init: init,
        Data: appCtrl.Data,
        callback: appCtrl.callbackServer,
        createOverlay: appCtrl.createOverlay,
        feedbackEvent: appCtrl.feedbackEvent,
        callbackUpload: appCtrl.callbackUpload,
    }

})(appUI, appController);
