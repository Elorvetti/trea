var albumController = (function(){

    var getAllImage = function(event){

        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><form class="image background-color-white border-radius-small"><div class="text-center"></div></form></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, 'Photo/GetAll', true,  $('div#select form div'));
        app.callback(event, createList);

        $('div#select form div').after(createBtn());

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })

    };

    var getAllVideo = function(event){
        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><form class="video background-color-white border-radius-small"><div class="text-center"></div></form></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, 'Video/GetAll', true, $('div#select form div'));
        app.callback(event, createList);

        $('div#select form > div').after(createBtn());

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })
    };

    var getLastImage = function(arrayIdImages){
        

        fetch(url,{method: 'POST'})
                .then(function(res){
                    return res.json()
                        .then(function(data){
                            console.log(data);
                        })
                });
    }

    var createList = function(obj, i){
        var element = '';
        var isListOfImage = $('form.image').length;
        var selected = '';
        
        if(isListOfImage > 0){
           var ids = $('input#album').val().split('|');
            
           selected = ids.filter(function(value){
                return value == obj[i].id
            });

            if(selected.length > 0){
                element = element + '<input type="checkbox" name="album-image" id="' + obj[i].id + '" class="checkbox-image" checked>';
            } else {
                element = element + '<input type="checkbox" name="album-image" id="' + obj[i].id + '" class="checkbox-image">';
            }
            
            element  = element + '<label for="' + obj[i].id + '" class="border-radius-small margin-bottom-xsmall" style="background-image: url(\'' + obj[i].path + '\');" ></label>';    
            
        } else {

            var ids = $('input#video').val().split('|');
            
            selected = ids.filter(function(value){
                 return value == obj[i].id
             });
             
             if(selected.length > 0){
                element = element + '<input type="checkbox" name="album-video" id="' + obj[i].id + '" class="checkbox-image" checked>';
            } else {
                element = element + '<input type="checkbox" name="album-video" id="' + obj[i].id + '" class="checkbox-image">';
            }
            element  = element + '<label for="' + obj[i].id + '" class="border-radius-small"><video><source src="' + obj[i].path + '"></video></label>';
        }
        
        return element;
        
    };

    var createBtn = function(){
        var element = '';

        element = element + '<div class="text-right btn-container">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';

        return element
    };

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

    }

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

    }

    return {
        getAllImage: getAllImage,
        getAllVideo: getAllVideo,
        uploadAlbum: uploadAlbum,
        addSkeletonOfImage: addSkeletonOfImage,
        addSkeletonOfVideo: addSkeletonOfVideo
    };

})();

var albumUI = (function(){

    var DOM = {
        btnCloseOverlay: '.btn#close',
        btnUploadAlbum: '.btn.upload-album',
        btnUploadVideo: '.btn.upload-video',
        btnUpload: 'div#select > form input#save',
        btnHpHeader: 'span[element="header"].btn.edit',
        btnHpNewsLetter: 'span[element="newsletter"].btn.edit'
    }

    return {
        DOMElement: DOM
    };

})();

var album = (function(albumCtrl, albumUI){
    var DOMElement = albumUI.DOMElement;

    var init = function(){
        console.log('album init');

        //Upload album-video
        $(document).on('click', DOMElement.btnUploadAlbum, albumCtrl.getAllImage);
        $(document).on('click', DOMElement.btnUploadVideo, albumCtrl.getAllVideo);
        $(document).on('click', DOMElement.btnUpload, albumCtrl.uploadAlbum);

        //Home Page Managment image
        $(document).on('click', DOMElement.btnHpHeader, albumCtrl.getAllImage);
    }

    var addSkeletonOfImage = albumCtrl.addSkeletonOfImage;
    var addSkeletonOfVideo = albumCtrl.addSkeletonOfVideo;

    return {
        init: init,
        addSkeletonOfImage: addSkeletonOfImage,
        addSkeletonOfVideo: addSkeletonOfVideo
    }

})(albumController, albumUI);