"use strict";

var photoController = (function(){
    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=16&pageNumber=1', 'Photo/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createPhotoList);
    };

    var createPhotoList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';

        for(var i in obj.photos){
            var name = obj.photos[i].name.replace(/\.[^/.]+$/, "");
            element = element + '<li class="list box-shadow border-radius-medium" id="' + obj.photos[i].id +'">';
            element = element + '<span class="btn btn-circle edit background-color-blue-light box-shadow"></span>';
            element = element + '<span class="btn btn-circle crop background-color-white box-shadow"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red box-shadow"></span>';
            element = element + '<span class="border-radius-small" style="background-image: url(\'' + obj.photos[i].path + '\')"></span>';
            element = element + '<p>' + name + '</p>';
            element = element + '</li>';
        }
        
        
        return element;
    };
    
    /* ADD NEW */
    var createNewPhotoForm = function(){
        
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form enctype="multipart/form-data" class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        element = element + '<label id="files"></label>';
        element = element + '<input type="file" name="images" class="name" id="images" placeholder="Upload Immagini" multiple>';
        element = element + '<label for="images" class="btn upload text-center box-shadow border-radius-small background-color-pink-light color-white">Aggiungi immagini</label>';
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>';

        $overlay.after(element);

    };

    var addNewPhoto = function(event){
        event.preventDefault();
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

        if(error.length === 0){
            event.data = new UploadData('input#images', null, '/Photo/Index');
            app.callbackUpload(event, updatePhotoList); 
        } else {
            if($('form.add > span').length === 0){
                var errorMessage = '<span class="field-validation-error">Dimensioni o formato file non valida</span>';
                $('form').prepend(errorMessage);
            };
        };
    };

    var changeInputText = function(event){
        var files = $(this).prop('files');  

        var filename = $(this).val();
        if(files.length === 1){
            filename = filename.replace('C:\\fakepath\\', '');
        } else{
            filename = files.length + ' files';
        };

        $('label#files').text(filename);

    };

    /* EDIT */
    var editPhoto = function(event){
        //Create overalay
        var $overlay = app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.photoList;

        event.data = new app.Data(false, id, null, 'Photo/GetById/', false, $overlay);

        app.callback(event, CreateEditList);
    };

    var CreateEditList = function(obj){
        var name = obj.name.replace(/\.[^/.]+$/, "");

        var element = '';
        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
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

        event.data = new app.Data(true, id, null, 'Photo/Update/', false, null);
        app.callback(event, updatePhotoList);
    };

    var updatePhotoList = function(event){
        //remove element to DOM
        $('#overlay').remove();
        $('ul.list li').remove();

        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        };
        
        if($('ul.list li').length === 0){
            getAll(event);
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Foto aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della categoria, provare a ricicare la pagina');
        }; 
        $overlay.after(feedback);
    };

    /* DELETE */
    var deletePhoto = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, null, 'Photo/Delete/', false, null);
        app.callback(event, updatePhotoList);
    };

    var createRemovePhoto = function(event){
        var id = $(this).parent().attr('id');
        var photoName = $(this).next().next().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare la foto: ' + photoName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    /* CROP PHOTO */
    var cropPhoto = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        event.data = new app.Data(false, id, null, 'Photo/GetById/', false, null);
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
    
    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $(event.target).parent().find('span.btn.paginator.active').removeClass('active');
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        
        event.data = new app.Data(false, null, href, 'Photo/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createPhotoList);
    }

    //Constructor
    var UploadData = function(input, id, url){
        this.input = input;
        this.id = id;
        if(id === null || id === undefined){
            this.url = url;
        } else {
            this.url = url + this.id;
        };
    };

    return {
        createNewPhotoForm: createNewPhotoForm,
        createRemovePhoto: createRemovePhoto,
        cropPhoto: cropPhoto,
        addNewPhoto: addNewPhoto,
        getAll: getAll,
        editPhoto: editPhoto,
        updatePhoto: updatePhoto,
        deletePhoto: deletePhoto,
        changeInputText: changeInputText,
        changePage: changePage
    };
})();

var photoUI = (function(){

    var DOM = {
        btnAdd: '.btn#add',
        btnAddPhoto: '.btn#save',
        btnEdit: '.btn.edit',
        btnCrop: '.btn.crop',
        btnRemove: '.btn.remove',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
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

        //On document load create element list
        photoCtrl.getAll();

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, photoCtrl.createNewPhotoForm);
        $(document).on('click', DOMElement.btnAddPhoto, photoCtrl.addNewPhoto);

        //if upload a multiple file change name to input with a number of element
        $(document).on('change', DOMElement.formFiles, photoController.changeInputText);

        $(document).on('click', DOMElement.btnEdit, { photoList: DOMElement.list }, photoCtrl.editPhoto);
        $(document).on('click', DOMElement.btnCrop , photoCtrl.cropPhoto);
        $(document).on('click', DOMElement.btnRemove , photoCtrl.createRemovePhoto);
        
        $(document).on('click', DOMElement.btnUpdate, photoCtrl.updatePhoto);
        $(document).on('click', DOMElement.btnDelete, photoCtrl.deletePhoto);

        //Change page 
        $(document).on('click', DOMElement.btnChangePage, photoCtrl.changePage);
    }

    return {
        init: init
    };

})(photoController, photoUI);
