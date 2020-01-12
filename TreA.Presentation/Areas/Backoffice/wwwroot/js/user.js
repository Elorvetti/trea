"use strict";

var userController = (function(){
    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=15&pageNumber=1', 'backoffice/User/GetAll', true, $('div.content > ul.list'));

        return app.callback(event, createUserList);
    };

    var createUserList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';
        
        for(var i in obj.administrators){
            element = element + '<li class="list" id="' + obj.administrators[i].id +'">';
            element = element + '<p active="' + obj.administrators[i].isActive + '">' + obj.administrators[i].user + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red"></span>';
            element = element + '</li>';
        }
        
        return element;
    };
    
    /* ADD NEW */
    var createNewUserForm = function(){
        
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        element = element + '<span class="btn user-image background-color-white box-shadow"></span>'
        element = element + '<input name="photoId" id="photoId" automplete="off" type="hidden" />'
        element = element + '<input name="email" class="name" id="email" placeholder="Email" autocomplete="off" required />';
        element = element + '<input name="password" type="password" id="password" class="password" placeholder="Prassword" autocomplete="off" required />';
        element = element + '<input name="confirmPassword"  type="password" class="confirmPassword" id="confirmPassword" placeholder="Conferma Prassword" autocomplete="off" required />';
        element = element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch"><label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>';

        $overlay.after(element);
        validateNewUser();

    };

    var validateNewUser = function(){

        $.validator.addMethod('password_regex', function(value, element, regex){
            return regex.test(value);
        }, "La password deve contenere almeno: una lettera minuscola, una lettera maiuscola e un carattere speciale");

        return $('form').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        minlength: 8,
                        password_regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

                    }, 
                    confirmPassword: {
                        required: true,
                        equalTo: '#password'
                    }
                },
                message: {
                    email:{
                        required: 'Il campo Email è obbligatorio',
                        email: 'Formato Email non valido'
                    }, 
                    password: {
                        required: 'Il campo Password è obbligatorio',
                        minlength: 'Il campo Password deve contenere almeno 8 caratteri'
                    },
                    confirmPassword: {
                        required: 'Il campo conferma password è oblligatorio',
                        equalTo: 'Il campo Conferma password non coincide con il campo Password'
                    }
                }
            });
    };

    var addNewUser = function(event){
       event.preventDefault();

        var state = validateNewUser();
        var valid = true;

        var invalid = state.invalid.email === true || state.invalid.password === true || state.invalid.confirmPassword === true;
       
        $('form :input').each(function(){
            var required = $(this).attr('required') !== undefined;

            if(invalid || $(this).val() === "" && required ){
                if($('form.add > span.field-validation-error').length === 0){
                    var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
                    $('form').prepend(errorMessage);
                };
                valid = false;
            };
        });

        if(valid){
            event.data = new app.Data(true, null, null, 'backoffice/User/Index', false, null);
            app.callback(event, updateUserList);
        };
    };

    /* EDIT */
    var editUser = function(event){
        //Add overlay
        var $overlay = app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.userList;

        event.data = new app.Data(false, id, null, 'backoffice/User/GetById/', false, $overlay);

        app.callback(event, CreateEditList);
    };

    var CreateEditList = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        if(obj.photoId > 0){
            element = element + '<span class="btn user-image background-color-white box-shadow" style="background-size: cover; background-image: url(\'' + obj.photoPath +'\');"></span>'
        } else {
            element = element + '<span class="btn user-image background-color-white box-shadow"></span>'
        }
        element = element + '<input id="photoId" name="photoId" automplete="off" type="hidden" value="' + obj.photoId + '"/>'
        element = element + '<input name="email" class="name" autocomplete="off" value="' + obj.user + '" disabled />';
        
        if(obj.isActive === true){
            element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch" checked>';
        } else {
            element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch">';
        };

        element = element + '<label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>';

        return element;
    };

    var updateUser = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, 'backoffice/User/Update/', false, null);
        app.callback(event, updateUserList);
    };

    var updateUserList = function(event){
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
            feedback = app.feedbackEvent(true, 'Utente aggiornato');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento utenti, provare a ricicare la pagina');
        }; 
        $overlay.after(feedback);
    };

    /* DELETE */
    var deleteUser = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, null, 'backoffice/User/Delete/', false, null);
        app.callback(event, updateUserList);
    };

    var createRemoveUser = function(event){
        var id = $(this).parent().attr('id');
        var userName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare l\'utente: ' + userName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    /* ADD USER PHOTO */
    var addUserPhoto = function(event){
        var element = '';
        var element = '<div id="select" ><span class="btn close select"></span><section class="image background-color-white border-radius-small text-center padding-small margin-bottom-medium"></div>'
        $('body').append(element)

        event.data = new app.Data(false, null, '?pageSize=13&pageNumber=1', 'backoffice/Photo/GetAll', true, $('div#select > section.image'));
        
        app.callback(event, createAddUserPhoto);

        $(document).on('click', '.btn.close.select', function(){
            $('div#select').remove();
        })
    };

    var createAddUserPhoto = function(obj){
        $('div#select > section.image > *:not(div.paginator)').remove();

        var id = $('input#photoId').val()
        var element = '';

        for(var i in obj.photos){
            if(id == obj.photos[i].id ){
                element = element + '<input type="radio" name="group" id="img-' + obj.photos[i].id + '" checked/>';
            } else {
                element = element + '<input type="radio" name="group" id="img-' + obj.photos[i].id + '" />';
            }
            
            element  = element + '<label for="img-' + obj.photos[i].id + '" id="' + obj.photos[i].id + '" class="border-radius-small margin-bottom-xsmall" style="background-image: url(\'' + obj.photos[i].path + '\');" ></label>';    
        }

        return element;
        
    };

    var selectedImage = function(event){
        //Get id select and image selected
        var id = $(this).attr('id');
        var image = $(this).css('background-image');

        $('div#overlay > form > input#photoId').val(id);
        $('div#overlay > form > span.user-image').css('background-size', 'cover ');
        $('div#overlay > form > span.user-image').css('background-image', image);
        $('div#select').remove();

    };

    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $(event.target).parent().find('span.btn.paginator.active').removeClass('active');
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        var sectionName = $(this).attr('section');
        
        if(sectionName === 'Photo'){
            event.data = new app.Data(false, null, href, 'backoffice/Photo/GetAll', true, $('div#select > section.image'));
            app.callback(event, createAddUserPhoto);
        } else if( sectionName === 'User' ){
            event.data = new app.Data(false, null, href, 'backoffice/User/GetAll', true, $('div.content > ul.list'));
            app.callback(event, createUserList);
        }

    }

    return {
        createNewUserForm: createNewUserForm,
        createRemoveUser: createRemoveUser,
        addNewUser: addNewUser,
        getAll: getAll,
        editUser: editUser,
        addUserPhoto: addUserPhoto,
        selectedImage: selectedImage,
        updateUser: updateUser,
        deleteUser: deleteUser,
        changePage: changePage
    };
})();

var userUI = (function(){

    var DOM = {
        btnAdd: '.btn#add',
        btnAddUser: '.btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
        btnUserPhoto: '.btn.user-image',
        btnAvatarImageSelect: 'section input[type="radio"] + label',
        btnChangePage: 'span.btn.paginator'
    };

    return {
        DOMElement: DOM
    };
    
})();

var user = (function(userCtrl, userUI){
    var DOMElement = userUI.DOMElement;

    var init = function(){
        console.log('user init');

        //On document load create element list
        userCtrl.getAll(event);

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, userCtrl.createNewUserForm);
        $(document).on('click', DOMElement.btnAddUser, userCtrl.addNewUser);
      
        $(document).on('click', DOMElement.btnEdit, { userList: DOMElement.list }, userCtrl.editUser);
        $(document).on('click', DOMElement.btnRemove , userCtrl.createRemoveUser);
        
        $(document).on('click', DOMElement.btnUserPhoto, userCtrl.addUserPhoto);
        $(document).on('click', DOMElement.btnAvatarImageSelect, userCtrl.selectedImage)
        
        $(document).on('click', DOMElement.btnUpdate, userCtrl.updateUser);
        $(document).on('click', DOMElement.btnDelete, userCtrl.deleteUser);

        //Change page 
        $(document).on('click', DOMElement.btnChangePage, userCtrl.changePage);
    };

    return {
        init: init
    };

})(userController, userUI);
