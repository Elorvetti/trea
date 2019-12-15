var postController = (function(){

    var createPostList = function(obj, i){
        var element = '';
        var path = '';
        
        console.log(obj);
        element = element + '<li class="list" id="' + obj[i].id +'">';
        
        if(obj[i].argumentName !== ""){
            path = obj[i].categoryName + ' / ' + obj[i].argumentName + ' / ' +  obj[i].title;
        } else {
            path = obj[i].categoryName + ' / ' +  obj[i].title;
        }
        
        element = element + '<p public="' + obj[i].pubblico + '">' + path + '</p>';
        element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
        element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        element = element + '</li>';
        
        return element;
    };

    var CreateEditList = function(obj){
    
        var $overlay = app.createOverlay();
        $overlay.addClass("post");
    
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

    var getAllPath = function(event){
        event.data = new app.Data(false, null, '/Post/GetAllPath', false, null);
        app.callback(event, createNewPostForm);
    }

    var summernoteDestroy = function(){
        if($('#editor').length > 0 ){
            $('#editor').summernote('destroy');
        }
    }

    return {
        createRemovePost: createRemovePost,
        addNewPost: addNewPost,
        getAll: getAll,
        editPost: editPost,
        updatePost: updatePost,
        deletePost: deletePost,
        summernoteDestroy: summernoteDestroy,
        getAllPath: getAllPath
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
        selectCategory: 'select#path'
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
        
        $(document).on('click', DOMElement.btnUpdate, postCtrl.updatePost);
        $(document).on('click', DOMElement.btnDelete, postCtrl.deletePost);

        $(document).on('click', DOMElement.btnCloseOverlay, postCtrl.summernoteDestroy);

        //Update nput with id of category or argument selected
        $(document).on('change', DOMElement.selectCategory, updateInputAfterSelect);
    };

    var updateInputAfterSelect = function(){
        var categoryId = $('select#path option:selected').attr('categoryId');
        var argumentId = $('select#path option:selected').attr('argumentId');
        $('input[name="categoryId"]').val(categoryId);
        $('input[name="argumentId"]').val(argumentId);
    }

    return {
        init: init
    };

})(postController, postUI);