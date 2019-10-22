"use strict"

var appController = (function(){
    

    var removeElementToListConfirm = function(){
        var $li = $(this).parent();
        var id = $li.attr('id');
        var userName = $li.find('p').text();

        var element = '<div id="overlay"><span class="btn close"></span>';
        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white">';
        element = element + '<p class="text-center confirm">Sei sicuro di voler eliminare l\'utente: ' + userName + '?</p>';
        element = element + '<div class="text-right">'
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="button" id="delete" class="btn btn-rounded delete text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">'
        element = element + '</div></div></div>'

        $('body').append(element);

        $(document).on('click', '#delete', {id: id},  removeElementToList);
        $(document).on('click', '#return, .btn.close', removeOverlay);
    }

    var removeElementToList = function(event){
        var id = event.data.id;
        console.log(id);
        //$.ajax({
        //    method: 'POST',
        //    url: '/User/DeleteUser/' + id,
        //    success: function(){
        //            
        //    }
        //})
    }
     
    var editElement = function(event){
        var id = parseInt($(this).parent().attr('id'));
        var overlay = createOverlay();

        event.data = {
            id: id,
            url: '/User/GetUserById/' + id,
            listContainer: overlay,
            updateList: false
        };
        callbackServer(event);
    }

    var removeElementConfirm = function(){

    }

    var createEdit = function(obj){
        var element = '<input name="email" class="name" autocomplete="off" value="'+  obj.user + '" disabled />'
        if(obj.isActive === true){
            element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch" checked>'
        } else {
            element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch">'
        }
        element = element + '<label for="IsActive" data-off="non attivo" data-on="attivo"></label>'
        element = element + '<p class="update-psw text-underline color-blue-light text-right margin-top-small"> aggiorna password </p>'
        return element;
    }

    var createList = function(obj, i){
        var element = '<li class="list" id="' + obj[i].id +'">'
        var element = element + '<p active="' + obj[i].isActive + '">' + obj[i].user + '</p>';
        var element = element + '<span class="btn btn-circle edit background-color-blue"></span>';
        var element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        var element = element + '</li>';

        return element;
    }

    var feedbackEvent = function(success, message){
        var element;
        var $overlay = createOverlay();
        
        if(success){
            element = '<span class="box-shadow border-radius-small success text-center color-white">';    
        } else {
            element = '<span class="box-shadow border-radius-small error text-center color-white">';    
        }
        element = element + message;
        element = element + '</span>';

        $overlay.after(element);
        
    }

    var updateUserList = function(event){
        
        //remove element to DOM
        $('#overlay').remove();
        $('ul#user li').remove();

        var overlay = createOverlay();

        event.data = {
            url: '/User/GetAllUsers/',
            listContainer: overlay,
            updateList: true
        };

        if($('ul#user li').length === 0){
            callbackServer(event)
            
            //2.1.3 remove overlay
            feedbackEvent(true, 'Utente aggiunto');
        } else {
            feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento utenti, provare a ricicare la pagina');
        } 
    }

    var callbackServer = function(event){
        event.preventDefault();

        var parameter = {
            post : event.data.post,
            url: event.data.url,
        }
        
        if(event.data.post){
            event.preventDefault();
            
            //1. Get form from DOM
            var $form = $(this).parent().parent();
            var id = $form.attr('id');

            //2. check if we need form validate 
            if(id === 'add'){
                var state = validateAddUser($form);
                if (state.invalid.email === true || state.invalid.password === true || state.invalid.confirmPassword === false) {
                    if($('form#add > span').length === 0) {
    
                        //2.2 show error message    
                        var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
                        $form.prepend(errorMessage);
                        return;
                    }
                }
            }
            
            //3. Serialize data
            var data = $form.serialize();
    
            //2.1.1 Pass JSON To server
            $.ajax({
                method: 'POST',
                data: data,
                url: parameter.url,
                success: function(result){
                    event.data.callbackSuccess()
                }
            })
        } else {
            fetch(parameter.url,{method: 'POST'})
                .then(function(res){
                    return res.json()
                        .then(function(data){
                            if(event.data.updateList){
                                for(var i in data){
                                    var element = createList(data, i);
                                    $(event.data.listContainer).append(element);
                                }
                            } else {
                                var $overlay = createOverlay();
                                var element = createEdit(data);
                                
                                //addEditForm($overlay, data, element);
                            }
                        })
                })

            //Add event listener on list btn
            $(document).on('click', '.btn.edit', editElement);
            $(document).on('click', '.btn.remove', removeElementConfirm);
        }
    }

    var addEditForm = function($overlay, data, element){
        var form = '<form id="' + data.id + '" class="box-shadow border-radius-small text-center background-color-white" autocomplete="off"></form>';

        //append form
        $overlay.after(form);
        
        //get form selector and append data
        var $form = $('#overlay > form');
        $form.append(element);
        
        var url = '/User/UpdateUser/' + data.id;
        createBtnForm($form, removeOverlay, {post: true, url: url, callbackSuccess: updateUserList} ,callbackServer);
    }

    var addUserForm = function(event){
        console.log('add btn pressed');

        //1. Get section id and form add element
        var sectionId = $(event.data.sectionId).attr('id');
        var form = event.data.formData;
        
        //2. Create overlay and append form into overlay
        var $overlay = createOverlay();
        $overlay.after(event.data.formAddHTML);
        
        //2.1 Get form added by id
        var $form = $(event.data.formAddId)
       
        //3. Append element to form
        
        //3.1 Append element to set      
        $form.append(form[sectionId].email);
        $form.append(form[sectionId].password);
        $form.append(form[sectionId].confirmPassword);
        $form.append(form[sectionId].isActive);

        //3.2 append btn 
        createBtnForm($form, removeOverlay, { post: true, url: '/User/Index', callbackSuccess: updateUserList } ,callbackServer)
        
        //4. Add validation to form
        validateAddUser($form);
     
    }

    var createBtnForm = function($form, callbackReturn, callbackSaveParams,callbackSave){
        var element = '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-white box-shadow background-color-red margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';
        element = element + '</div>';

        $form.append(element);

        //trigger btn events
        $(document).on('click', '#return', callbackReturn);
        $(document).on('click', '#save', callbackSaveParams ,callbackSave);
    }

    var validateAddUser = function(form){
        
        $.validator.addMethod('password_regex', function(value, element, regex){
            return regex.test(value)
        }, "La password deve contenere almeno: una lettera minuscola, una lettera maiuscola e un carattere speciale");

        return form.validate({
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

    }

    var createOverlay = function(){
        var overlay = '';
        var overlay = '<div id="overlay"><span id="close" class="btn close"></span></div>';
        
        //append overlay to DOM
        $('body').append(overlay);

        //trigger close click
        $(document).on('click', '#close', removeOverlay);

        //return selector for append element to overlay
        var $selector = $('#close');

        return $selector;

    }

    var removeOverlay = function(){
        $('div#overlay').remove();
    }

    var toogle = function(event){
        if($(event.data.element).hasClass(event.data.displayClass)){
            $(event.data.element).removeClass(event.data.displayClass)
        } else {
            $(event.data.element).addClass(event.data.displayClass)
        }
    }

    return{
        toogleClass: toogle,
        addUserForm: addUserForm,
        callbackServer: callbackServer,
    }

})();

var appUI = (function(){
    var DOMElement = {
        Menu: {
            btnHamburger: '.btn-hamburger',
            sidebar: '#sidebar',
            displaySidebar: 'active'
        },
        Content: {
            btnAdd: '.btn.add',
            btnClose: 'span#close',
            sectionId: 'div.content',
            formAddHTML: '<form id="add" class="box-shadow border-radius-small text-center background-color-white" autocomplete="off"></form>',
            formAddId: 'form#add',
            formData: {
                addUser: {
                    email: '<input name="email" class="name" placeholder="Email" autocomplete="off" required />',
                    password: '<input name="password" type="password" id="password" class="password" placeholder="Prassword" autocomplete="off" required />',
                    confirmPassword: '<input name="confirmPassword"  type="password" class="confirmPassword" placeholder="Conferma Prassword" autocomplete="off" required  />',
                    isActive: '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch"><label for="IsActive" data-off="non attivo" data-on="attivo"></label>'
                }
            },
            listContainer: 'div.content > ul',
        }

    }

    return {
        DOM: DOMElement,

    }

})();

var app = (function(UICtrl, appCtrl){
    var DOMElement = UICtrl.DOM;

    var init = function(){
        console.log('App init');

        //Sidebar menu
        $(document).on('click', DOMElement.Menu.btnHamburger, {element: DOMElement.Menu.sidebar, displayClass: DOMElement.Menu.displaySidebar}, appCtrl.toogleClass);

        //Display list 
        $(window).on( 'load', { post: false, url: 'User/GetAllUsers', listContainer: DOMElement.Content.listContainer, updateList: true }, appCtrl.callbackServer);

        //Add element to list
        $(document).on('click', DOMElement.Content.btnAdd, { formAddId: DOMElement.Content.formAddId, sectionId: DOMElement.Content.sectionId, formAddHTML: DOMElement.Content.formAddHTML, formData: DOMElement.Content.formData }, appCtrl.addUserForm);
        
    }
    


    return {
        init: init
    }

})(appUI, appController)