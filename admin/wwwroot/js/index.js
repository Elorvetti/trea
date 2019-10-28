"use strict"

var appController = (function(){

    //Argument Manage
    var addArgumentWindow = function(form, elementToAppend){
        form.append(elementToAppend.path);

        createBtnForm(form);
    }

    var addFolderChild = function(){
        var idFolderFather = $(this).parent().attr('id');
        
        event.data = new Data(false, idFolderFather, 'Argument/GetById/', false, null);
        callbackServer(event);
    }

    //User Manage
    var addUserWindow = function(form, elementToAppend){
        //1. Append element to form
        
        //1.1 Append element to set      
        form.append(elementToAppend.email);
        form.append(elementToAppend.password);
        form.append(elementToAppend.confirmPassword);
        form.append(elementToAppend.isActive);

        //2.2 append btn 
        createBtnForm(form);

        //3. Add validation to form
        validateAddUser(form, true);
    }

    var validateAddUser = function(form, pswRequired){

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
                        required: pswRequired,
                        minlength: 8,
                        password_regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

                    }, 
                    confirmPassword: {
                        required: pswRequired,
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

    //General Manage
    var updateList = function(event){
        
        //remove element to DOM
        $('#overlay').remove();
        $('ul.list li').remove();

        if($('#overlay').length === 0){
           var $overlay = createOverlay();
        }
        
        //Get area for update 
        var areaId = $('div.content').attr('id');

        var params = {
            addUser: {
                url: '/User/GetAll/',
                message: 'Utente aggiornato'
            },
            addArgument: {
                url: '/Argument/GetAll/',
                message: 'Argomento aggiornato'
            }
        }

        event.data  = new Data(false, null, params[areaId].url, true, $('div.content > ul.list') );

        if($('ul.list li').length === 0){
            callbackServer(event)
            var feedback = '';

            //2.1.3 remove overlay
            feedback = feedbackEvent(true, params[areaId].message);
        } else {
            feedback = feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento utenti, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    }
    
    var removeElementConfirm = function(event){
        var id = $(this).parent().attr('id');
        var area = event.data.area;
        var element = '';
        

        if(area === "user"){
            var userName = $(this).prev().prev().text();
            element = '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare l\'utente: ' + userName + '?</p></div>';
        } else {
            var folderName = $(this).prev().prev().prev().text();
            element = '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare l\'argomento: ' + folderName + '?</p></div>';
        }

        var $overlay = createOverlay();
        $overlay.after(element);
        var $selectorToAppendBtn = $('#overlay > div');
        createBtnForm($selectorToAppendBtn)
        
    }

    var createEdit = function(obj, type, add){
        var element = ""
        if(type === "user"){
            element = '<input name="email" class="name" autocomplete="off" value="' + obj.user + '" disabled />';
            if(obj.isActive === true){
                element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch" checked>';
            } else {
                element =  element + '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch">';
            }
            element = element + '<label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
        } else if(!add){
            var folderName = obj.name.replace(/\-/g, ' ')
            element =  '<input name="path" class="path" automplete="off" value="' + folderName + '" />'
        } else {
            element = '<input name="id" type="hidden" value="' + obj.id + '">';
            element = element + '<input name="idFather" type="hidden" value="' + obj.idFather + '">';
            element = element + '<input name="level" type="hidden" value="' + obj.level + '">';
            element = element + '<input name="name" type="text" value="">';
        }

        return element;      
    }

    var editElement = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        var url = event.data.url;

        event.data = new Data(false, id, url, false, 'div.content > ul')

        callbackServer(event);
    }

    var createList = function(obj, i, type){
        var element = '<li class="list" id="' + obj[i].id +'">'
        if(type === "user"){
            element = element + '<p active="' + obj[i].isActive + '">' + obj[i].user + '</p>';
        } else {
            var folderName = obj[i].name.replace(/\-/g, ' ')

            element = element + '<p father="' + obj[i].idFather + '" level="' + obj[i].level + '">' + folderName + '</p>';
            element = element + '<span class="btn btn-circle add background-color-blue"></span>'
        }
        
        element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
        element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        element = element + '</li>';

        return element;
    }

    var feedbackEvent = function(success, message){
        var element;
        
        if(success){
            element = '<span class="box-shadow border-radius-small success text-center color-white">';    
        } else {
            element = '<span class="box-shadow border-radius-small error text-center color-white">';    
        }
        element = element + message;
        element = element + '</span>';

        return element;
        
    }

    var callbackServer = function(event){
        var parameter = {
            post : event.data.post,
            url: event.data.url,
        }
        
        if(event.data.post){
            event.preventDefault();

            //1. Get form from DOM
            var $form = $('form');
            var id = $form.attr('id');
            var sendblock = false;

            //2. check if we need form validate 
            if(id === 'add'){
                //2.1 check if value is valide (used only for user)
                var state = validateAddUser($form, true);
                var invalid = state.invalid.email === true || state.invalid.password === true || state.invalid.confirmPassword === true

                //2.2 check if are inputs required empty || invalid input 
                $('form :input').each(function(){
                    var required = $(this).attr('required') !== undefined;

                    if(invalid || $(this).val() === "" && required ){
                        sendblock = true
                    }
                })

                //2.3 block send data
                if(sendblock){
                    if($('form.add > span').length === 0){
                        var errorMessage = '<span class="field-validation-error"> Dati non corretti</span>';
                        $form.prepend(errorMessage);
                    }
                    return
                }
            }

            //3. Serialize data
            var data = $form.serialize();

            //2.1.1 Pass JSON To server
            $.ajax({
                method: 'POST',
                data: data,
                url: parameter.url,
                success: function (result) {    
                    if(result === "Error"){
                        feedbackEvent(false, 'Dati non validi');
                        return;
                    }
                    updateList(event)
                }
            })
        } else {
            fetch(parameter.url,{method: 'POST'})
                .then(function(res){
                    return res.json()
                        .then(function(data){
                            var type = $(event.data.listContainer).attr('id'); //if create list is for user or argument i need different struct
                            if(event.data.updateList){
                                for(var i in data){
                                    var element = createList(data, i, type);
                                    $(event.data.listContainer).append(element);
                                }
                            } else {
                                var add = $(event.target).hasClass('add');
                                var $overlay = createOverlay();
                                var element = createEdit(data, type, add);
                                addEditForm($overlay, data, element);
                            }
                        })
                })
        }
    }

    var addEditForm = function($overlay, data, element){
        var form = '<form id="' + data.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off"></form>';

        //append form
        $overlay.after(form);
        
        //get form selector and append data
        var $form = $('#overlay > form');
        $form.append(element);

        //add btn 
        createBtnForm($form);

        //append validation
        validateAddUser($form, false);
    }

    var createBtnForm = function($form){

        var element = '<div class="text-right">';
       
        if(!$form.hasClass('delete')){
            element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
            element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';    
        }  else {
            element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
            element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        }
        
        element = element + '</div>';

        $form.append(element);
    }

    var bindClick = function(event){
        var areaId = $(event.data.areaId).attr('id');
        var $overlayChild = $(event.data.overlayChild);
        var type = $overlayChild.attr('class'). replace('box-shadow border-radius-small text-center background-color-white ', '');
        var urls = {
            user: {
                add: '/User/Index',
                edit: '/User/Update/',
                delete: '/User/Delete/'
            },
            argument: {
                add: '/Argument/Index',
                edit: '/Argument/Update/',
                delete: '/Argument/Delete/'
            }
        }
        
        var url = urls[areaId][type];

        var id = $(this).parent().parent().attr('id');
        event.data = new Data(true, id, url, false, null)
        callbackServer(event);
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

    var createAddWindow = function(event){
        
        //1. Get area id and form add element
        var areaId = $(event.data.areaId).attr('id');
        var elementToAppend = event.data.formData[areaId];
        
        //2. Create overlay
        var $overlay = createOverlay();
        $overlay.after(event.data.formAddHTML);
        
        //1.1 Get form added by id
        var $form = $(event.data.formAdd);

        switch(areaId){
            case "addUser":
                addUserWindow($form, elementToAppend);
                break;
            case "addArgument":
                addArgumentWindow($form, elementToAppend)
                break;
        }
    }

    var toggleSubMenu = function(event){
        var sublist = event.data.sublist;
        var areaId = $(event.data.listContainer).attr('id')
        
        //if sublist have same id of area add class active else remove it
        for(var menu in sublist){
            var menuId = $(sublist[menu]).attr('id')
            if(menuId === areaId){
                $(sublist[menu]).addClass('active');
            } else{ 
                $(sublist[menu]).removeClass('active');
            }
            
        }
    }

    var updateHomeList = function(event){
        var areaId = $(event.data.listContainer).attr('id');
        
        if(areaId === undefined){
            return
        }
        
        var selectorToAppend = event.data.listContainer +'#'+ areaId;

        var url = {
            update: {
                user: 'User/GetAll',
                argument: 'Argument/GetAll',
                post: 'Post/GetAll',
                photo: 'Photo/GetAll',
                video: 'Video/GetAll'
            },
            edit: {
                user: 'User/GetById/',
                argument: 'Argument/GetById/',
                post: 'Post/GetById/',
                photo: 'Photo/GetById/',
                video: 'Video/GetById/'
            }            
        }

        event.data = new Data(false, null, url.update[areaId], true, selectorToAppend)

        callbackServer(event);

        //Add event lister on btn edit and remove
        $(document).on('click', 'li .btn.add', addFolderChild)
        $(document).on('click', '.btn.edit' , { url: url.edit[areaId] } ,editElement);
        $(document).on('click', '.btn.remove' , { area: areaId }  ,removeElementConfirm);
    }

    //Constructor
    var Data = function(post, id, url, updateList, listContainer){
        this.post = post;
        this.id = id;
        if(id !== null && id !== undefined){
            this.url = url + this.id;
        } else {
            this.url = url;
        }
        this.updateList = updateList;
        this.listContainer = listContainer;

    }

    return{
        toggleSubMenu: toggleSubMenu,
        toogleClass: toogle,
        createAddWindow: createAddWindow,
        updateHomeList: updateHomeList,
        removeOverlay: removeOverlay,
        bindClick: bindClick
    }

})();

var appUI = (function(){
    var DOMElement = {
        Menu: {
            btnHamburger: '.btn-hamburger',
            sidebar: '#sidebar',
            displaySidebar: 'active',
            submenuContainer: 'ul.control-list li',
            sublist: {
                user: 'li#user',
                arguments: 'li#argument',
                post: 'li#post',
                photo: 'li#photo',
                video: 'li#video'
            }
        },
        Content: {
            btnAdd: '.btn#add',
            btnClose: 'span#close',
            btnSave: '.btn.save',
            btnReturn: '.btn.return',
            areaId: 'div.content',
            formAddHTML: '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off"></form>',
            formAdd: 'form.add',
            formData: {
                addUser: {
                    email: '<input name="email" class="name" id="email" placeholder="Email" autocomplete="off" required />',
                    password: '<input name="password" type="password" id="password" class="password" placeholder="Prassword" autocomplete="off" required />',
                    confirmPassword: '<input name="confirmPassword"  type="password" class="confirmPassword" id="confirmPassword" placeholder="Conferma Prassword" autocomplete="off" required />',
                    isActive: '<input name="active" id="IsActive" type="checkbox" class="is-active btn-switch"><label for="IsActive" data-off="non attivo" data-on="attivo"></label>'
                },
                addArgument: {
                    path: '<input name="path" class="name" id="path" placeholder="Nome" autocomplete="off" required />'
                }
            },
            listContainer: 'div.content > ul',
            overlayChild: 'div#overlay > span + *'
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

        //Toggle class Active to sublist menu
        $(window).on('load', { listContainer: DOMElement.Content.listContainer, sublist: DOMElement.Menu.sublist }, appCtrl.toggleSubMenu);

        //Display list 
        $(window).on('load', { listContainer: DOMElement.Content.listContainer }, appCtrl.updateHomeList);

        //Add event listerner to btn
        $(document).on('click', DOMElement.Content.btnAdd, { formAdd: DOMElement.Content.formAdd, areaId: DOMElement.Content.areaId, formAddHTML: DOMElement.Content.formAddHTML, formData: DOMElement.Content.formData }, appCtrl.createAddWindow);
        $(document).on('click', DOMElement.Content.btnReturn, appCtrl.removeOverlay);
        $(document).on('click', DOMElement.Content.btnSave, { areaId: DOMElement.Content.listContainer, overlayChild: DOMElement.Content.overlayChild },  appCtrl.bindClick);

    }

    return {
        init: init
    }

})(appUI, appController)