"use strict"

var appController = (function(){

    var toogle = function(event){
        if($(event.data.element).hasClass(event.data.displayClass)){
            $(event.data.element).removeClass(event.data.displayClass)
        } else {
            $(event.data.element).addClass(event.data.displayClass)
        }
    }

    var UpdateListUser = function(event){
       var sectionId;

        if(event !== 'user'){
            sectionId = $(event.data.sectionName).attr('id');
        } else {
            sectionId = event
        }

        if(sectionId === "user"){
            fetch('/User/GetAllUsers', { method: 'POST' })
                .then(function(res){ 
                   return res.json()
                    .then(function(data){
                        for(var i in data){
                            var element = createListOfUsers(data, i);
                            $('div.content > ul').append(element)
                        }
                   }) 
                })
        }

        //Add trigger for edit element and remove element
        $(document).on('click', '.btn.edit', function(){
            var id = parseInt($(this).parent().attr('id'));
            createElementForUpdate(id)
        });
        $(document).on('click', '.btn.remove', removeElementToListConfirm)
    }

    var createListOfUsers = function(obj, i){
        var element = '<li class="list" id="' + obj[i].id +'">'
        var element = element + '<p active="' + obj[i].isActive + '">' + obj[i].user + '</p>';
        var element = element + '<span class="btn btn-circle edit background-color-blue"></span>';
        var element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        var element = element + '</li>';

        return element;
    }

    var createElementForUpdate = function(id){
        
        fetch('/User/GetUserById/' + id, { method: 'POST' })
            .then(function(res) { 
                return res.json()
                    .then(function(data){

                        //Create and append overlay
                        var overlayAndForm = '<div id="overlay"><span class="btn close"></span><form id="' + data.id + '" class="box-shadow border-radius-small text-center background-color-white" autocomplete="off"></form></div>';
                        $('body').append(overlayAndForm);
                        
                        //Create and append input
                        var element = createElementOfEdit(data);
                        $('#overlay > form').append(element);
                    })
             })

             $(document).on('click', '.update-psw', createElementForUpdatePsw);
             $(document).on('click', '.btn.close, .btn.return', removeOverlay);
             $(document).on('click', '#update', updateElement);        
    }

    var createElementForUpdatePsw = function(){
        console.log($(this).parent());
    }

    var updateElement = function(){
        var $form = $(this).parent().parent();
        var id = $form.attr('id')
        var data = $form.serialize()

        $.ajax({
            method: 'POST',
            data: data,
            url: '/User/UpdateUser/' + id,
            success: function(){
                $('div#overlay').remove();

                $('ul#user li').remove();
                UpdateListUser('user');

                successDisplay('Utente aggiornato');
            }


        })
    }

    var createElementOfEdit = function(obj){
        var element = '<input name="email" class="name" autocomplete="off" value="'+  obj.user + '" disabled />'
        if(obj.isActive === true){
            element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch" checked>'
        } else {
            element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch">'
        }
        element = element + '<label for="IsActive" data-off="non attivo" data-on="attivo"></label>'
        element = element + '<p class="update-psw text-underline color-blue-light text-right margin-top-small"> aggiorna password </p>'
        element = element + '<div class="text-right">'
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-white box-shadow background-color-red margin-top-small" value="Indietro">'
        element = element + '<input type="button" id="update" class="btn btn-rounded btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">'
        element = element + '</div>';

        return element;
    }

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

    var addElement = function(event){
        
        //1. Get section id and form add element
        var sectionId = $(event.data.container).attr('id');
        var data = event.data.addElementArray;
        
        //2. Add container for add element on section
        $('body').append(event.data.addContainer);
        
        var $form = $(event.data.formAdd)
       
        //2. Append element        
        $form.append(data[sectionId].email);
        $form.append(data[sectionId].password);
        $form.append(data[sectionId].confirmPassword);
        $form.append(data[sectionId].isActive);

        //3. Add save btn to add form
        $form.append(event.data.btnSave);
        
        //4. Validate data
        validateFormUser($form)

        //4. add trigger of btn
        $(document).on('click', 'span#close', removeOverlay );
        $(document).on('click', 'input#save', saveElement);
    }


    var removeOverlay = function(){
        $('div#overlay').remove();
    }

    var saveElement = function(e){
        e.preventDefault();

        //1. Get form object from DOM
        var $form = $(this).parent().parent();

        //2. Check if data is valid
        var state = validateFormUser($form);

        if (state.invalid.email === false && state.invalid.password === false && state.invalid.confirmPassword === false) {
            
            //2.1 Serialize Form data
            var data = $form.serialize();
   
            //2.1.1 Pass JSON To server
            $.ajax({
                method: 'POST',
                data: data,
                success: function(result){
                    
                    //2.1.2 Update list of element
                    $('ul#user li').remove();
                    UpdateListUser('user');

                    //2.1.3 remove overlay
                    $('div#overlay').remove();

                    successDisplay('Utente aggiunto');
                }
            })
        } else if($('form#add > span').length === 0) {

            //2.2 Form data not valid show error message    
            var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
            $form.prepend(errorMessage);
        }

    }

    var validateFormUser = function(form){
        
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

    var successDisplay = function(message){
        var element = '<div id="overlay"><span class="box-shadow border-radius-small success text-center color-white">';
        var element = element + message;
        var element = element + '</span></div>';

        $('body').append(element);
        $(document).on('click', function(){ $('#overlay').remove();})
    }

    return{
        toogleClass: toogle,
        addElement: addElement,
        UpdateListUser: UpdateListUser,
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
            box: 'div.content',
            addContainerHTML: '<div id="overlay"><span id="close" class="btn close"></span><form id="add" class="box-shadow border-radius-small text-center background-color-white" autocomplete="off"></form></div>',
            addFormSelector: 'form#add',
            elementToAppendAdd: {
                addUser: {
                    email: '<input name="email" class="name" placeholder="Email" autocomplete="off" required />',
                    password: '<input name="password" type="password" id="password" class="password" placeholder="Prassword" autocomplete="off" required />',
                    confirmPassword: '<input name="confirmPassword"  type="password" class="confirmPassword" placeholder="Conferma Prassword" autocomplete="off" required  />',
                    isActive: '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch"><label for="IsActive" data-off="non attivo" data-on="attivo"></label>'
                }
            },
            btnSaveHTML: '<div class="text-right"><input type="submit" id="save" class="btn btn-rounded btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva"></div>',
            contentDisplayElement: 'div.content > ul',
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
        $(window).on( 'load', { sectionName: DOMElement.Content.contentDisplayElement }, appCtrl.UpdateListUser);

        //Add element to list
        $(document).on('click', DOMElement.Content.btnAdd, { formAdd: DOMElement.Content.addFormSelector, container: DOMElement.Content.box, addContainer: DOMElement.Content.addContainerHTML, addElementArray: DOMElement.Content.elementToAppendAdd, btnSave: DOMElement.Content.btnSaveHTML }, appCtrl.addElement);
        
    }
    


    return {
        init: init
    }

})(appUI, appController)