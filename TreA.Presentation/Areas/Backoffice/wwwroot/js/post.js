"use strict"

var postController = (function(){

    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=16&pageNumber=1', 'Post/GetAll', true, $('div.content > ul.list'))
        app.callback(event, createPostList)
    };

    var createPostList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';
        
        for(var i in obj.posts){
            element = element + '<li class="list" id="' + obj.posts[i].id +'">';
            element = element + '<p public="' + obj.posts[i].pubblico + '">' +  obj.posts[i].title + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red"></span>';
            element = element + '<span class="btn btn-circle info background-color-white box-shadow"></span>';
            element = element + '</li>';
        }
         
        return element;
    };

    /* ADD NEW */
    var getAllPath = function(event){
        event.data = new app.Data(false, null, null, '/Post/GetAllPath', false, null);
        app.callback(event, createNewPostForm);
    }

    var createNewPostForm = function(obj){
        
        var $overlay = app.createOverlay();
        $overlay.addClass("post");

        var element = '';

        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add post" autocomplete="off">';
        element = element + '<input name="title" class="name" id="name" placeholder="Nome post" autocolplete="off" required />'
        element = element + '<select id="path" name="path">'
        
        for(var i in obj){
            var name = obj[i].name.replace(/\-/g, ' ');
            element = element + '<option categoryId="' + obj[i].categoryId + '" argumentId="' + obj[i].argumentId + '" value="' + obj[i].name + '">' + name + '</option>';
        }
        
        element = element + '</select>'
        element = element + '<input type="hidden" name="categoryId" value="">'
        element = element + '<input type="hidden" name="argumentId" value="">'
        element = element + '<input name="IsPublic" id="IsPublic" type="checkbox" class="is-active btn-switch"><label for="IsPublic" data-off="non pubblico" data-on="pubblicato"></label>';
        element = element + '<input type="hidden" name="coverImage" class="name" id="cover">';
        element = element + '<span class="btn cover text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Cover image</span>';
        element = element + '<input type="hidden" name="images" class="name" id="album">';
        element = element + '<span class="btn upload-album text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Aggiungi album</span>';
        element = element + '<input type="hidden" name="video" class="name" id="video">';
        element = element + '<span class="btn upload-video text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Aggiungi video</span>';
        element = element + '<div class="text-center skeleton-container"></div>'
        element = element + '<textarea name="testo" id="editor"></textarea>'

        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>';

        $overlay.after(element);
        
        summernoteInit();
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
            event.data = new app.Data(true, null, null, 'Post/Index', false, null);
            app.callback(event, updatePostList);
        }
    };

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

    /* EDIT */
    var editPost = function(event){
        var $overlay = app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));
        var url = 'Post/GetById/'+ id;

        //GET POST DATA FROM SERVER
        fetch(url,{method: 'POST'})
        .then(function(res){
            res.json()
                .then(function(data){
                    
                    //CREATE EDIT POST
                    CreateEditList(data, $overlay);
                    
                    //ADD SKELETON FOR ALUBM IMAGE AND VIDEO 
                    album.addSkeletonOfImageForRadio('Photo/GetById/', data.photoId, $('.skeleton-container'));
                    
                    if(data.album !== null){

                        if(data.album.idImmagini !== ""){
                            album.addSkeletonOfImage('Photo/GetById/', data.album.idImmagini, $('.skeleton-container'));
                        }

                        if(data.album.idVideo !== ""){
                            album.addSkeletonOfVideo('Video/GetById/', data.album.idVideo, $('.skeleton-container'));
                        }
                    }

                    //ADD SUMMERNOTE
                    summernoteInit()
                })
        });
        
    };

    var CreateEditList = function(obj, elemToAppend){
        
        $('div#overlay > span').addClass("post");
    
        var element = '';
        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit post" autocomplete="off">';
        element = element + '<input name="title" class="name" id="name" autocolplete="off" value="' + obj.title + '" required />'
        element = element + '<select id="path" name="path">'

        //Add post path 
        for(var i in obj.postsPath){
            var categoryId = obj.postsPath[i].categoryId;
            var argumentId = obj.postsPath[i].argumentId;
            var name = obj.postsPath[i].name;

            if( categoryId == obj.categoryId && argumentId == obj.argumentId){
                element = element + '<option categoryId="' + categoryId + '" argumentId="' + argumentId + '" value="' + name + '" selected>' + name + '</option>';
            } else {
                element = element + '<option categoryId="' + categoryId + '" argumentId="' + argumentId + '" value="' + name + '">' + name + '</option>';
            }
        }
        element = element + '</select>'
        element = element + '<input type="hidden" name="categoryId" value="' + obj.categoryId + '">'
        element = element + '<input type="hidden" name="argumentId" value="' + obj.argumentId + '">'
        
        if(obj.pubblico === true){
            element = element + '<input name="IsPublic" id="IsPublic" type="checkbox" class="is-active btn-switch" checked><label for="IsPublic" data-off="non pubblico" data-on="pubblicato"></label>';
        } else {
            element = element + '<input name="IsPublic" id="IsPublic" type="checkbox" class="is-active btn-switch"><label for="IsPublic" data-off="non pubblico" data-on="pubblicato"></label>';
        };

        element = element + '<input type="hidden" name="coverImage" class="name" id="cover" value="' + obj.photoId + '">';

        if(obj.album !== null && obj.album !== undefined){
            element = element + '<input type="hidden" name="images" class="name" id="album" value="' + obj.album.idImmagini +'">';
            element = element + '<input type="hidden" name="video" class="name" id="video" value="' + obj.album.idVideo + '">';
        } else {
            element = element + '<input type="hidden" name="images" class="name" id="album">';
            element = element + '<input type="hidden" name="video" class="name" id="video">';
        }

        element = element + '<span class="btn cover text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Cover image</span>';
        element = element + '<span class="btn upload-album text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Aggiungi album</span>';
        element = element + '<span class="btn upload-video text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Aggiungi video</span>';
        
        //Update skeleton with image or video in album
        element = element + '<div class="text-center skeleton-container">'
        element = element + '</div>'

        element = element + '<textarea name="testo" id="editor">' + obj.testo  + '</textarea>'
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        elemToAppend.after(element);
    };

    var updatePost = function(event){
        event.preventDefault();
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, 'Post/Update/', false, null);

        app.callback(event, updatePostList);
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
            feedback = app.feedbackEvent(true, 'Post aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento del post, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    };

    /* DELETE */
    var deletePost = function(event){
        var id = $('div.delete').attr('id');
        event.data = new app.Data(true, id, null, 'Post/Delete/', false, null);
        app.callback(event, updatePostList);
    };

    var createRemovePost = function(event){
        var id = $(this).parent().attr('id');
        var postName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare il post: ' + postName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    /* GET AND DISPLAY ARGUMENT AND CATEGORY */
    var createFatherInfo = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        var url = 'Post/GetById/' + id;
        var self = $(this);

        fetch(url,{method: 'POST'})
        .then(function(res){
            res.json()
                .then(function(data){
                    var element = ''
                    var  path = data.categoryName;

                    if(data.argumentName !== ""){
                        path = path + ' / ' + data.argumentName;
                    }

                    element = element + '<section id="argument-path" class="box-shadow border-radius-small text-center color-white">' + path + '<section>';
                    self.after(element);
                })
        });
    }
    
    var closeFatherInfo = function(){
        if($('section#argument-path').length > 0){
            $('section#argument-path').remove();
        }
    }

    /* SUMMERNOTE */
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

    var summernoteDestroy = function(){
        if($('#editor').length > 0 ){
            $('#editor').summernote('destroy');
        }
    }

    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $(event.target).parent().find('span.btn.paginator.active').removeClass('active');
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        
        event.data = new app.Data(false, null, href, 'Post/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createPostList);
    }
    
    return {
        createRemovePost: createRemovePost,
        addNewPost: addNewPost,
        getAll: getAll,
        editPost: editPost,
        updatePost: updatePost,
        deletePost: deletePost,
        summernoteDestroy: summernoteDestroy,
        getAllPath: getAllPath,
        createFatherInfo: createFatherInfo,
        closeFatherInfo: closeFatherInfo,
        changePage: changePage
    };

})();

var postUI = (function(){

    var DOM = {
        btnCloseOverlay: '.btn#close',
        btnAdd: '.btn#add',
        btnAddPost: 'form.add.post .btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
        btnInfo: '.btn.info',
        selectCategory: 'select#path',
        btnChangePage: 'span.btn.paginator'
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
        $(document).on('click', DOMElement.btnAdd, postCtrl.getAllPath);

        $(document).on('click', DOMElement.btnAddPost, postCtrl.addNewPost);

        $(document).on('click', DOMElement.btnEdit, { postList: DOMElement.list }, postCtrl.editPost);
        $(document).on('click', DOMElement.btnRemove , postCtrl.createRemovePost);
        
        $(document).on('click', DOMElement.btnInfo, postCtrl.createFatherInfo);
        $(document).on('click', DOMElement.btnUpdate, postCtrl.updatePost);
        $(document).on('click', DOMElement.btnDelete, postCtrl.deletePost);

        $(document).on('click', DOMElement.btnCloseOverlay, postCtrl.summernoteDestroy);

        //Update nput with id of category or argument selected
        $(document).on('change', DOMElement.selectCategory, updateInputAfterSelect);

        $(document).on('click', postCtrl.closeFatherInfo);
    };

    var updateInputAfterSelect = function(){
        var categoryId = $('select#path option:selected').attr('categoryId');
        var argumentId = $('select#path option:selected').attr('argumentId');
        $('input[name="categoryId"]').val(categoryId);
        $('input[name="argumentId"]').val(argumentId);
    }

    //Change page 
    $(document).on('click', DOMElement.btnChangePage, postCtrl.changePage);

    return {
        init: init
    };

})(postController, postUI);