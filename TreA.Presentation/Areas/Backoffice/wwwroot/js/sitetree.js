"use strict";

var siteTreeController = (function(){   
    // CATEGORY //
    //1. Get All Category
    var getAllCategory = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=10000&pageNumber=1', '/Backoffice/Category/GetAll', true, $('div.content > ul#siteTree.list'));
        app.callback(event, createCategoryList);
    }

    var createCategoryList = function(obj){
        $('div.content > ul#siteTree.list > li').remove();
        var element = '';

        for(var a in obj.categories){
            element = element + '<li class="category list" id="' + obj.categories[a].id +'">';
            element = element + '<p displayOrder="' + obj.categories[a].displayOrder + '">' + obj.categories[a].name + '</p>';
            element = element + '<span class="category btn btn-circle edit background-color-blue-light box-shadow"></span>';
            element = element + '<span class="category btn btn-circle remove background-color-red box-shadow"></span>';
            element = element + '<span class="category btn btn-circle file-add background-color-blue box-shadow"></span>';
            element = element + '<span class="category btn btn-circle folder-add background-color-white-light box-shadow"></span>';
            element = element + '</li>';
        }
        
        return element;
    }

    //2. Add New Category
    var createNewCategoryForm = function(){      
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white category-add" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" placeholder="Nome" autocomplete="off" required>';
        element = element + '<textarea name="description" class="name" id="description" placeholder="Descrizione" autocomplete="off"></textarea>';
        element = element + '<input type="number" name="order" class="order" id="order" placeholder="Ordinamento" autocomplete="off" required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>'

        $overlay.after(element);

    }

    var validateNewCategory = function(){
        return $('form').validate({
                rules: {
                    name: {
                        required: true
                    },
                    order: {
                        required: true
                    }
                },
                message: {
                    name:{
                        required: 'Il campo Nome è obbligatorio',
                    }, 
                    order: {
                        required: 'Il campo Ordinamento è obbligatorio',
                    }
                }
            })
    }

    var addNewCategory = function(event){    
        event.preventDefault();

        var state = validateNewCategory();
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
            event.data = new app.Data(true, null, null, '/Backoffice/Category/Index', false, null);
            app.callback(event, updateCategoryList);
        }
        
    }

    //3. Edit-Update Category List
    var editCategory = function(event){
        var $overlay = app.createOverlay();
        var id = $(this).parent().attr('id');

        event.data = new app.Data(false, id, null, '/Backoffice/Category/GetById/', false, $overlay);

        app.callback(event, createUpdateCategoryForm);
    }

    var createUpdateCategoryForm = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white category-edit" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.name +'" required>';
        element = element + '<textarea name="description" class="name" id="desscription" autocomplete="off" placeholder="Descrizione" row="4">'+ obj.description + '</textarea>';
        element = element + '<input type="number" name="order" class="order" id="order"  autocomplete="off" value="'+ obj.displayOrder +'"  required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        return element;
    }

    var updateCategory = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, '/Backoffice/Category/Update/', false, null);
        app.callback(event, updateCategoryList);
    }

    var updateCategoryList = function(){
        //remove element to DOM
        $('#overlay').remove();
        $('ul#siteTree.list > li').remove();

        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        }
        
        if($('ul#siteTree.list > li').length === 0){
            getAllCategory()
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Categoria aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della categoria, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    }

    //4. Delete category
    var createRemoveCategory = function(event){
        var id = $(this).parent().attr('id');
        var categoryName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white category-delete">';
        element = element + '<p class="text-center confirm">Sei sicuro di voler eliminare la categoria: ' + categoryName + '?</p>';
        element = element + '<p class="text-center confirm color-red">Cancellando la categoria ' + categoryName + ' verranno cancellati anche i relativi argomenti';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    }

    var deleteCategory = function(event){
        var id = $('div.category-delete').attr('id');
        
        event.data = new app.Data(true, id, null, '/Backoffice/Category/Delete/', false, null);
        app.callback(event, updateCategoryList);
    }

    //5. Display Category Child
    var displayCategoryChild = function(){
        $('ul#siteTree > li').each(function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
            }
        })
        $(this).addClass('active');

        var id = $(this).attr('id');
        
        if($('ul#child').length > 0){
            $('ul#child').remove();
        };

        var url = '/Backoffice/SiteTree/GetCategoryChildId/' + id;
    
        fetch(url, { method: 'POST' })
            .then(function(res){
                res.json()
                    .then(function(data){

                        var element = '';
                        element = element + '<ul id="child" class="list argument padding-xsmall" category-id="' + data.id + '">';                     
                        element = CreateArgumentList(data.arguments, element, 'argument');
                        
                        
                        if(data.posts.length > 0){
                            element = CreatePostList(data.posts, element);
                        }

                        element = element + '</ul>';

                        $('ul#siteTree').after(element);
                    })
            })

    }

    // ARGUMENT //
    //1. Get All Argument
    var getAllArgument = function(){
        var id = $('ul#child').attr('category-id');
        var event = {};
        event.data = new app.Data(false, id, null, '/Backoffice/Argument/GetByCategoryId/', true, $('div.content > ul#child.list'));
        app.callback(event, createArgumentListAfterInsert);
    };

    var CreateArgumentList = function(children, element){
        for(var child in children){
            element = element + '<li class="list argument" id="' + children[child].id +'" level="' + children[child].livello + '" >';
            element = element + '<span class="fake-btn"></span>';
            element = element + '<p>' +  children[child].name + '</p>';
            element = element + '<span class="argument btn btn-circle edit background-color-blue-light box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle remove background-color-red box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle file-add background-color-blue box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle folder-add background-color-white-light box-shadow"></span>';
            element = element + '</li>';
        }

        return element;
    };

    var createArgumentListAfterInsert = function(obj){
        $('div.content > ul#child.list > li').remove();
        var element = '';

        for(var i in obj.arguments){
            element = element + '<li class="list argument" id="' + obj.arguments[i].id +'" level="' + obj.arguments[i].livello +'">';
            element = element + '<span class="fake-btn"></span>';
            element = element + '<p>' +  obj.arguments[i].name + '</p>';
            element = element + '<span class="argument btn btn-circle edit background-color-blue-light box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle remove background-color-red box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle file-add background-color-blue box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle folder-add background-color-white-light box-shadow"></span>';
            element = element + '</li>';
        }

        element = CreatePostList(obj.posts, element);

        return element;
    };
  
    //2. Add New Argument
    var createNewArgumentForm = function(){
        var categoryId = $(this).parent().attr('id');
        var $overlay = app.createOverlay();

        var element = '';

        element = element + '<form class="box-shadow border-radius-small text-center background-color-white argument-add" autocomplete="off">'
        element = element + '<input type="hidden" name="idCategory" value="' + categoryId + '" />'
        element = element + '<input type="hidden" name="livello" value="1" />'
        element = element + '<input type="hidden" name="idPadre" value="0" />'

        element = element + '<input type="text" name="name" class="name" id="name" placeholder="Nome" autocomplete="off" required>';
        element = element + '<textarea name="description" class="name" id="description" placeholder="Descrizione" autocomplete="off"></textarea>';
        element = element + '<span class="btn cover text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Cover image</span>';
        element = element + '<input type="hidden" name="coverImage" class="name" id="cover">';
        element = element + '<div class="text-center skeleton-container"></div>'
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>'

        element = element + '</form>'

        $overlay.after(element);
    };

    var validateNewArgument = function(){

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

    var addNewArgument = function(event){
        event.preventDefault();

        var state = validateNewArgument();
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
            event.data = new app.Data(true, null, null, 'Argument/Index', false, null);
            app.callback(event, updateArgumentList);
        }
    };

    //3. Edit-Update Argument List
    var editArgument = function(event, argumentId){
        var $overlay = app.createOverlay();
        var id = "";

        if (argumentId !== undefined) {
            id = argumentId
        } else {
            id = $(this).parent().attr('id');
        }
        var url = '/Backoffice/Argument/GetById/' + id;

        fetch(url, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        
                        //CREATE ARGUMENT POST
                        createUpdateArgumentForm(data, $overlay);

                        //ADD SKELETON FOR COVER IMAGE
                        if(data.coverImageId > 0){
                            album.addSkeletonOfImageForRadio('/Backoffice/Photo/GetById/', data.coverImageId, $('.skeleton-container'));
                        }

                    })
            })

        
    };

    var createUpdateArgumentForm = function(data, elemToAppend){
        var element = '';

        element = element + '<form id="' + data.id + '" class="box-shadow border-radius-small text-center background-color-white argument-edit" autocomplete="off">';
        element = element + '<input type="hidden" name="idCategory" value="' + data.categoryId + '" />'
        element = element + '<input type="hidden" name="livello" value="' + data.livello + '" />'
        
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ data.name +'" required>';
        element = element + '<textarea name="description" class="name" id="name" autocomplete="off" placeholder="Descrizione" row="4">'+ data.description + '</textarea>';
        
        element = element + '<input type="hidden" name="coverImage" class="name" id="cover" value="' + data.coverImageId + '">';
        element = element + '<span class="btn cover text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Cover image</span>';
        element = element + '<div class="text-center skeleton-container">'
        element = element + '</div>'
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        element = element + '</form>'

        elemToAppend.after(element);
    };

    var updateArgument = function(event){
        event.preventDefault();
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, '/Backoffice/Argument/Update/', false, null);

        app.callback(event, updateArgumentList);
    };

    var updateArgumentList = function(event){
        //remove element to DOM
        $('#overlay').remove();
        $('ul#child.list li').remove();

        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        }
        
        if($('ul#child.list li').length === 0){
            getAllArgument(event)
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Argomento aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento dell\'argomento, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    };

    //4. Delete Argument
    var createRemoveArgument = function(event){
        var id = $(this).parent().attr('id');
        var argumentName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white argument-delete"><p class="text-center confirm">Sei sicuro di voler eliminare la categoria: ' + argumentName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    var deleteArgument = function(event){
        var id = $('div.argument-delete').attr('id');
        
        event.data = new app.Data(true, id, null, '/Backoffice/Argument/Delete/', false, null);
        app.callback(event, updateArgumentList);
    };
    
    //5. Add-Display Argument Folder Child
    var createNewArgumentFolderForm = function(){
        var categoryId = $('ul#child').attr('category-id');
        var level = parseInt($(this).parent().attr('level')) + 1;
        var idPadre = $(this).parent().attr('id');
        var $overlay = app.createOverlay();

        var element = '';

        element = element + '<form class="box-shadow border-radius-small text-center background-color-white argument-add" autocomplete="off">'
        element = element + '<input type="hidden" name="idCategory" value="' + categoryId + '" />'
        element = element + '<input type="hidden" name="livello" value="' + level + '" />'
        element = element + '<input type="hidden" name="idPadre" value="' + idPadre + '" />'

        element = element + '<input type="text" name="name" class="name" id="name" placeholder="Nome" autocomplete="off" required>';
        element = element + '<textarea name="description" class="name" id="description" placeholder="Descrizione" autocomplete="off"></textarea>';
        element = element + '<span class="btn cover text-center box-shadow border-radius-small background-color-pink-light color-white margin-top-small">Cover image</span>';
        element = element + '<input type="hidden" name="coverImage" class="name" id="cover">';
        element = element + '<div class="text-center skeleton-container"></div>'
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>'

        element = element + '</form>'

        $overlay.after(element);
    };

    var getArgumentFolder = function(){
        var categoryId = $('ul#child').attr('category-id');
        var level = parseInt($(this).parent().attr('level')) + 1;
        var idPadre = $(this).parent().attr('id');
        var appendTo = $(this).parent();
         
        $(this).parent().find('ul').remove();
           
        var queryString = '?id=' + categoryId + '&level=' + level + '&idPadre=' + idPadre;
        var url = '/Backoffice/Argument/GetByCategoryId' + queryString;

        fetch(url, {method: 'POST'})
            .then(function(res){
                res.json()
                    .then(function(data){
                        createArgumentFolderList(data, appendTo);
                    })
            })
        
    }

    var createArgumentFolderList = function(obj, appendTo){
        var element = '';
        element = element + '<ul id="child" class="list argument padding-xsmall padding-right-remove" category-id="11">'
       
        for(var i in obj.arguments){
            element = element + '<li class="list argument" id="' + obj.arguments[i].id +'" level="' + obj.arguments[i].livello +'">';
            element = element + '<span class="fake-btn"></span>';
            element = element + '<p>' +  obj.arguments[i].name + '</p>';
            element = element + '<span class="argument btn btn-circle edit background-color-blue-light box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle remove background-color-red box-shadow"></span>';
            element = element + '<span class="argument btn btn-circle file-add background-color-blue box-shadow"></span>';
            element = element + '</li>';
        }

        element = CreatePostList(obj.posts, element);
       
        element = element + '</ul>';
      
        appendTo.append(element);
    }

    // POST //
    //1. Get All Post
    var getAllPost = function(event){
        var categoryId = $('ul#child').attr('category-id');
        var argumentId = 0;
        var livello = 1;
        var idPadre = 0;

        var param = '?categoryId=' + categoryId + '&argumentId=' + argumentId + '&livello=' + livello+ '&idPadre=' + idPadre;
        var event = {};
        event.data = new app.Data(false, param, null, '/Backoffice/Post/GetByCategoryAndArgumentId', true, $('ul#child.list'))
        app.callback(event, createPostListAfterInsert)
    };

    var CreatePostList = function(children, element){
        for(var child in children){
            element = element + '<li class="list post" id="' + children[child].id +'" category-id="' + children[child].categoryId + '" argument-id="' + children[child].argumentId + '">';
            element = element + '<p public="' + children[child].pubblico + '">' +  children[child].title + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light box-shadow"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red box-shadow"></span>';
            element = element + '<span class="btn btn-circle preview background-color-pink-light box-shadow"></span>';
            element = element + '</li>';
        }

        return element;
    };

    var createPostListAfterInsert = function(obj){
        $('div.content > ul#child.list > li').remove();
        var element = '';
        
        element = CreateArgumentList(obj.arguments, element);
        element = CreatePostList(obj.posts, element);

        return element;
    };

    //2. Add new post
    var createNewPostForm = function(event){
        var categoryId = $(this).parent().attr('id');
        var argumentId = 0;

        if($(this).hasClass('argument')){
            categoryId = $('ul#child').attr('category-id');
            argumentId = $(event.target).parent().attr('id');
        }
        
        var $overlay = app.createOverlay();
        $overlay.addClass("post");

        var element = '';

        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add post" autocomplete="off">';
        element = element + '<input name="title" class="name" id="name" placeholder="Nome post" autocolplete="off" required />'
        element = element + '<input name="subtitle" class="name" id="subtitle" placeholder="Sottotitolo" autocolplete="off" required />'
        element = element + '<input type="hidden" name="category-id" value="' + categoryId + '" />'
        element = element + '<input type="hidden" name="argument-id" value="' + argumentId + '" />'
       
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
            event.data = new app.Data(true, null, null, '/Backoffice/Post/Index', false, null);   
            app.callback(event, updatePostList);
        }
    };

    //3. Edit-Update Post List
    var editPost = function(event, postId){
        var $overlay = app.createOverlay();
        var id = "";

        if (postId !== undefined) {
            id = postId
        } else {
            id = parseInt($(this).parent().attr('id'));
        }
        var url = '/Backoffice/Post/GetById/'+ id;

        //GET POST DATA FROM SERVER
        fetch(url,{method: 'POST'})
        .then(function(res){
            res.json()
                .then(function(data){
                    
                    //CREATE EDIT POST
                    CreateEditList(data, $overlay);
                    
                    //ADD SKELETON FOR ALUBM IMAGE AND VIDEO 
                    album.addSkeletonOfImageForRadio('/Backoffice/Photo/GetById/', data.photoId, $('.skeleton-container'));
                    
                    if(data.album !== null){

                        if(data.album.idImmagini !== ""){
                            album.addSkeletonOfImage('/Backoffice/Photo/GetById/', data.album.idImmagini, $('.skeleton-container'));
                        }

                        if(data.album.idVideo !== ""){
                            album.addSkeletonOfVideo('/Backoffice/Video/GetById/', data.album.idVideo, $('.skeleton-container'));
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
        element = element + '<input name="subtitle" class="name" id="subtitle" autocolplete="off" value="' + obj.subtitle + '" required />'
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

        event.data = new app.Data(true, id, null, '/Backoffice/Post/Update/', false, null);

        app.callback(event, updatePostList);
    };

    var updatePostList = function(event){
        //remove element to DOM
        summernoteDestroy();
        $('#overlay').remove();
        $('ul#child.list li').remove();
        
        if($('#overlay').length === 0){
            var $overlay = app.createOverlay();
        }
        
        if($('ul#child.list li').length === 0){
            getAllPost(event)
            var feedback = '';

            //2.1.3 remove overlay
            feedback = app.feedbackEvent(true, 'Post aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento del post, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    };

    /* 5. Delete Post */
    var createRemovePost = function(event){
        var id = $(this).parent().attr('id');
        var postName = $(this).prev().prev().text();
       
        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white post-delete"><p class="text-center confirm">Sei sicuro di voler eliminare il post: ' + postName + '?</p>';
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    var deletePost = function(event){
        var id = $('div.post-delete').attr('id');
        event.data = new app.Data(true, id, null, '/Backoffice/Post/Delete/', false, null);
        app.callback(event, updatePostList);
    };

    /* 6. Preview Post */
    var previewPost = function(){
        var id = parseInt($(event.target).parent().attr('id'));
        var url = '/Backoffice/Post/Preview/'+ id;
        window.open(url);
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

    /* GET ARGUMENT OR POST EDIT FROM QUERYSTRING */
    var editFormQueryString = function (event) {
        event = {};
        const type = app.getParameterByName("type", window.location.search);
        const id = app.getParameterByName("id", window.location.search);

        if (id !== undefined && id !== null && id !== "") {
            if (type === "argument") {
                editArgument(event, id);
            } else if (type === "post") {
                editPost(event, id);
            }
        }
    }

    return {
        getAllCategory: getAllCategory,
        createNewCategoryForm: createNewCategoryForm,
        addNewCategory: addNewCategory,
        editCategory: editCategory,
        updateCategory: updateCategory,
        createRemoveCategory: createRemoveCategory,
        deleteCategory: deleteCategory,
        displayCategoryChild: displayCategoryChild,
        createNewArgumentForm: createNewArgumentForm,
        addNewArgument: addNewArgument,
        editArgument: editArgument,
        updateArgument: updateArgument,
        createRemoveArgument: createRemoveArgument,
        deleteArgument: deleteArgument,
        createNewArgumentFolderForm: createNewArgumentFolderForm,
        getArgumentFolder: getArgumentFolder,
        createNewPostForm: createNewPostForm,
        addNewPost: addNewPost,
        editPost: editPost,
        updatePost: updatePost,
        createRemovePost: createRemovePost,
        deletePost: deletePost,
        previewPost: previewPost,
        summernoteDestroy: summernoteDestroy,
        editFormQueryString: editFormQueryString
    }
})();

var siteTreeUI = (function(){


    var DOM = {
        main: 'main',
        categoryElement: 'ul#siteTree > li',
        btnAddCategory: '.btn#add',
        btnSaveNewCategory: 'form.category-add input#save',
        btnEditCategory: 'li.category.list > span.btn.edit',
        btnUpdateCategory: 'form.category-edit input#update',
        btnRemoveCategory: 'li.category.list > span.btn.remove',
        btnDeleteCategory: 'div.category-delete input#delete',
        btnAddArgument: 'li.category.list > span.btn.folder-add',
        btnSaveNewArgument: 'form.argument-add input#save',
        btnEditArgument: 'ul#child > li.argument > span.edit',
        btnUpdateArgument: 'form.argument-edit input#update',
        btnRemoveArgument: 'li.argument.list > span.btn.remove',
        btnDeleteArgument: 'div.argument-delete input#delete',
        btnAddArgumentFolder: 'li.argument.list > span.btn.folder-add',
        btnGetArgumentFolder: 'ul#child > li.argument > span.fake-btn',
        btnAddNewPost: 'li.list > span.btn.file-add',
        btnSaveNewPost: 'form.post.add input#save',
        btnEditPost: 'ul#child > li.post > span.edit',
        btnUpdatePost: 'form.post.edit input#update',
        btnRemovePost: 'li.post.list > span.btn.remove',
        btnDeletePost: 'div.post-delete input#delete',
        btnPreviewPost: 'li.post.list > span.btn.preview',
        btnCloseOverlay: '.btn#close'
    }


    return {
        DOMElement: DOM
    };
    
})();

var siteTree = (function(siteTreeCtrl, siteTreeUI){
    var DOMElement = siteTreeUI.DOMElement;


    var init = function(){
        console.log('siteTree init');
        $('span#filter').remove();
        siteTreeCtrl.getAllCategory();
        siteTreeCtrl.editFormQueryString(event);

        //Remove scrool on main
        $(DOMElement.main).css('overflow-y', 'hidden');
        
        //Add active class on element pressed
        $(document).on('click', DOMElement.categoryElement, siteTreeCtrl.displayCategoryChild)


        //Add event handler on button
        //1. Category
        $(document).on('click', DOMElement.btnAddCategory, siteTreeCtrl.createNewCategoryForm);
        $(document).on('click', DOMElement.btnSaveNewCategory, siteTreeCtrl.addNewCategory);
        $(document).on('click', DOMElement.btnEditCategory, siteTreeCtrl.editCategory);
        $(document).on('click', DOMElement.btnUpdateCategory, siteTreeCtrl.updateCategory);
        $(document).on('click', DOMElement.btnRemoveCategory, siteTreeCtrl.createRemoveCategory);
        $(document).on('click', DOMElement.btnDeleteCategory, siteTreeCtrl.deleteCategory);

        //2. Argument
        $(document).on('click', DOMElement.btnAddArgument, siteTreeCtrl.createNewArgumentForm);
        $(document).on('click', DOMElement.btnSaveNewArgument, siteTreeCtrl.addNewArgument);
        $(document).on('click', DOMElement.btnEditArgument, siteTreeCtrl.editArgument);
        $(document).on('click', DOMElement.btnUpdateArgument, siteTreeCtrl.updateArgument);
        $(document).on('click', DOMElement.btnRemoveArgument, siteTreeCtrl.createRemoveArgument);
        $(document).on('click', DOMElement.btnDeleteArgument, siteTreeCtrl.deleteArgument);
        $(document).on('click', DOMElement.btnAddArgumentFolder, siteTreeCtrl.createNewArgumentFolderForm);
        $(document).on('click', DOMElement.btnGetArgumentFolder, siteTreeCtrl.getArgumentFolder);

        //3. Post
        $(document).on('click', DOMElement.btnAddNewPost, siteTreeCtrl.createNewPostForm);
        $(document).on('click', DOMElement.btnSaveNewPost, siteTreeCtrl.addNewPost);
        $(document).on('click', DOMElement.btnEditPost, siteTreeCtrl.editPost);
        $(document).on('click', DOMElement.btnUpdatePost, siteTreeCtrl.updatePost);
        $(document).on('click', DOMElement.btnRemovePost, siteTreeCtrl.createRemovePost);
        $(document).on('click', DOMElement.btnDeletePost, siteTreeCtrl.deletePost);
        $(document).on('click', DOMElement.btnPreviewPost, siteTreeCtrl.previewPost);

        //Distroy summernote
        $(document).on('click', DOMElement.btnCloseOverlay, siteTreeCtrl.summernoteDestroy);
    };

    return {
        init: init
    };

})(siteTreeController, siteTreeUI);