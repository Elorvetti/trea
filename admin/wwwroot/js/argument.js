"use strict";

var argumentController = (function(){
    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=50&pageNumber=1', 'Argument/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createArgumentList);
    };

    var createArgumentList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';

        for(var i in obj.arguments){
            element = element + '<li class="list" id="' + obj.arguments[i].id +'">';
            element = element + '<p>' +  obj.arguments[i].name + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red"></span>';
            element = element + '<span class="btn btn-circle info background-color-white box-shadow"></span>';
            element = element + '</li>';
        }
        
        return element;
    };

    /* ADD NEW */
    var createNewArgumentForm = function(obj){
        var $overlay = app.createOverlay();

        var element = '';

        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">'

        element = element + '<select name="idCategory">';
        for(var i in obj.categories){
            element = element + '<option value="' + obj.categories[i].id + '">' + obj.categories[i].name + '</option>';
        }        
        element = element + '</select>';

        element = element + '<input type="text" name="name" class="name" id="name" placeholder="Nome" autocomplete="off" required>';
        element = element + '<textarea name="description" class="name" id="description" placeholder="Descrizione" autocomplete="off"></textarea>';
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

    /* EDIT */
    var editArgument = function(event){
        $overlay =app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));

        event.data = new app.Data(false, id, null, 'Argument/GetById/', false, $overlay);
        app.callback(event, CreateEditList);
    };

    var CreateEditList = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        element = element + '<select name="idCategory">';
        
        for(var i in obj.categories){
            if(obj.categories[i].id ===  obj.categoryId){
                element = element + '<option value="' + obj.categories[i].id + '" selected>' + obj.categories[i].name + '</option>'; 
            } else {
                element = element + '<option value="' + obj.categories[i].id + '">' + obj.categories[i].name + '</option>'; 
            }
        }

        element = element + '</select>';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.name +'" required>';
        element = element + '<textarea name="description" class="name" id="name" autocomplete="off" placeholder="Descrizione" row="4">'+ obj.description + '</textarea>';
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        element = element + '</form>'

        return element;
    };

    var updateArgument = function(event){
        event.preventDefault();
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, 'Argument/Update/', false, null);

        app.callback(event, updateArgumentList);
    };

    var updateArgumentList = function(event){
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

    /* DELETE */
    var deleteArgument = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, null, 'Argument/Delete/', false, null);
        app.callback(event, updateArgumentList);
    };
    
    var createRemoveArgument = function(event){
        var id = $(this).parent().attr('id');
        var argumentName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare la categoria: ' + argumentName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    };

    /* GET ARGUMENT */
    var getAllArgument = function(event){
        event.data = new app.Data(false, null, '?pageSize=200&pageNumber=1', '/Category/GetAll', false, null);
        app.callback(event, createNewArgumentForm);
    };

    /* GET AND DISPLAY ARGUMENT FOR CATEGORY */
    var createFatherInfo = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        var url = 'Argument/GetById/' + id;
        var self = $(this);

        fetch(url,{method: 'POST'})
        .then(function(res){
            res.json()
                .then(function(data){
                    var element = ''
                    element = element + '<section id="argument-path" class="box-shadow border-radius-small text-center color-white">' + data.category.name + '<section>';
                    self.after(element);
                })
        });
    }
    
    var closeFatherInfo = function(){
        if($('section#argument-path').length > 0){
            $('section#argument-path').remove();
        }
    }

    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $('span.btn.paginator').each(function(){
          $(this).removeClass('active');
        });
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        
        event.data = new app.Data(false, null, href, 'Argument/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createArgumentList);

    }

    return {
        createRemoveArgument: createRemoveArgument,
        getAllArgument: getAllArgument,
        addNewArgument: addNewArgument,
        getAll: getAll,
        editArgument: editArgument,
        updateArgument: updateArgument,
        deleteArgument: deleteArgument,
        createFatherInfo: createFatherInfo,
        closeFatherInfo: closeFatherInfo,
        changePage: changePage
    };

})();

var argumentUI = (function(){

    var DOM = {
        btnAdd: '.btn#add',
        btnAddArgument: '.btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
        btnInfo: '.btn.info',
        btnChangePage: 'span.btn.paginator'
    }

    return {
        DOMElement: DOM
    };

})();

var argument = (function(argumentCtrl, argumentUI){
    var DOMElement = argumentUI.DOMElement;
    
    var init = function(){
        console.log('argument init');
        
        //On document load create element list
        argumentCtrl.getAll();

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, argumentCtrl.getAllArgument);
        $(document).on('click', DOMElement.btnAddArgument, argumentCtrl.addNewArgument);

        $(document).on('click', DOMElement.btnEdit, { argumentList: DOMElement.list }, argumentCtrl.editArgument);
        $(document).on('click', DOMElement.btnRemove , argumentCtrl.createRemoveArgument);
        
        $(document).on('click', DOMElement.btnInfo, argumentCtrl.createFatherInfo);
        $(document).on('click', DOMElement.btnUpdate, argumentCtrl.updateArgument);
        $(document).on('click', DOMElement.btnDelete, argumentCtrl.deleteArgument);
        
        $(document).on('click', argumentCtrl.closeFatherInfo);

        //Change page 
        $(document).on('click', DOMElement.btnChangePage, argumentCtrl.changePage);
    };

    return {
        init: init
    };

})(argumentController, argumentUI);