"use strict";

var photoController = (function(){

    var createPhotoList = function(obj, i){
        var element = '';
        element = element + '<li class="list box-shadow border-radius-medium" id="' + obj[i].id +'">';
        element = element + '<span class="border-radius-small" style="background-image: url(\'' + obj[i].path + '\')"></span>'
        element = element + '<p>' + obj[i].name.replace(/\.[^/.]+$/, "") + '</p>';
        //element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
        //element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        element = element + '</li>';
        
        return element;
    }
    
    var CreateEditList = function(obj){
        var element = '';

        element = element + '<form enctype="multipart/form-data" id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        element = element + '<input tupe="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.name +'" required>';
        element = element + '<input type="number" name="order" class="order" id="order"  autocomplete="off" value="'+ obj.displayOrder +'"  required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        return element;
    };

    var createRemovePhoto = function(event){
        var id = $(this).parent().attr('id');
        var photoName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare la categoria: ' + photoName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    }

    var createNewPhotoForm = function(){
        
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form enctype="multipart/form-data" class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        element = element + '<label id="files"></label>'
        element = element + '<input type="file" name="images" class="name" id="images" placeholder="Upload Immagini" multiple>';
        element = element + '<label for="images" class="btn upload text-center box-shadow border-radius-small background-color-pink-light color-white">Aggiungi immagini</label>'
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>'

        $overlay.after(element);

    }
    
    var addNewPhoto = function(event){
        event.preventDefault();
        var files = $('input#images').prop('files');
        var regex = RegExp('\.(gif|jpg|jpeg|tiff|png)$')
        var arrayFileOk = new Array;
        

        //push into array if file is ok
        for(var file in files){
            if(file !== 'length' && file !== 'item'){
                
                //check exist && size && format
                arrayFileOk.push(files[file] && files[file].size < 15 * 1048576 && regex.test(files[file].name)); 

            }
        }

        //check into array there are error else post photo on sever
        var error = arrayFileOk.filter(function(element){
            return element === false;
        })

        if(error.length === 0){
            event.data = new UploadData('input#images', null, '/Photo/Index');
            app.callbackUpload(event, updatePhotoList); 
        } else {
            if($('form.add > span').length === 0){
                var errorMessage = '<span class="field-validation-error">Dimensioni o formato file non valida</span>';
                $('form').prepend(errorMessage);
            }
        }
    }

    var changeInputText = function(event){
        var files = $(this).prop('files');  
        
        var filename = $(this).val();
        if(files.length === 1){
            filename = filename.replace('C:\\fakepath\\', '');
        } else{
            filename = files.length + ' files';
        }
        
        $('label#files').text(filename);
        
    }

    var updatePhotoList = function(event){
        //remove element to DOM
        $('#overlay').remove();
        $('ul.list li').remove();

        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        }
        
        if($('ul.list li').length === 0){
            getAll(event)
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Foto aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della categoria, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    }

    var editPhoto = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.photoList;

        event.data = new app.Data(false, id, 'Photo/GetById/', false, list);

        app.callback(event, CreateEditList);
    }

    var updatePhoto = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, 'Photo/Update/', false, null);
        app.callback(event, updatePhotoList);
    }

    var deletePhoto = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, 'Photo/Delete/', false, null);
        app.callback(event, updatePhotoList);
    }

    var getAll = function(event){
        event.data = new app.Data(false, null, 'Photo/GetAll', true, $('div.content > ul.list'));

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
        }
    }

    return {
        createNewPhotoForm: createNewPhotoForm,
        createRemovePhoto: createRemovePhoto,
        addNewPhoto: addNewPhoto,
        getAll: getAll,
        editPhoto: editPhoto,
        updatePhoto: updatePhoto,
        deletePhoto: deletePhoto,
        changeInputText: changeInputText
    }
})();

var photoUI = (function(){


    var DOM = {
        btnAdd: '.btn#add',
        btnAddPhoto: '.btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: 'ul li.list',
        formFiles: 'input#images'
    }


    return {
        DOMElement: DOM
    }
    
})();

var photo = (function(photoCtrl, photoUI){
    var DOMElement = photoUI.DOMElement;


    var init = function(){
        console.log('photo init');

        //On document load create element list
        $(window).on('load', photoCtrl.getAll);

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, photoCtrl.createNewPhotoForm);
        $(document).on('click', DOMElement.btnAddPhoto, photoCtrl.addNewPhoto);

        //if upload a multiple file change name to input with a number of element
        $(document).on('change', DOMElement.formFiles, photoController.changeInputText);


        $(document).on('click', DOMElement.btnEdit, { photoList: DOMElement.list }, photoCtrl.editPhoto);
      //  $(document).on('click', DOMElement.btnRemove , photoCtrl.createRemovePhoto);
        
        //$(document).on('click', DOMElement.btnUpdate, photoCtrl.updatePhoto);
        //$(document).on('click', DOMElement.btnDelete, photoCtrl.deletePhoto);
    }

    return {
        init: init
    }

})(photoController, photoUI)