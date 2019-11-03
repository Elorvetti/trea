var videoController = (function(){


    return {

    }
})();

var videoUI = (function(){

    return {

    }
})();

var video = (function(videoCtrl, videoUI){

    var init = function(){
        console.log('video init');
    }

    return {
        init: init
    }

})(videoController, videoUI)