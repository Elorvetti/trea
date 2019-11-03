var argumentController = (function(){


    return {

    }
})();

var argumentUI = (function(){

    return {

    }
})();

var argument = (function(argumentCtrl, argumentUI){

    var init = function(){
        console.log('argument init');
    }

    return {
        init: init
    }

})(argumentController, argumentUI)

//var folderName = obj.name.replace(/\-/g, ' ')