"use strict";

var userController = (function(){

    var createUserList = function(obj, i){
        var element = '';
        
        element = element + '<li class="list" id="' + obj[i].id +'">';
        element = element + '<p active="' + obj[i].isActive + '">' + obj[i].user + '</p>';
        element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
        element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        element = element + '</li>';
        
        return element;
    };
    
    var CreateEditList = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
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

    var createNewUserForm = function(){
        
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
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
       
        var state = validateNewUser();
        var valid = true;

        var invalid = state.invalid.email === true || state.invalid.password === true || state.invalid.confirmPassword === true;
       
        $('form :input').each(function(){
            var required = $(this).attr('required') !== undefined;

            if(invalid || $(this).val() === "" && required ){
                if($('form.add > span').length === 0){
                    var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
                    $('form').prepend(errorMessage);
                };
                valid = false;
            };
        });

        if(valid){
            event.data = new app.Data(true, null, '/User/Index', false, null);
            app.callback(event, updateUserList);
        };
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

    var editUser = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.userList;

        event.data = new app.Data(false, id, 'User/GetById/', false, list);

        app.callback(event, CreateEditList);
    };

    var updateUser = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, 'User/Update/', false, null);
        app.callback(event, updateUserList);
    };

    var deleteUser = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, 'User/Delete/', false, null);
        app.callback(event, updateUserList);
    };

    var getAll = function(event){
        event.data = new app.Data(false, null, 'User/GetAll', true, $('div.content > ul.list'));

        app.callback(event, createUserList);
    };

    return {
        createNewUserForm: createNewUserForm,
        createRemoveUser: createRemoveUser,
        addNewUser: addNewUser,
        getAll: getAll,
        editUser: editUser,
        updateUser: updateUser,
        deleteUser: deleteUser
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
        $(document).ready(userCtrl.getAll);

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, userCtrl.createNewUserForm);
        $(document).on('click', DOMElement.btnAddUser, userCtrl.addNewUser);
      
        $(document).on('click', DOMElement.btnEdit, { userList: DOMElement.list }, userCtrl.editUser);
        $(document).on('click', DOMElement.btnRemove , userCtrl.createRemoveUser);
        
        $(document).on('click', DOMElement.btnUpdate, userCtrl.updateUser);
        $(document).on('click', DOMElement.btnDelete, userCtrl.deleteUser);
    };

    return {
        init: init
    };

})(userController, userUI);
