"use strict";

var userController = (function(){
    /* FILTER */
    var createFilterForm = function(){
        var $overlay = app.createOverlay();

        var element = '';
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        if($('input#email').length > 0){
            element = element + '<input name="email" class="name" id="email" placeholder="Email" autocomplete="off" value="' + $('input#email').val() + '"/>';
        } else {
            element = element + '<input name="email" class="name" id="email" placeholder="Email" autocomplete="off" />';
        }
        
        if($('input#active').length > 0){
            element = element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch" checked><label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
        } else {
            element = element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch"><label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
        }
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="find" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Cerca">';   
        element = element + '</div>';

        $overlay.after(element);
    };

    var displayFilter = function(event){
        event.preventDefault();

        $('form.display-filter').remove();

        var email = $('input#email').val();
        var active = $('#IsActive').is(':checked');
            
        var element = '';
        element = element + '<form class="display-filter">';
        if(email !== ''){
            element = element + '<span class="close-filter border-radius-medium box-shadow margin-bottom-xsmall margin-right-xsmall padding-xsmall background-color-white">';
            element = element + '<input type="text" id="email" name="email" class="color-black" value="' + email + '" />';
            element = element + '</span>'
        }
        if(active){
            element = element + '<span class="close-filter border-radius-medium box-shadow margin-bottom-xsmall margin-right-xsmall padding-xsmall background-color-white">';
            element = element + '<input type="text" id="active" name="active" class="color-black" value="Attivo" />';
            element = element + '</span>'
        }
        element = element + '</form>';

        $('div#sidebar').after(element);

        filterUser();
    }

    var filterUser = function(){
        var param = '?' + $('form').serialize() + '&pageSize=15&pageNumber=1';
        event.data = new app.Data(false, null, param, '/backoffice/User/Find', true, $('div.content > ul.list'));

        app.callback(event, createUserList);
        $('div#overlay').remove();
    };

    var removeFilter = function(){
        $(this).remove();

        var param = '?' + $('form').serialize() + '&pageSize=15&pageNumber=1';
        event.data = new app.Data(false, null, param, '/backoffice/User/Find', true, $('div.content > ul.list'));

        if($('form.display-filter > *').length == 0){
            $('form.display-filter').remove();
        }

        app.callback(event, createUserList)
    };

    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=15&pageNumber=1', '/backoffice/User/GetAll', true, $('div.content > ul.list'));

        return app.callback(event, createUserList);
    };

    var createUserList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';

        for(var i in obj.administrators){
            element = element + '<li class="list" id="' + obj.administrators[i].id +'">';
            element = element + '<p active="' + obj.administrators[i].isActive + '">' + obj.administrators[i].user + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light" tooltip="Modifica utente"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red" tooltip="Elimina utente"></span>';
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
        element = element + '<input name="photoId" id="cover" automplete="off" type="hidden" />'
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
            event.data = new app.Data(true, null, null, '/backoffice/User/Index', false, null);
            app.callback(event, updateUserList);
        };
    };

    /* EDIT */
    var editUser = function(event, userId){
        //Add overlay
        var $overlay = app.createOverlay();
        var id = "";

        if (userId !== undefined) {
            id = userId
        } else {
            id = parseInt($(event.target).parent().attr('id'));
        }

        event.data = new app.Data(false, id, null, '/backoffice/User/GetById/', false, $overlay);

        app.callback(event, CreateEditList);
    };

    var CreateEditList = function(obj){
        var element = '';
        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        if(obj.photoId > 0){
            element = element + '<span class="btn user-image background-color-white box-shadow" style="background-size: cover; background-image: url(\'' + obj.photoPath +'\');" tooltip="Foto utente"></span>'
        } else {
            element = element + '<span class="btn user-image background-color-white box-shadow" tooltip="Foto utente"></span>'
        }
        element = element + '<input id="cover" name="photoId" automplete="off" type="hidden" value="' + obj.photoId + '"/>'
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

        event.data = new app.Data(true, id, null, '/backoffice/User/Update/', false, null);
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

    /* GET USER EDIT FROM QUERYSTRING */
    var editUserFormQueryString = function (event) {
        event = {};
        const urlParams = app.getParameterByName("id", window.location.search);
        if (urlParams !== undefined && urlParams !== null && urlParams !== "") {
            editUser(event, urlParams);
        }
    }

    /* DELETE */
    var deleteUser = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, null, '/backoffice/User/Delete/', false, null);
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

    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $(event.target).parent().find('span.btn.paginator.active').removeClass('active');
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        var sectionName = $(this).attr('section');
        
        if(sectionName === 'Photo'){
            event.data = new app.Data(false, null, href, '/backoffice/Photo/GetAll', true, $('div#select > section.image'));
            app.callback(event, createAddUserPhoto);
        } else if( sectionName === 'User' ){
            event.data = new app.Data(false, null, href, '/backoffice/User/GetAll', true, $('div.content > ul.list'));
            app.callback(event, createUserList);
        }

    }

    return {
        createFilterForm: createFilterForm,
        displayFilter: displayFilter,
        removeFilter: removeFilter,
        createNewUserForm: createNewUserForm,
        createRemoveUser: createRemoveUser,
        addNewUser: addNewUser,
        getAll: getAll,
        editUser: editUser,
        editUserFormQueryString: editUserFormQueryString,
        updateUser: updateUser,
        deleteUser: deleteUser,
        changePage: changePage
    };
})();

var userUI = (function(){

    var DOM = {
        btnFilter: '.btn#filter',
        btnFind: '.btn#find',
        btnRemoveFilter: 'form.display-filter > span.close-filter',
        btnAdd: '.btn#add',
        btnAddUser: 'form.add .btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
        btnChangePage: 'span.btn.paginator',
    };

    return {
        DOMElement: DOM
    };
    
})();

var user = (function(userCtrl, userUI){
    var DOMElement = userUI.DOMElement;

    var init = function(){
        console.log('user init');

        //Add tooltip of Add
        $(DOMElement.btnAdd).attr('tooltip', 'Aggiungi nuovo utente');

        //On document load create element list
        userCtrl.getAll(event);
        userCtrl.editUserFormQueryString(event);

        //Add event handler on button
        $(document).on('click', DOMElement.btnFilter, userCtrl.createFilterForm);
        $(document).on('click', DOMElement.btnFind, userCtrl.displayFilter);
        $(document).on('click', DOMElement.btnRemoveFilter, userCtrl.removeFilter);

        $(document).on('click', DOMElement.btnAdd, userCtrl.createNewUserForm);
        $(document).on('click', DOMElement.btnAddUser, userCtrl.addNewUser);
      
        $(document).on('click', DOMElement.btnEdit, { userList: DOMElement.list }, userCtrl.editUser);
        $(document).on('click', DOMElement.btnRemove , userCtrl.createRemoveUser);
        
        $(document).on('click', DOMElement.btnUpdate, userCtrl.updateUser);
        $(document).on('click', DOMElement.btnDelete, userCtrl.deleteUser);

        //Change page 
        $(document).on('click', DOMElement.btnChangePage, userCtrl.changePage);
    };

    return {
        init: init
    };

})(userController, userUI);
