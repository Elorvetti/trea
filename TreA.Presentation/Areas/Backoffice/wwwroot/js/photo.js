"use strict";

var photoController = (function(){
    /* FOLDER */
    //1. Get All Folder
    var getAllFolder = function(){
        var event = {};
        event.data = new app.Data(false, null, null, '/Backoffice/Photo/GetAllFolder', true, $('div.content > ul#photo.list'));
        app.callback(event, displayFolderList);
    }

    var displayFolderList = function(obj){
        $('div.content > ul#photo.list > li').remove();
        var element = '';

        for(var a in obj.folders){
            element = element + '<li class="argument folder list" id="' + obj.folders[a].id +'">';
            element = element + '<p>' + obj.folders[a].name + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light box-shadow" tooltip="Modifica"></span>';
            element = element + '<span class="btn btn-circle photo-add background-color-blue box-shadow" tooltip="Aggiungi Foto"></span>';
            element = element + '</li>';
        }
        
        return element;
    }

    //2. Add New Folder
    var createNewFolderForm = function(){
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white folder-add" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" placeholder="Nome" autocomplete="off" required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiungi">';   
        element = element + '</div>';
        
        element = element + '</form>'

        $overlay.after(element);
    }

    var validateNewFodler = function(){
        return $('form').validate({
                rules: {
                    name: {
                        required: true
                    }
                },
                message: {
                    name:{
                        required: 'Il campo Nome è obbligatorio',
                    }
                }
            })
    }

    var addNewFolder = function(event){    
        event.preventDefault();

        var state = validateNewFodler();
        var valid = true;

        var invalid = state.invalid.name === true || state.invalid.order === true;
        
        $('form :input').each(function(){
            var required = $(this).attr('required') !== undefined;

            if(invalid || $(this).val() === "" && required ){
                if($('form.add > span').length === 0){
                    var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
                    $('form').prepend(errorMessage);
                }
                valid = false;
            }
        })

        if(valid){
            event.data = new app.Data(true, null, null, '/Backoffice/Photo/AddFolder', false, null);
            app.callback(event, updateFolderList);
        }
        
    }

    //3. Edit-Update Folder List
    var editFolder = function(event){
        var $overlay = app.createOverlay();
        var id = $(this).parent().attr('id');

        event.data = new app.Data(false, id, null, '/Backoffice/Photo/GetFolderById/', false, $overlay);

        app.callback(event, createUpdateFolderForm);
    }

    var createUpdateFolderForm = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white folder-edit" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.name +'" required>';
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        return element;
    }

    var updateFolder = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, '/Backoffice/Photo/UpdateFolder/', false, null);
        app.callback(event, updateFolderList);
    }

    var updateFolderList = function(){
        //remove element to DOM
        $('#overlay').remove();
        $('ul#photo.list > li').remove();

        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        }
        
        if($('ul#photo.list > li').length === 0){
            getAllFolder()
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Catella aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della cartella, provare a ricaricare la pagina');
        } 
        $overlay.after(feedback);
    }

    // 4. Display child
    var displayPhoto = function(){
        $('ul#photo > li.folder').each(function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
            }
        })

        $(this).addClass('active');

        var id = $(this).attr('id');
        var url = '/Backoffice/Photo/GetPhotoByFolderId/' + id;

        fetch(url, { method: 'POST' })
        .then(function(res){
            res.json()
                .then(function(data){
                    var element = '';
                    element = element + '<ul id="child" class="photo padding-xsmall" folder-id="' + data.folderId + '">';                     
                    element = createPhotoList(data, element);
                    element = element + '</ul>';

                    $('ul#photo').after(element);
                })
        })
        
    }

    /* PHOTO */
    //1. Add New Photo
    var getAllPhoto = function(){
        var folderId = $('ul#child').attr('folder-id');
        $('div.content > ul#child').remove();

        var url = '/Backoffice/Photo/GetPhotoByFolderId/' + folderId;

        fetch(url, { method: 'POST' })
        .then(function(res){
            res.json()
                .then(function(data){
                    console.log(data);
                    var element = '';
                    element = element + '<ul id="child" class="photo padding-xsmall" folder-id="' + data.folderId + '">';                     
                    element = createPhotoList(data, element);
                    element = element + '</ul>';

                    $('ul#photo').after(element);
                })
        })

    }

    var createNewPhotoForm = function(){
        var folderId = $(this).parent().attr('id');
        var $overlay = app.createOverlay();
    
        var element = '';
        
        element = element + '<form enctype="multipart/form-data" class="box-shadow border-radius-small text-center background-color-white photo-add" autocomplete="off">';
        element = element + '<p class="text-center color-red margin-bottom-xsmall font-size-14">* &Egrave; possibile aggiungere un massimo di 3 foto alla volta</p>';
        
        //file
        element = element + '<label id="files"></label>';
        element = element + '<input type="file" name="images" class="name" id="images" placeholder="Upload Immagini" multiple>';
        element = element + '<label for="images" class="btn upload text-center box-shadow border-radius-small background-color-pink-light color-white">Aggiungi immagini</label>';
        element = element + '<input type="hidden" name="folderId" class="name" id="folderId" value="' + folderId + '">';
        
        //Preview upload image
        element = element + '<section id="preview-upload" class="text-center"></section>';
    
        //Btn return and sumit
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>';

        $overlay.after(element);

    };

    var addNewPhoto = function(event){
        event.preventDefault();
        var id = $('input#folderId').val();
        var files = $('input#images').prop('files');
        var regex = RegExp('\.(gif|jpg|jpeg|tiff|png)$');
        var arrayFileOk = new Array;
        

        //push into array if file is ok
        for(var file in files){
            if(file !== 'length' && file !== 'item'){
                //check exist && size && format
                arrayFileOk.push(files[file] && files[file].size < 15 * 1048576 && regex.test(files[file].name)); 
            };
        };

        //check into array there are error else post photo on sever
        var error = arrayFileOk.filter(function(element){
            return element === false;
        });

        if(error.length === 0 && files.length <= 3){
            event.data = new UploadData('input#images', id, '/Backoffice/Photo/Index');
            app.callbackUpload(event, updatePhotoList); 
        } else {
            if($('form.add > span').length === 0){
                var errorMessage = '<span class="field-validation-error">Dimensioni o formato file non valida</span>';
                $('form').prepend(errorMessage);
            };
        };
    };

    var createPhotoList = function(obj, element){
        $('ul#child > li').remove();

        for(var i in obj.photos){
            var name = obj.photos[i].name.replace(/\.[^/.]+$/, "");
            element = element + '<li class="photo-list box-shadow" id="' + obj.photos[i].id +'">';
            element = element + '<span class="btn btn-circle edit background-color-blue-light box-shadow" tooltip="Modifica"></span>';
            element = element + '<span class="btn btn-circle crop background-color-white box-shadow" tooltip="Visualizza"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red box-shadow" tooltip="Elimina"></span>';
            element = element + '<span style="background-image: url(\'' + obj.photos[i].path + '\')"></span>';
            element = element + '<p class="text-center">' + name + '</p>';

            if (obj.photosUsed[i] !== 0) {
                element = element + '<span class="btn-used btn-circle background-color-red text-center color-white box-shadow">' + obj.photosUsed[i] + '</span>'
            }

            element = element + '</li>';
        }
        
        return element;
    };

    //2. Edit - Update Photo
    var editPhoto = function(){
        var $overlay = app.createOverlay();

        var id = parseInt($(this).parent().attr('id'));
        
        var event = {};
        event.data = new app.Data(false, id, null, '/Backoffice/Photo/GetById/', false, $overlay);
        app.callback(event, CreatePhotoEditForm);
    };

    var CreatePhotoEditForm = function(obj){
        var name = obj.name.replace(/\.[^/.]+$/, "");

        var element = '';
        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white photo-edit" autocomplete="off">';
        element = element + '<input type="hidden" name="folderId" class="name" id="folderId" value="'+ obj.folderId +'">';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ name +'" required>';
        element = element + '<span class="border-radius-small" style="background-image: url(\'' + obj.path + '\')"></span>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        element = element + '</form>';
        

        return element;
    };

    var updatePhoto = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, '/Backoffice/Photo/Update/', false, null);
        app.callback(event, updatePhotoList);
    };

    var updatePhotoList = function(event){
        //remove element to DOM
        $('#overlay').remove();
        $('ul#child li').remove();

        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        };
        
        if($('ul#child li').length === 0){
            getAllPhoto(event);
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Foto aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della categoria, provare a ricicare la pagina');
        }; 
        $overlay.after(feedback);
    };
    
    //3. Delete
    var deletePhoto = function(event){
        var id = $(this).parent().parent().attr('id');
        
        event.data = new app.Data(true, id, null, '/Backoffice/Photo/Delete/', false, null);
        app.callback(event, updatePhotoList);
    };

    var createRemovePhoto = function(event){
        var id = $(this).parent().attr('id');
        var self = $(this);

        var $overlay = app.createOverlay();

        //If photo is used set can't delete and show usage image
        var url = '/Backoffice/Photo/CheckUsageImage/' + id;

        fetch(url, { method: 'POST' })
            .then(function (res) {
                res.json()
                    .then(function (data) {
                        if (data.length > 0) {
                            $("span#close").addClass('post');

                            var element = '';
                            element = element + '<div id="used-photo" class="box-shadow border-radius-small text-center background-color-white post">';
                            element = element + '<h3 class="text-center color-blue">Immagine utilizzata nei seguenti punti: </h3>'
                            element = element + '<p class="text-center color-red">L\'immagine verrà rimossa automaticamente dai vari album</p>'
                            element = element + '<ul class="padding-left-small padding-right-small margin-top-small">'

                            for (var i in data) {
                                element = element + '<li class="color-black margin-bottom-xsmall text-center">'
                                element = element + '<p class="margin-right-small">' + data[i].name + '</p>'
                                element = element + '<a href="' + data[i].url + '" class="btn btn-circle goto background-color-blue box-shadow" target="_blank"></a>'
                                element = element + '</li>'
                            }

                            element = element + '</ul>'
                            element = element + '</div>';
                        } else {
                            var photoName = self.next().next().text();
                            var element = '';

                            element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white photo-delete"><p class="text-center confirm">Sei sicuro di voler eliminare la foto: ' + photoName + '?</p>';

                            element = element + '<div class="text-right">';
                            element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
                            element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';
                            element = element + '</div>';

                            element = element + '</div>';
                        }
                       
                        $overlay.after(element);
                    })
            })
    };

    //5. Display Large Image
    var cropPhoto = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        event.data = new app.Data(false, id, null, '/Backoffice/Photo/GetById/', false, null);
        app.callback(event, CreateCrop);
    };

    var CreateCrop = function(obj){

        var $overlay = app.createOverlay();

        var name = obj.name.replace(/\.[^/.]+$/, "");

        var element = '';
        element = element + '<div class="box-shadow border-radius-small text-center background-color-white">';
        element = element + '<p>' + name + '</p>';
        element = element + '<img class="border-radius-small" src="' + obj.path +  '">';
        element = element + '</div>';

        $('div#overlay').addClass('crop');
        $overlay.after(element);

    };

    //6. Check Usage Image
    var usedPhoto = function(){
        var id = $(this).parent().attr('id');

        var url = '/Backoffice/Photo/CheckUsageImage/' + id;
        var $overlay = app.createOverlay();
        $("span#close").addClass('post');


        fetch(url, { method: 'POST' })
            .then(function (res) {
                res.json()
                    .then(function (data) {
                        var element = '';
                        element = element + '<div id="used-photo" class="box-shadow border-radius-small text-center background-color-white post">';
                        element = element + '<h3 class="text-center color-blue">Immagine utilizzata nei seguenti punti: </h3>'
                        element = element + '<p class="text-center color-red">L\'immagine verrà rimossa automaticamente dai vari album</p>'
                        element = element + '<ul class="padding-left-small padding-right-small margin-top-small">'

                        for (var i in data) {
                            element = element + '<li class="color-black margin-bottom-xsmall text-center">'
                            element = element + '<p class="margin-right-small">' + data[i].name + '</p>'
                            element = element + '<a href="' + data[i].url + '" class="btn btn-circle goto background-color-blue box-shadow" target="_blank"></a>'
                            element = element + '</li>'
                        }

                        element = element + '</ul>'
                        element = element + '</div>';

                        $overlay.after(element);
                    })
            })
    }

    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=16&pageNumber=1', '/Backoffice/Photo/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createPhotoList);
    };
   
    /* ADD NEW */
    var changeInputText = function(event){
        var files = $(this).prop('files');  
        var filename = $(this).val();
        
        if(files.length <= 3){
            if(files.length === 1){
                filename = filename.replace('C:\\fakepath\\', '');
            } else{
                filename = files.length + ' files';
            };
    
            $('label#files').text(filename);
            displayPreviewUploader(this);
        }
    };

    var displayPreviewUploader = function (input) {
        if (input.files) {
          var filesAmount = input.files.length;

          for (var i = 0; i < filesAmount; i++) {
              var reader = new FileReader();
              console.log('im here')

              reader.onload = function(e) {
                  $('section#preview-upload').append('<img src="' + e.target.result + '" alt="" width="100" />');
              }

              reader.readAsDataURL(input.files[i]);
          }
      }
      
      $('section#preview-upload img').remove();
   
  }

    //Constructor
    var UploadData = function(input, id, url){
        this.input = input;
        this.id = id;
        this.url = url;
    };

    return {
        getAllFolder: getAllFolder,
        createNewFolderForm: createNewFolderForm,
        addNewFolder: addNewFolder,
        editFolder: editFolder,
        updateFolder: updateFolder,
        displayPhoto: displayPhoto,
        createNewPhotoForm: createNewPhotoForm,
        addNewPhoto: addNewPhoto,
        editPhoto: editPhoto,
        updatePhoto: updatePhoto,
        createRemovePhoto: createRemovePhoto,
        cropPhoto: cropPhoto,
        usedPhoto: usedPhoto,
        deletePhoto: deletePhoto,
        changeInputText: changeInputText,
    };
})();

var photoUI = (function(){

    var DOM = {
        main: 'main',
        btnAddFolder: '.btn#add',
        btnSaveFolder: 'form.folder-add .btn#save',
        btnEditFolder: 'ul#photo > li.folder span.btn.edit',
        btnUpdateFolder: 'form.folder-edit input#update',
        btnDisplayChild: 'ul#photo > li.folder',
        btnAddNewPhoto: 'ul#photo > li.folder > span.photo-add',
        btnUploadPhoto: 'form.photo-add .btn#save',
        btnEditPhoto: 'ul#child > li > .btn.edit',
        btnUpdatePhoto: 'form.photo-edit .btn#update',
        btnCropPhoto: 'ul#child > li > .btn.crop',
        btnRemovePhoto: 'ul#child > li > .btn.remove',
        btnUsedPhoto: 'ul#child > li > .btn-used',
        btnDeletePhoto: 'div.photo-delete input#delete',
        list: 'div.content > ul',
        formFiles: 'input#images',
        btnChangePage: 'span.btn.paginator'
    };

    return {
        DOMElement: DOM
    };
    
})();

var photo = (function(photoCtrl, photoUI){
    var DOMElement = photoUI.DOMElement;


    var init = function(){
        console.log('photo init');
        $('span#filter').remove();

        //Remove scrool on main
        $(DOMElement.main).css('overflow-y', 'hidden');

        $(DOMElement.btnAddFolder).attr('tooltip', 'Aggiungi cartella');

        //Display all photo folder
        photoCtrl.getAllFolder();
            
        //Add event handler on button
        $(document).on('click', DOMElement.btnAddFolder, photoCtrl.createNewFolderForm);
        $(document).on('click', DOMElement.btnSaveFolder, photoCtrl.addNewFolder);
        $(document).on('click', DOMElement.btnEditFolder, photoCtrl.editFolder);
        $(document).on('click', DOMElement.btnUpdateFolder, photoCtrl.updateFolder);

        $(document).on('click', DOMElement.btnDisplayChild, photoCtrl.displayPhoto);
        $(document).on('click', DOMElement.btnAddNewPhoto, photoCtrl.createNewPhotoForm);
        $(document).on('click', DOMElement.btnUploadPhoto, photoCtrl.addNewPhoto);
        $(document).on('click', DOMElement.btnEditPhoto, photoCtrl.editPhoto);
        $(document).on('click', DOMElement.btnUpdatePhoto, photoCtrl.updatePhoto);
        $(document).on('click', DOMElement.btnRemovePhoto, photoCtrl.createRemovePhoto);
        $(document).on('click', DOMElement.btnDeletePhoto, photoCtrl.deletePhoto);
        $(document).on('click', DOMElement.btnCropPhoto, photoCtrl.cropPhoto);
        $(document).on('click', DOMElement.btnUsedPhoto, photoCtrl.usedPhoto);

        //if upload a multiple file change name to input with a number of element
        $(document).on('change', DOMElement.formFiles, photoController.changeInputText);
    }

    return {
        init: init
    };

})(photoController, photoUI);
