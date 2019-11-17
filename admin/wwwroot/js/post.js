var postController = (function(){

    var createPostList = function(obj, i){
        
        var element = '';
        
        element = element + '<li class="list" id="' + obj[i].id +'">';
        element = element + '<p>' + obj[i].categoryName + ' / ' + obj[i].name + '</p>';
        element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
        element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        element = element + '</li>';
        
        return element;
    };

    var CreateEditList = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        
        element = element + '<select name="idCategory">';
        for(var i in obj.category){
            
            if(obj.category[i].name == obj.categoryName){
                element = element + '<option value="' + obj.category[i].id + '" selected>' + obj.category[i].name + '</option>';    
            } else {
                element = element + '<option value="' + obj.category[i].id + '">' + obj.category[i].name + '</option>';
            }

        }        
        element = element + '</select>';

        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.name +'" required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        return element;
    };

    var createRemovePost = function(event){
        var id = $(this).parent().attr('id');
        var postName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare la categoria: ' + postName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    var createNewPostForm = function(){

        var $overlay = app.createOverlay();
        $overlay.addClass("post");

        var element = '';

        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add post" autocomplete="off">';
        element = element + '<input name="name" class="name" id="name" placeholder="Nome post" autocolplete="off" required />'
        element = element + '<input name="public" id="IsPublic" type="checkbox" class="is-active btn-switch"><label for="IsPublic" data-off="non pubblico" data-on="pubblicato"></label>';
        element = element + '<input type="hidden" name="album" class="name" id="album">';
        element = element + '<span class="btn upload-album text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Aggiungi album</span>';
        element = element + '<input type="hidden" name="video" class="name" id="video">';
        element = element + '<span class="btn upload-video text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Aggiungi video</span>';
        element = element + '<textarea name="post" id="editor"></textarea>'
        



        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>';

        $overlay.after(element);
        
        summernoteInit();
    };
    
    var createAddPhoto = function(obj,i){
        var element = '';
        element = element + '<li id="' + obj[i].id +'" style="background-image: url(\'' + obj[i].path + '\');" class="select border-radius-small"></li>';
        
        return element;
        
    };


    var summernoteInit = function(){

        $('#editor').summernote({
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['height', ['height']],
                ['insert', ['link',"picture"]],
                ['view', ['fullscreen', 'codeview']],
                ['style', ['style']],
            ],
        });

    }  

    var validateNewPost = function(){

        return $('form').validate({
            rules: {
                name: {
                    required: true
                },
            },
            message: {
                name:{
                    required: 'Il campo Nome è obbligatorio',
                }, 
            }
        });

    };

    var addNewPost = function(event){
        event.preventDefault();

        var state = validateNewPost();
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
            event.data = new app.Data(true, null, 'Post/Index', false, null);
            app.callback(event, updatePostList);
        }
    };

    var updatePostList = function(event){
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
            feedback = app.feedbackEvent(true, 'Argomento aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento dell\'argomento, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    };

    var editPost = function(event){
        //Ceate overlay
        $overlay =app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.postList;

        event.data = new app.Data(false, id, 'Post/GetById/', false, $overlay);

        app.callback(event, CreateEditList);
    };
    
    var updatePost = function(event){
        event.preventDefault();
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, 'Post/Update/', false, null);

        console.log(event.data);
        app.callback(event, updatePostList);
    };

    var deletePost = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, 'Post/Delete/', false, null);
        app.callback(event, updatePostList);
    };

    var getAll = function(){

        var event = {};
        event.data = new app.Data(false, null, 'Post/GetAll', true, $('div.content > ul.list'))

        app.callback(event, createPostList)
    };

    var summernoteDestroy = function(){
        if($('#editor').length > 0 ){
            $('#editor').summernote('destroy');
        }
    }

    var getAllImage = function(event){

        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><ul class="image background-color-white border-radius-small"></ul></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, 'Photo/GetAll', true, $('div#select > ul.image'));

        app.callback(event, createDOMAlbum);

        
        

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })

    };

    var createDOMAlbum = function(obj,i){
        var element = '';
        var addToAlbum = '';
        var albumImageId= $('input#album').val().split('|');
        var elementInAlbum = albumImageId.filter(function(value){
            return value == obj[i].id
        });

        if(elementInAlbum.length > 0){ 
            addToAlbum = 'add-to-album'
        } else {
            addToAlbum = '';
        }
        
        element = element + '<li id="' + obj[i].id +'" style="background-image: url(\'' + obj[i].path + '\');" class="select border-radius-small ' + addToAlbum + '"></li>';
        
        return element;
        
    };

    var addImageToAlbum = function(event){
        $(this).toggleClass('add-to-album');
        
        var value = $('input#album').val();

        if($(this).hasClass('add-to-album')){
            value = value + $(this).attr('id') + '|';
        } else {
            var id = $(this).attr('id') + '|';
            value = value.replace(id, '');
        }
        
        $('input#album').val(value);
    };

    var getAllVideo = function(event){
        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><ul class="video background-color-white border-radius-small"></ul></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, 'Video/GetAll', true, $('div#select > ul.video'));

        app.callback(event, createDOMVideo);

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })
    };

    var createDOMVideo = function(obj,i){
        var element = '';

        var addToAlbum = '';
        var videoId= $('input#video').val().split('|');
        var elementInAlbum = videoId.filter(function(value){
            return value == obj[i].id
        });

        if(elementInAlbum.length > 0){ 
            addToAlbum = 'add-to-album'
        } else {
            addToAlbum = '';
        }

        element = element + '<li class="select border-radius-small ' + addToAlbum + '" style="overflow: hidden" id="' +  obj[i].id + '">'
        element = element + '<video class="border-radius-small"><source src="' + obj[i].path + '"></video>';
        element = element + '</li>'

        return element;
        
    };

    var addVideoToPost = function(event){
        $(this).toggleClass('add-to-album');
        
        var value = $('input#video').val();
        
        if($(this).hasClass('add-to-album')){
            value = value + $(this).attr('id') + '|';
        } else {
            value.replace($(this).attr('id'), '');
        }
        
        $('input#video').val(value);
    }

    return {
        createNewPostForm: createNewPostForm,
        createRemovePost: createRemovePost,
        addNewPost: addNewPost,
        getAll: getAll,
        editPost: editPost,
        updatePost: updatePost,
        deletePost: deletePost,
        summernoteDestroy: summernoteDestroy,
        getAllImage: getAllImage,
        addImageToAlbum: addImageToAlbum,
        getAllVideo: getAllVideo,
        addVideoToPost: addVideoToPost
    };

})();

var postUI = (function(){

    var DOM = {
        btnCloseOverlay: '.btn#close',
        btnAdd: '.btn#add',
        btnAddPost: '.btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
        btnUploadAlbum: '.btn.upload-album',
        btnAddImageToAlbum: 'ul.image > li',
        btnUploadVideo: '.btn.upload-video',
        btnAddVideoToAlbum: 'ul.video > li'
    }

    return {
        DOMElement: DOM
    };

})();

var post = (function(postCtrl, postUI){
    var DOMElement = postUI.DOMElement;
    
    var init = function(){
        console.log('post init');
        
        //On document load create element list
        postCtrl.getAll();

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, postCtrl.createNewPostForm);

        $(document).on('click', DOMElement.btnAddPost, postCtrl.addNewPost);

        $(document).on('click', DOMElement.btnEdit, { postList: DOMElement.list }, postCtrl.editPost);
        $(document).on('click', DOMElement.btnRemove , postCtrl.createRemovePost);
        
        $(document).on('click', DOMElement.btnUpdate, postCtrl.updatePost);
        $(document).on('click', DOMElement.btnDelete, postCtrl.deletePost);

        $(document).on('click', DOMElement.btnCloseOverlay, postCtrl.summernoteDestroy);

        //Upload album-video
        $(document).on('click', DOMElement.btnUploadAlbum, postCtrl.getAllImage);
        $(document).on('click', DOMElement.btnAddImageToAlbum, postCtrl.addImageToAlbum);
        $(document).on('click', DOMElement.btnUploadVideo, postCtrl.getAllVideo);
        $(document).on('click', DOMElement.btnAddVideoToAlbum, postCtrl.addVideoToPost);
    };

    return {
        init: init
    };

})(postController, postUI);