"use strict";

var categoryController = (function(){

    var createCategoryList = function(obj, i){
        var element = '';

        element = element + '<li class="list" id="' + obj[i].id +'">';
        element = element + '<p displayOrder="' + obj[i].diplayOrder + '">' + obj[i].name + '</p>';
        element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
        element = element + '<span class="btn btn-circle remove background-color-red"></span>';
        element = element + '</li>';
        
        return element;
    }
    
    var CreateEditList = function(obj){
        var element = '';

        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.name +'" required>';
        element = element + '<input type="number" name="order" class="order" id="order"  autocomplete="off" value="'+ obj.displayOrder +'"  required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        return element;
    }

    var createRemoveCategory = function(event){
        var id = $(this).parent().attr('id');
        var categoryName = $(this).prev().prev().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare la categoria: ' + categoryName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    }

    var createNewCategoryForm = function(){
        
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        element = element + '<input tupe="text" name="name" class="name" id="name" placeholder="Nome" autocomplete="off" required>';
        element = element + '<input type="number" name="order" class="order" id="order" placeholder="Ordinamento" autocomplete="off" required>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>'

        $overlay.after(element);

        validateNewCategory();
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
            });
    }

    var addNewCategory = function(event){
        
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
            event.data = new app.Data(true, null, '/Category/Index', false, null);
            app.callback(event, updateCategoryList);
        }
        
    }

    var updateCategoryList = function(event){
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
            feedback = app.feedbackEvent(true, 'Categoria aggiornata');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della categoria, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    }

    var editCategory = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.categoryList;

        event.data = new app.Data(false, id, 'Category/GetById/', false, list);

        app.callback(event, CreateEditList);
    }

    var updateCategory = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, 'Category/Update/', false, null);
        app.callback(event, updateCategoryList);
    }

    var deleteCategory = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, 'Category/Delete/', false, null);
        app.callback(event, updateCategoryList);
    }

    var getAll = function(event){
        event.data = new app.Data(false, null, 'Category/GetAll', true, $('div.content > ul.list'));

        app.callback(event, createCategoryList);
    }

    return {
        createNewCategoryForm: createNewCategoryForm,
        createRemoveCategory: createRemoveCategory,
        addNewCategory: addNewCategory,
        getAll: getAll,
        editCategory: editCategory,
        updateCategory: updateCategory,
        deleteCategory: deleteCategory

    }
})();

var categoryUI = (function(){


    var DOM = {
        btnAdd: '.btn#add',
        btnAddCategory: '.btn#save',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
    }


    return {
        DOMElement: DOM
    }
    
})();

var category = (function(categoryCtrl, categoryUI){
    var DOMElement = categoryUI.DOMElement;


    var init = function(){
        console.log('category init');

        //On document load create element list
        $(window).on('load', categoryCtrl.getAll);

        //Add event handler on button
        $(document).on('click', DOMElement.btnAdd, categoryCtrl.createNewCategoryForm);
        $(document).on('click', DOMElement.btnAddCategory, categoryCtrl.addNewCategory);
      
        $(document).on('click', DOMElement.btnEdit, { categoryList: DOMElement.list }, categoryCtrl.editCategory);
        $(document).on('click', DOMElement.btnRemove , categoryCtrl.createRemoveCategory);
        
        $(document).on('click', DOMElement.btnUpdate, categoryCtrl.updateCategory);
        $(document).on('click', DOMElement.btnDelete, categoryCtrl.deleteCategory);
    }

    return {
        init: init
    }

})(categoryController, categoryUI)