"use strict"

var newsletterController = (function(){
    var showSubscriveDelay = function(){
    //    setTimeout(displaySubscription, 10000);
    }

    var displaySubscription = function(){
        var $overlay = app.createOverlay();

        var element = '';
        element = element + '<div class="text-center border-radius-small">';

        element = element + '</div>';
        
        console.log('show newsletter subscription')
    }

    return {
        showSubscriveDelay: showSubscriveDelay
    }
})();

var newsletterUI = (function(){
    
    return{

    }
})();

var newsletter = (function(newsletterUI, newsletterCtrl){
    var init = function(){
        newsletterCtrl.showSubscriveDelay();
    }

    return {
        init: init
    }
})(newsletterUI, newsletterController);