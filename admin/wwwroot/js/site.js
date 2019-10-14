var appController = (function(){


    return {

    }

})();

var appUI = (function(){
    var DOMElement = {
        btnHamburget: '.btn-hamburger',
        sidebar: '#sidebar',
        displaySidebar: 'active'
    }

    var toogleSidebar = function(){
        if($(DOMElement.sidebar).hasClass(DOMElement.displaySidebar)){
            $(DOMElement.sidebar).removeClass(DOMElement.displaySidebar)
        } else {
            $(DOMElement.sidebar).addClass(DOMElement.displaySidebar)
        }
    }

    return {
        DOM: DOMElement,
        toogleSidebar: toogleSidebar
    }
})();

var app = (function(UICtrl, appCtrl){
    var DOMElement = UICtrl.DOM;

    var init = function(){
        console.log('App init');
        $(document).on('click', DOMElement.btnHamburget, UICtrl.toogleSidebar)
    }



    return {
        init: init
    }
})(appUI, appController)