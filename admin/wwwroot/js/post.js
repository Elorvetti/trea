var postController = (function(){


    return {

    }
})();

var postUI = (function(){

    return {

    }
})();

var post = (function(postCtrl, postUI){

    var init = function(){
        console.log('post init');
    }

    return {
        init: init
    }

})(postController, postUI)