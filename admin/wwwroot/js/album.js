"use strict"

var albumController = (function(){
    /* GET ALL */
    var getAllImage = function(event){
        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><form class="image background-color-white border-radius-small"><div class="text-center"></div></form></div>'
        
        $('body').append(element)
        
        event.data = new app.Data(false, null, '?pageSize=16&pageNumber=1', 'Photo/GetAll', true,  $('div#select form div'));
        
        //Home page and cover image for post can be take only one image, so we create a radio list
        if($('ul#home').length > 0 || $(this).hasClass('cover') ){
            displayAllImage($(this), 'Photo/GetAll?pageSize=16&pageNumber=1', $('div#select form div'))
        } else {
            app.callback(event, createPhotosList);
            $('div#select form div').after(createBtn());
        }

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })

    };

    var getAllVideo = function(event){
        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><form class="video background-color-white border-radius-small"><div class="text-center"></div></form></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, '?pageSize=50&pageNumber=1', 'Video/GetAll', true, $('div#select form div'));
        app.callback(event, createVideoList);

        $('div#select form > div').after(createBtn());

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })
    };

    var createPhotosList = function(obj){
        var element = '';
        var ids = $('input#album').val().split('|');
        
        for(var i in obj.photos){
            var selected = ids.filter(function(value){
                return value == obj.photos[i].id
            });
            
            if(selected.length > 0){
                element = element + '<input type="checkbox" name="album-image" id="' + obj.photos[i].id + '" class="checkbox-image" checked>';
            } else {
                element = element + '<input type="checkbox" name="album-image" id="' + obj.photos[i].id + '" class="checkbox-image">';
            }
                    
            element  = element + '<label for="' + obj.photos[i].id + '" class="border-radius-small margin-bottom-xsmall" style="background-image: url(\'' + obj.photos[i].path + '\');" ></label>';    
        }
        
        return element;

    };

    var createVideoList = function(obj){
        var element = '';
        var ids = $('input#video').val().split('|');   
        
        for(var i in obj.videoList){
            var selected = ids.filter(function(value){
                return value == obj.videoList[i].id
            });
            
            if(selected.length > 0){
               element = element + '<input type="checkbox" name="album-video" id="' + obj.videoList[i].id + '" class="checkbox-image" checked>';
           } else {
               element = element + '<input type="checkbox" name="album-video" id="' + obj.videoList[i].id + '" class="checkbox-image">';
           }
           element  = element + '<label for="' + obj.videoList[i].id + '" class="border-radius-small"><video><source src="' + obj.videoList[i].path + '"></video></label>';
        }

        return element;
       
    }

    /* CREATE BTN BTN */
    var createBtn = function(){
        var element = '';     

        element = element + '<div class="text-right btn-container">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';

        return element
    };

    /* EDIT */
    var uploadAlbum = function(){
        var value = '';

        $('div#select > form input[type="checkbox"]:checked').each(function(){
            value = value + $(this).attr('id');
            value = value + '|';
        });

        //remove last pipe from value
        value = value.slice(0, -1);

        //update input with id of image or video selected
        var isListOfImage = $('form.image').length;
        if(isListOfImage > 0){
            $('input#album').val(value);
        } else {
            $('input#video').val(value);
        }
        
        //create skeleton of album
        var lastElementChecked = $('div#select > form input[type="checkbox"]:checked + label').last();
        var totalImages = $('div#select > form input[type="checkbox"]:checked').length;
        
        if(totalImages > 0){
            createSkeleton(lastElementChecked, totalImages, isListOfImage)
        } else {
            if(isListOfImage > 0){
                $('div.skeleton-container #album').remove();
            } else {
                $('div.skeleton-container #video').remove();
            }
        }

        //close popup
        $('.btn.close.select').trigger('click')
    }

    var createSkeleton = function(lastElement, length, isListOfImage){
        var elem = '';
        var background = '';

        if(isListOfImage > 0){
            background = lastElement.css('background-image').replace(/"/g, "");
            $('span#album.skeleton').remove();
            elem = elem + '<span id="album" class="skeleton border-radius-small" style="background-image:'+ background +'">';
        } else {
            background = lastElement.find('source').attr('src');
            $('span#video.skeleton').remove();
            elem = elem + '<span id="video" class="skeleton border-radius-small">';
            elem = elem + '<video><source src="' + background  + '"></video>'
        }

        elem = elem + '<p class="text-center color-white skeleton"> +' + length + '</p>'
        elem = elem + '</span>'
        
        
        $('div.skeleton-container').append(elem);

    };

    var addSkeletonOfImage = function(url, stringArray, elemToAppend){
        var element = '';
        var arrayId = stringArray.split('|');
        var url = url + arrayId[arrayId.length - 1];
        fetch(url,{method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        element = element + '<span id="album" class="skeleton border-radius-small" style="background-image:url('+ data.path +')">';
                        element = element + '<p class="text-center color-white skeleton"> +' + arrayId.length + '</p>';
                        element = element + '</span>';
                        
                        elemToAppend.append(element);
                    })
            });

    };

    var addSkeletonOfVideo = function(url, stringArray, elemToAppend){
        var element = '';
        var arrayId = stringArray.split('|');
        var url = url + arrayId[arrayId.length - 1];
        fetch(url,{method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        element = element + '<span id="video" class="skeleton border-radius-small">';
                        element = element + '<video><source src="' + data.path + '"></video>'
                        element = element + '<p class="text-center color-white skeleton"> +' + arrayId.length + '</p>';
                        element = element + '</span>';
                        
                        elemToAppend.append(element);
                    })
            });

    };

    //Manege single image for HOME PAGE and COVER IMAGE in POST
    var displayAllImage = function(elementPressed, url, appendTo){

        var id = "", type ="";

        if(elementPressed.attr('element') === "header"){
            id = $('input#idHeaderImage').val();
            type = "header";
        } else if(elementPressed.attr('element') === "newsletter"){
            id = $('input#idNewsletterImage').val();
            type = "newsletter";
        } else {
            id = $('input#cover').val();
            type = "cover";
        }
    
        fetch(url, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        var element = createListRadio(data, id)
                        appendTo.append(element);
                        
                    })
            })

            appendTo.after(createBtnRadio(type));
    }

    var createListRadio = function(obj, id){
        var element = '';

        for(var i in obj.photos){
            if(id == obj.photos[i].id ){
                element = element + '<input type="radio" name="group" id="img-' + obj.photos[i].id + '" checked/>';
            } else {
                element = element + '<input type="radio" name="group" id="img-' + obj.photos[i].id + '" />';
            }
            element  = element + '<label for="img-' + obj.photos[i].id + '" class="border-radius-small margin-bottom-xsmall" style="background-image: url(\'' + obj.photos[i].path + '\');" ></label>';    
        }
        
        return element
    }

    var createBtnRadio = function(type){
        var element = '';

        element = element + '<div class="text-right btn-container">';
        element = element + '<input type="' + type + '" type="submit" id="setImage" class="btn btn-rounded btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';

        return element
    };

    var createSkeletonFromRadio = function(element){
        var background = background = element.css('background-image').replace(/"/g, "");
        var elementToAppend = '';
        $('span#cover.skeleton').remove();
        elementToAppend = elementToAppend + '<span id="cover" class="skeleton border-radius-small" style="background-image:'+ background +'"></span>';
        $('div.skeleton-container').prepend(elementToAppend);
    }

    var updateSelectFromRadio = function(event){
        event.preventDefault();
        
        var type = $(this).attr('type');;
        var idImageSelected = $('div#select > form input[type="radio"]:checked').attr('id').replace('img-', '');

        
        if(type === "header" || type === "newsletter"){
            var urlImageSelected = $('div#select > form input[type="radio"]:checked + label').css('background-image');
           
            if(type === "header"){
                $('input#idHeaderImage').val(idImageSelected);
                $('section.header').css('background-image', urlImageSelected);
            } else {
                $('input#idNewsletterImage').val(idImageSelected);
                $('div.newsletter').css('background-image', urlImageSelected);
            }
            
        } else {
            $('input#cover').val(idImageSelected);
            var elementChecked = $('div#select > form input[type="radio"]:checked + label').last();
            createSkeletonFromRadio(elementChecked);
        }         
        
        $('div#select > span.btn.close').trigger('click');
    }

    var addSkeletonOfImageForRadio = function(url, id, elemToAppend){
        var element = '';
        var url = url + id;
        fetch(url,{method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        element = element + '<span id="cover" class="skeleton border-radius-small" style="background-image:url('+ data.path +')"></span>';
                        
                        elemToAppend.prepend(element);
                    })
            });

    };

    return {
        getAllImage: getAllImage,
        getAllVideo: getAllVideo,
        uploadAlbum: uploadAlbum,
        addSkeletonOfImage: addSkeletonOfImage,
        updateSelectFromRadio: updateSelectFromRadio,
        addSkeletonOfImageForRadio: addSkeletonOfImageForRadio,
        addSkeletonOfVideo: addSkeletonOfVideo
    };

})();

var albumUI = (function(){

    var DOM = {
        btnCloseOverlay: '.btn#close',
        btnCoverImage: '.btn.cover',
        btnUploadAlbum: '.btn.upload-album',
        btnUploadVideo: '.btn.upload-video',
        btnUpload: 'div#select > form input#save',
        btnHpHeader: 'span[element="header"].btn.edit',
        btnHpNewsLetter: 'span[element="newsletter"].btn.edit',
        btnHpCoverUpload: 'input#setImage',
        btnImgRadio: 'div#select > form input[type="radio"] + label',
        btnImgCheckBox: 'div#select > form input[type="radio"] + label'
    }

    return {
        DOMElement: DOM
    };

})();

var album = (function(albumCtrl, albumUI){
    var DOMElement = albumUI.DOMElement;

    var init = function(){
        console.log('album init');

        //Cover Image
        $(document).on('click', DOMElement.btnCoverImage, albumCtrl.getAllImage);

        //Upload album-video
        $(document).on('click', DOMElement.btnUploadAlbum, albumCtrl.getAllImage);
        $(document).on('click', DOMElement.btnUploadVideo, albumCtrl.getAllVideo);
        $(document).on('click', DOMElement.btnUpload, albumCtrl.uploadAlbum);

        //Home Page Managment background-image for header and newsletter
        $(document).on('click', DOMElement.btnHpHeader, albumCtrl.getAllImage);
        $(document).on('click', DOMElement.btnHpNewsLetter, albumCtrl.getAllImage);
        
        $(document).on('click', DOMElement.btnHpCoverUpload, albumCtrl.updateSelectFromRadio);


    }

    var addSkeletonOfImage = albumCtrl.addSkeletonOfImage;
    var addSkeletonOfVideo = albumCtrl.addSkeletonOfVideo;
    var addSkeletonOfImageForRadio = albumCtrl.addSkeletonOfImageForRadio;

    return {
        init: init,
        addSkeletonOfImage: addSkeletonOfImage,
        addSkeletonOfVideo: addSkeletonOfVideo,
        addSkeletonOfImageForRadio: addSkeletonOfImageForRadio
    }

})(albumController, albumUI);