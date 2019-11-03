var podcastController = (function(){


    return {

    }
})();

var podcastUI = (function(){

    return {

    }
})();

var podcast = (function(podcastCtrl, podcastUI){

    var init = function(){
        console.log('podcast init');
    }

    return {
        init: init
    }

})(podcastController, podcastUI)