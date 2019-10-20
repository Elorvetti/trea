"use strict"

var appController = (function(){

    var toogle = function(event){
        if($(event.data.element).hasClass(event.data.displayClass)){
            $(event.data.element).removeClass(event.data.displayClass)
        } else {
            $(event.data.element).addClass(event.data.displayClass)
        }
    }

    var addElement = function(event){
        
        //1. Get section id and form add element
        var sectionId = $(event.data.container).attr('id');
        var data = event.data.addElementObj;
        
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
        $(document).on('click', 'span#close', removeElement );
        $(document).on('click', 'input#save', saveElement);
    }

    var removeElement = function(){
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
                    $('div#overlay').remove();

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

    //var appendElementToDOM = function(event){
    //    var formID = $(event.data.form).attr('id');

    //    $(event.data.fatherOfAppend).append(event.data.elementToAppend);
    //    $(event.data.fatherOfAppend + ' li').addClass(formID);
    //}

    var removeElementToDOM = function(event){
        console.log(event)
    }



    return{
        toogleClass: toogle,
        addElement: addElement,
        
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
            btnRemove: '.btn.remove',
            btnClose: 'span#close',
            box: 'div.content',
            addContainerHTML: '<div id="overlay"><span id="close"></span><form id="add" class="box-shadow border-radius-small text-center background-color-white" autocomplete="off"></form></div>',
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
            //formList: 'form.list',
            //fatherOfAppend: 'form > ul',
            //elementToAppend: '<li><input type="text"><span class="btn btn-circle remove background-color-red"></span></li>', 
            
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

        $(document).on('click', DOMElement.Menu.btnHamburger, {element: DOMElement.Menu.sidebar, displayClass: DOMElement.Menu.displaySidebar}, appCtrl.toogleClass)
      
        //Add element on app
        $(document).on('click', DOMElement.Content.btnAdd, { formAdd: DOMElement.Content.addFormSelector, container: DOMElement.Content.box, addContainer: DOMElement.Content.addContainerHTML, addElementObj: DOMElement.Content.elementToAppendAdd, btnSave: DOMElement.Content.btnSaveHTML }, appCtrl.addElement)
        
    }
    


    return {
        init: init
    }

})(appUI, appController)