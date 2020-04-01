"use strict"

var albumController = (function(){
    /* FOLDER */
    //1. Get And display folder list
    var getAllFolder = function(){
        var inputType = 'checkbox';
        var homeSection =  $(this).attr('element');

        if ($(this).hasClass('cover') || $(this).hasClass('user-image') || $(this).attr('element') == 'header' || $(this).attr('element') == 'newsletter'){
            inputType = "radio";
        }

        var element = '';
        var element = '<div id="select"><span class="btn close select"></span><div id="addPhoto" class="background-color-white"><ul id="photo" class="list" input-type="' + inputType + '" home-section="' + homeSection + '"></ul></div></div>'
        
        $('body').append(element)

        var event = {};
        event.data = new app.Data(false, null, null, '/Backoffice/Photo/GetAllFolder', true, $('div#select div#addPhoto ul#photo'));
        app.callback(event, displayFolderList);
    }

    var displayFolderList = function(obj){
        $('div#addPhoto > ul#photo.list > li').remove();
    
        var element = '';
        for(var a in obj.folders){
            element = element + '<li class="argument folder list" id="' + obj.folders[a].id +'">';
            element = element + '<p>' + obj.folders[a].name + '</p>';
            element = element + '</li>';
        }
        
        return element;
    }
    
    //2. Display Photo
    var displayPhoto = function(){
        $('ul#photo > li.folder').each(function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
            }
        })

        $(this).addClass('active');

        var inputType = $('ul#photo').attr('input-type');
        var id = $(this).attr('id');
        var url = '/Backoffice/Photo/GetPhotoByFolderId/' + id;

        fetch(url, { method: 'POST' })
        .then(function(res){
            res.json()
                .then(function(data){
                    var element = '';
                    element = element + '<ul id="child" class="photo padding-xsmall" folder-id="' + data.folderId + '">';        
                    element = createPhotoList(data, element, inputType);
                    element = createBtn(element)
                    element = element + '</ul>';
                    element = element + '<input type="hidden" id="element-selected" />'
                    $('ul#photo').after(element);
                })
        })


    }

    var createPhotoList = function(obj, element, inputType){
        var ids = '';
        $('ul#child > li').remove();

        for(var i in obj.photos){
            var name = obj.photos[i].name.replace(/\.[^/.]+$/, "");
            element = element + '<li class="photo-list box-shadow" id="' + obj.photos[i].id + '">';
            element = element + '<span style="background-image: url(\'' + obj.photos[i].path + '\')"></span>';
            element = element + '<p class="text-center">' + name + '</p>';
            
            if(inputType == 'radio'){
                if($('ul#photo').attr('home-section') == 'header'){
                    ids = $('input#idHeaderImage').val();
                } else if ($('ul#photo').attr('home-section') == 'newsletter'){
                    ids = $('input#idNewsletterImage').val();
                } else {
                    ids = $('input#cover').val();
                }

                if( obj.photos[i].id == ids){
                    element = element + '<input type="' + inputType + '" name="album-image" id="img-' + obj.photos[i].id + '" class="checkbox-image" checked>';
                } else {
                    element = element + '<input type="' + inputType + '" name="album-image" id="img-' + obj.photos[i].id + '" class="checkbox-image">';
                }

            } else {
                ids = $('input#album').val().split('|');

                var selected = ids.filter(function(value){
                    return value == obj.photos[i].id
                });

                if(selected.length > 0){
                    element = element + '<input type="' + inputType + '" name="album-image" id="img-' + obj.photos[i].id + '" class="checkbox-image" checked>';
                } else {
                    element = element + '<input type="' + inputType + '" name="album-image" id="img-' + obj.photos[i].id + '" class="checkbox-image">';
                }
            }

            element  = element + '<label for="img-' + obj.photos[i].id + '"></label>';    
            element = element + '</li>';
        }
        return element;
    };

    var createBtn = function (element) {
        var section = $('main > div').attr('id');

        element = element + '<div class="text-right btn-container">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small ' + section + '" value="Salva">';   
        element = element + '</div>';

        return element
    };

    //3. Selected Image
    var SavePhotoSelected = function(){
        var id = $(this).attr('id');
        var inputType = $('ul#photo').attr('input-type');
        var value = '';
        $('div#select input[type="'+ inputType +'"]:checked').each(function(){
            value = value + $(this).parent().attr('id');
            if(inputType !== 'radio'){
                value = value + '|';
            }
        });

        //remove last pipe from value
        if(inputType !== 'radio'){
            value = value.slice(0, -1);
        }

        $('#element-selected').val(value);
    
    }

    var uploadAlbumPhotos = function(){
        var value = $('#element-selected').val();
        var inputType = $('ul#photo').attr('input-type');
        var isListOfImage = $('div#addPhoto').length;
        
        //create skeleton of album
        var lastElementChecked = $('div#select input[type="'+ inputType +'"]:checked + label').last().parent().find('span');
        var totalImages = $('div#select input[type="'+ inputType +'"]:checked').length;
        
        if(inputType == 'radio'){
            $('input#cover').val(value);
            createSkeletonFromRadio(lastElementChecked);
        } else {
            $('input#album').val(value);
            if(totalImages > 0){
                createSkeleton(lastElementChecked, totalImages, isListOfImage)
            } else {
                $('div.skeleton-container #album').remove();
            }    
        }

        $('.btn.close.select').trigger('click');
    }

    var updateUserImage = function () {
        var inputType = $('ul#photo').attr('input-type');
        var value = '';
        var backgroundImage = '';
        $('div#select input[type="' + inputType + '"]:checked').each(function () {
            value = value + $(this).parent().attr('id');
            backgroundImage = $(this).parent().find('span').css('background-image');
            if (inputType !== 'radio') {
                value = value + '|';
            }
        });

        console.log(backgroundImage);
        $('form.edit > span.user-image').css('background-image', backgroundImage);
        $('input#cover').val(value);


        $('.btn.close.select').trigger('click');
    }

    //4. Add Video To Post
    var getAllVideo = function(event){
        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><form class="video background-color-white border-radius-small"><div class="text-center"></div></form></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, '?pageSize=50&pageNumber=1', '/Backoffice/Video/GetAll', true, $('div#select form div'));
        app.callback(event, createVideoList);

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })
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

        element = createBtn(element);

        console.log(element);

        return element;
       
    }

    //5. Upload Video To Post
    var uploadVideoToAlbum = function(event){
        event.preventDefault();
        var value = '';

        $('div#select input[type="checkbox"]:checked').each(function(){
            value = value + $(this).attr('id');
            value = value + '|';
        });

        //remove last pipe from value
        value = value.slice(0, -1);
        $('input#video').val(value);
        
        //create skeleton of album
        var lastElementChecked = $('div#select input[type="checkbox"]:checked + label').last();
        var totals = $('div#select input[type="checkbox"]:checked').length;
        
        if(totals > 0){
            createSkeleton(lastElementChecked, totals, 0)
        } else {
                $('div.skeleton-container #video').remove();
        }

        //close popup
        $('.btn.close.select').trigger('click')
    }

    //6. Create skeleton
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

    var createSkeletonFromRadio = function(element){
        var background = background = element.css('background-image').replace(/"/g, "");
        var elementToAppend = '';
        $('span#cover.skeleton').remove();
        elementToAppend = elementToAppend + '<span id="cover" class="skeleton border-radius-small" style="background-image:'+ background +'"></span>';
        $('div.skeleton-container').prepend(elementToAppend);
    }

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

    //7. Home 
    var updateHeaderImage = function(){
        var imageSelected = $('#element-selected').val();
        var urlImageSelected = $('div#select  input[type="radio"]:checked + label').parent().find('span').css('background-image');

        $('#idHeaderImage').val(imageSelected);
        $('section.header').css('background-image', urlImageSelected);

        $('.btn.close.select').trigger('click')
    }

    var updateNewsletterImage = function(){
        var imageSelected = $('#element-selected').val();
        var urlImageSelected = $('div#select  input[type="radio"]:checked + label').parent().find('span').css('background-image');

        $('input#idNewsletterImage').val(imageSelected);
        $('div.newsletter').css('background-image', urlImageSelected);

        $('.btn.close.select').trigger('click')
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
        getAllFolder: getAllFolder,
        displayPhoto: displayPhoto,
        SavePhotoSelected: SavePhotoSelected,
        uploadAlbumPhotos: uploadAlbumPhotos,
        getAllVideo: getAllVideo,
        uploadVideoToAlbum: uploadVideoToAlbum,
        addSkeletonOfImage: addSkeletonOfImage,
        addSkeletonOfImageForRadio: addSkeletonOfImageForRadio,
        addSkeletonOfVideo: addSkeletonOfVideo,
        updateHeaderImage: updateHeaderImage,
        updateNewsletterImage: updateNewsletterImage,
        updateUserImage: updateUserImage
    };

})();

var albumUI = (function(){

    var DOM = {
        btnCloseOverlay: '.btn.close',
        btnAddCoverImageToPost: '.btn.cover',
        btnAddAlbumToPost: '.btn.upload-album',
        btnDisplayPhoto: 'ul#photo > li',
        btnAddPhotoToAlbum: 'div#select ul#child > li',
        btnUploadAlbumPhotos: 'div#select ul#photo[home-section="undefined"] + ul#child input#save.addSiteTree',
        btnAddVideoToPost: '.btn.upload-video',
        btnUploadVideoToAlbum: 'form.video input#save',
        btnHpNewsLetter: 'span[element="newsletter"].btn.edit',
        btnHpHeader: 'span[element="header"].btn.edit',
        btnUploadHomeHeaderImage: 'div#select ul#photo[home-section="header"] + ul#child input#save',
        btnUploadHomeNewsletterImage: 'div#select ul#photo[home-section="newsletter"] + ul#child input#save',
        btnAddUserPhoto: '.btn.user-image',
        btnUpdateUserImage: 'div#select ul#photo[home-section="undefined"] + ul#child input#save.addUser',
    }

    return {
        DOMElement: DOM
    };

})();

var album = (function(albumCtrl, albumUI){
    var DOMElement = albumUI.DOMElement;

    var init = function(){
        console.log('album init');

        //remove overlay
        $(document).on('click', DOMElement.btnCloseOverlay, function(){
            $('#select').remove();
        })

        //Photos
        $(document).on('click', DOMElement.btnAddCoverImageToPost, albumCtrl.getAllFolder);
        $(document).on('click', DOMElement.btnAddAlbumToPost, albumCtrl.getAllFolder);
        $(document).on('click', DOMElement.btnDisplayPhoto, albumCtrl.displayPhoto);
        $(document).on('click', DOMElement.btnAddPhotoToAlbum, albumCtrl.SavePhotoSelected);
        $(document).on('click', DOMElement.btnUploadAlbumPhotos, albumCtrl.uploadAlbumPhotos);

        $(document).on('click', DOMElement.btnAddVideoToPost, albumCtrl.getAllVideo);
        $(document).on('click', DOMElement.btnUploadVideoToAlbum, albumCtrl.uploadVideoToAlbum)

        //Home Page Managment background-image for header and newsletter
        $(document).on('click', DOMElement.btnHpHeader, albumCtrl.getAllFolder);
        $(document).on('click', DOMElement.btnHpNewsLetter, albumCtrl.getAllFolder);
        $(document).on('click', DOMElement.btnUploadHomeHeaderImage, albumCtrl.updateHeaderImage);
        $(document).on('click', DOMElement.btnUploadHomeNewsletterImage, albumCtrl.updateNewsletterImage);

        //Add User Image
        $(document).on('click', DOMElement.btnAddUserPhoto, albumCtrl.getAllFolder);
        $(document).on('click', DOMElement.btnUpdateUserImage, albumCtrl.updateUserImage);

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