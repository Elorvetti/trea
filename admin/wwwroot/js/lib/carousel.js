"use strict"

var carouselController = (function(){

    var init = function(elem, proto, btnNext, btnPrev){
        
        var step = proto.step();

        //Add classes to element
        $(elem).each(function(i,e){

            //remove class: active, prev and nex
            $(this).removeClass('prev');
            $(this).removeClass('next');
            $(this).removeClass('active');

            if(i < step){
                $(this).addClass('active');
            } else if( i >= step && i === proto.length){
                $(this).addClass('prev');
            } else if(i === step){
                $(this).addClass('next');   
            }
        })

        //display or hide arrows (btn next prev)
        if(proto.length > proto.slide){
            $(btnNext).show();
            $(btnPrev).show();
        } else {
            $(btnNext).hide();
            $(btnPrev).hide();
        }

        //remove dotnav if already exist
        if($('ul.carousel__dotnav').length > 0){
            $('ul.carousel__dotnav').remove();
        }

        createDotNav(elem, step);
    }

    var moveNext = function(event){
        var proto = event.data.proto;
        var items = event.data.items;
        
        // Check if moving
        if(!proto.moving){
            
            // If it's the last slide, reset to 0, else +1
            if(proto.slide >= proto.length){
                proto.slide = 0;
            } else {
                proto.slide = proto.slide + proto.step();
            }
            moveCarouselTo(proto, items);
        }
    }

    var movePrev = function(event){
        var proto = event.data.proto;
        var items = event.data.items;

        // Check if moving
        if(!proto.moving){
    
            // If it's the last slide, reset to 0, else +1
            if(proto.slide === 0){
                proto.slide = proto.length;
            } else {
                proto.slide = proto.slide - proto.step();
            }

            moveCarouselTo(proto,items);
        }

    }

    var disableInteraction = function(proto){
        // Set 'moving' to true for the same duration as our transition.
        // (0.5s = 500ms)

        proto.moving = true;

        // setTimeout runs its function once after the given time
        setTimeout(function(){
            proto.moving = false
        }, 500);

    }

    var moveCarouselTo = function(proto, items){
        
        // Check if carousel is moving, if not, allow interaction
        if(!proto.moving){

            // temporarily disable interactivity
            disableInteraction(proto);
    
            //Update adjacent slides
            var next = proto.slide + proto.step();
            var prev = proto.slide - proto.step();
            
            if(proto.length > proto.step()){

                // Checks and updates if the new slides are out of bounds
                if(next >= proto.length){
                    next = 0;
                } else if(prev <= 0){
                    prev = 0;
                }

                //get carousel active and return index of array
                var idOfLastItemActive = $('.carousel').find('.carousel__photo.active').last().attr('id');
                var indexInArrayOfLastElActive = '';
                $(items).filter(function(i,e){
                    if($(this).attr('id') == idOfLastItemActive){
                        indexInArrayOfLastElActive = i
                        return i
                    }
                });

                var step = proto.step() + indexInArrayOfLastElActive;

                // Now we've worked out where we are and where we're going, 
                // by adding/removing classes we'll trigger the transitions. 
                $(items).each(function(i,e){
                 
                    //remove class: active, prev and nex
                    $(this).removeClass('prev');
                    $(this).removeClass('next');
                    $(this).removeClass('active');
                    
                    if(i > indexInArrayOfLastElActive && i <= step){
                        $(this).addClass('active');
                    } else if(i == next){
                        $(this).addClass('next')
                    } else if(i == prev){
                        $(this).addClass('prev');
                    }
                })
            }

            updateDotnav(proto);
        }
    }

    var createDotNav = function(elem, step){

        var elementToAppend = '';
        elementToAppend = elementToAppend + '<ul class="carousel__dotnav">'

        $(elem).each(function(i,e){
            if(i % step !== 1){
                if(i == 0){
                    elementToAppend = elementToAppend + '<li id="' + i + '" class="active"></li>';
                } else {
                    elementToAppend = elementToAppend + '<li id="' + i + '"></li>';
                }
            }
        })

        elementToAppend = elementToAppend + '</ul>';

        $('div.carousel').append(elementToAppend);
    }

    var updateDotnav = function(proto){
        $('ul.carousel__dotnav > li').each(function(i, e){
            if(i == proto.slide){
                $(this).addClass('active')
            } else {
                $(this).removeClass('active');
            }
        })
    }

    var moveToPressedDot = function(event){
        var proto = event.data.proto;
        var items = event.data.items;

        if(!proto.moving){
            proto.slide = $(this).attr('id');
            moveCarouselTo(proto, items);
        }
        
    }

    return{
        init : init,
        moveNext: moveNext,
        movePrev: movePrev,
        moveToPressedDot: moveToPressedDot
    }

})();

var carouselUI = (function(){
    var DOM = {
        btndevice: 'ul#home, li',
        item: '.carousel__photo',
        btnNext: '.carousel__button--next',
        btnPrev: '.carousel__button--prev',
        dotnav: 'ul.carousel__dotnav > li'
    }

    return{
        DOMElement : DOM
    }

})();

var carousel = (function(carouselUI, carouselCtrl){

    var init = function(){
        console.log('carousel init');

        var DOMElement = carouselUI.DOMElement;

        var items = {
                length: $(DOMElement.item).length -1,
                slide: 0,
                step: function(){
                    var width = $('form#container').width();
                    if(width >= 768){
                        return 2
                    } else if(width >= 1024){
                        return 4
                    } else {
                        return 1
                    }
                },
                moving: false,
                mobileArrow: false
            }
        
        
        //var proto = items(DOMElement.item);
        carouselCtrl.init(DOMElement.item, items, DOMElement.btnNext, DOMElement.btnPrev);
        
        //init carousel on device change 
        $(document).on('click', DOMElement.btndevice, function(){
            carouselCtrl.init(DOMElement.item, items, DOMElement.btnNext, DOMElement.btnPrev);
        })

        //Carousel moving
        $(document).on('click', DOMElement.btnNext, {proto: items, items: DOMElement.item}, carouselCtrl.moveNext)
        $(document).on('click', DOMElement.btnPrev, {proto: items, items: DOMElement.item}, carouselCtrl.movePrev)
        $(document).on('click', DOMElement.dotnav, {proto: items, items: DOMElement.item},  carouselCtrl.moveToPressedDot)
        
    }

    return {
        init: init
    }

})(carouselUI, carouselController)