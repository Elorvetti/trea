"use strict";

var podcastController = (function(){
    /* FILTER */
    var createFilterForm = function(){
        var $overlay = app.createOverlay();

        var element = '';
        element = element + '<form class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        if($('input#name').length > 0){
            element = element + '<input name="name" class="name" id="name" placeholder="Nome" autocomplete="off" value="' + $('input#name').val() + '"/>';
        } else {
            element = element + '<input name="name" class="name" id="name" placeholder="Nome" autocomplete="off" />';
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

        var name = $('input#name').val();
            
        var element = '';
        element = element + '<form class="display-filter">';
        if(name !== ''){
            element = element + '<span class="close-filter border-radius-medium box-shadow margin-bottom-xsmall margin-right-xsmall padding-xsmall background-color-white">';
            element = element + '<input type="text" id="name" name="name" class="color-black" value="' + name + '" />';
            element = element + '</span>'
        }
        element = element + '</form>';

        $('div#sidebar').after(element);

        filterPodcast();
    }

    var filterPodcast = function(){
        var param = '?' + $('form').serialize() + '&pageSize=15&pageNumber=1';
        event.data = new app.Data(false, null, param, '/backoffice/Podcast/Find', true, $('div.content > ul.list'));

        app.callback(event, createPodcastList);
        $('div#overlay').remove();
    };

    var removeFilter = function(){
        $(this).remove();

        var param = '?' + $('form').serialize() + '&pageSize=15&pageNumber=1';
        event.data = new app.Data(false, null, param, '/backoffice/Podcast/Find', true, $('div.content > ul.list'));

        if($('form.display-filter > *').length == 0){
            $('form.display-filter').remove();
        }

        app.callback(event, createPodcastList)
    };    

    /* GET ALL */
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=20&pageNumber=1', 'Podcast/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createPodcastList);
    };

    var createPodcastList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';

        for(var i in obj.podcastList){
            var name = obj.podcastList[i].name.replace(/\.[^/.]+$/, "");

            element = element + '<li class="list box-shadow border-radius-medium" id="' + obj.podcastList[i].id +'">';
            element = element + '<span class="btn btn-circle edit background-color-blue-light box-shadow" tooltip="Modifica"></span>';
            element = element + '<span class="btn btn-circle crop background-color-white box-shadow" tooltip="Ascolta"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red box-shadow" tooltip="Elimina"></span>';
            element = element + '<audio class="border-radius-small"><source src="' + obj.podcastList[i].path + '"></audio>' ;
            element = element + '<p>' + name + '</p>';
            element = element + '</li>';
        }
        
        return element;
    };

    /* ADD NEW */
    var createNewPodcastForm = function(){
        var $overlay = app.createOverlay();

        var element = '';
        
        element = element + '<form enctype="multipart/form-data" class="box-shadow border-radius-small text-center background-color-white add" autocomplete="off">';
        element = element + '<label id="files"></label>';
        element = element + '<input type="file" name="podcasts" class="name" id="podcasts" placeholder="Upload podcast" multiple>';
        element = element + '<label for="podcasts" class="btn upload text-center box-shadow border-radius-small background-color-pink-light color-white">Aggiungi podcast</label>';
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="save" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Salva">';   
        element = element + '</div>';
        
        element = element + '</form>';

        $overlay.after(element);

    };
    
    var addNewPodcast = function(event){
        event.preventDefault();
        var files = $('input#podcasts').prop('files');
        var regex = RegExp('\.(mp3|mpeg|ogg|wav)$');
        var arrayFileOk = new Array;

        //push into array if file is ok
        for(var file in files){
            if(file !== 'length' && file !== 'item'){
                
                //check exist && size && format
                arrayFileOk.push(files[file] && files[file].size < 300 * 1048576 && regex.test(files[file].name)); 
            };
        };

        //check into array there are error else post podcast on sever
        var error = arrayFileOk.filter(function(element){
            return element === false;
        });

        if(error.length === 0){
            event.data = new UploadData('input#podcasts', null, 'Podcast/Index');
            app.callbackUpload(event, updatePodcastList); 
        } else {
            if($('form.add > span').length === 0){
                var errorMessage = '<span class="field-validation-error">Dimensioni o formato file non valida</span>';
                $('form').prepend(errorMessage);
            };
        };
    };

    var changeInputText = function(event){
        var files = $(this).prop('files');  
        
        var filename = $(this).val();
        if(files.length === 1){
            filename = filename.replace('C:\\fakepath\\', '');
        } else{
            filename = files.length + ' files';
        };
        
        $('label#files').text(filename);
    };

    /* EDIT */
    var editPodcast = function(event){
        //Create overalay
        var $overlay = app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));
        var list = event.data.podcastList;

        event.data = new app.Data(false, id, null, 'Podcast/GetById/', false, $overlay);

        app.callback(event, CreateEditList);
    };

    var CreateEditList = function(obj){
        var name = obj.name.replace(/\.[^/.]+$/, "");

        var element = '';
        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ name +'" required>';
        element = element + '<textarea type="text" name="description" class="name" id="description" autocomplete="off">' + obj.description + '</textarea>';
        element = element + '<audio class="border-radius-small"><source src="' + obj.path + '"></audio>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        element = element + '</form>';
        
        return element;
    };

    var updatePodcast = function(event){
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, 'Podcast/Update/', false, null);
        app.callback(event, updatePodcastList);
    };

    var updatePodcastList = function(event){
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
            feedback = app.feedbackEvent(true, 'Podcast aggiornato');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nell\'aggiornamento della categoria, provare a ricicare la pagina');
        }; 
        $overlay.after(feedback);
    };

    /* DELETE */
    var deletePodcast = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, null, 'Podcast/Delete/', false, null);
        app.callback(event, updatePodcastList);
    };

    var createRemovePodcast = function(event){
        var id = $(this).parent().attr('id');
        var podcastName = $(this).next().next().text();

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete"><p class="text-center confirm">Sei sicuro di voler eliminare il podcast: ' + podcastName + '?</p>';
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    }; 

    /* CROP PODCAST */
    var cropPodcast = function(event){
        var id = parseInt($(event.target).parent().attr('id'));
        event.data = new app.Data(false, id, null, 'Podcast/GetById/', false, null);
        app.callback(event, CreateCrop);
    };

    var CreateCrop = function(obj){

        var $overlay = app.createOverlay();

        var name = obj.name.replace(/\.[^/.]+$/, "");

        var element = '';
        element = element + '<div class="box-shadow border-radius-small text-center background-color-white">';
        element = element + '<p class="text-center">' + name + '</p>';
        element = element + '<audio class="border-radius-small" controls><source src="' + obj.path + '"></audio>' ;
        element = element + '</div>';

        $overlay.after(element);

    };
    
    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $(event.target).parent().find('span.btn.paginator.active').removeClass('active');
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        
        event.data = new app.Data(false, null, href, 'Podcasr/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createPodcastList);
    }

    //Constructor
    var UploadData = function(input, id, url){
        this.input = input;
        this.id = id;
        if(id === null || id === undefined){
            this.url = url;
        } else {
            this.url = url + this.id;
        };
    };

    return {
        createFilterForm: createFilterForm,
        displayFilter: displayFilter,
        removeFilter: removeFilter,
        createNewPodcastForm: createNewPodcastForm,
        createRemovePodcast: createRemovePodcast,
        cropPodcast: cropPodcast,
        addNewPodcast: addNewPodcast,
        getAll: getAll,
        editPodcast: editPodcast,
        updatePodcast: updatePodcast,
        deletePodcast: deletePodcast,
        changeInputText: changeInputText,
        changePage: changePage
    };
})();

var podcastUI = (function(){

    var DOM = {
        btnFilter: '.btn#filter',
        btnFind: '.btn#find',
        btnRemoveFilter: 'form.display-filter > span.close-filter',
        btnAdd: '.btn#add',
        btnAddPodcast: '.btn#save',
        btnEdit: '.btn.edit',
        btnCrop: '.btn.crop',
        btnRemove: '.btn.remove',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        formFiles: 'input#podcasts',
        btnChangePage: 'span.btn.paginator'
    };

    return {
        DOMElement: DOM
    };
    
})();

var podcast = (function(podcastCtrl, podcastUI){
    var DOMElement = podcastUI.DOMElement;

    var init = function(){
        console.log('podcast init');

        //On document load create element list
        podcastCtrl.getAll();
        $(DOMElement.btnAdd).attr('tooltip', 'Aggiungi Podcast');

        //Add event handler on button
        $(document).on('click', DOMElement.btnFilter, podcastCtrl.createFilterForm);
        $(document).on('click', DOMElement.btnFind, podcastCtrl.displayFilter);
        $(document).on('click', DOMElement.btnRemoveFilter, podcastCtrl.removeFilter);

        $(document).on('click', DOMElement.btnAdd, podcastCtrl.createNewPodcastForm);
        $(document).on('click', DOMElement.btnAddPodcast, podcastCtrl.addNewPodcast);

        //if upload a multiple file change name to input with a number of element
        $(document).on('change', DOMElement.formFiles, podcastController.changeInputText);

        $(document).on('click', DOMElement.btnEdit, { podcastList: DOMElement.list }, podcastCtrl.editPodcast);
        $(document).on('click', DOMElement.btnCrop , podcastCtrl.cropPodcast);
        $(document).on('click', DOMElement.btnRemove , podcastCtrl.createRemovePodcast);
        
        $(document).on('click', DOMElement.btnUpdate, podcastCtrl.updatePodcast);
        $(document).on('click', DOMElement.btnDelete, podcastCtrl.deletePodcast);

        //Change page 
        $(document).on('click', DOMElement.btnChangePage, podcastCtrl.changePage);
    };

    return {
        init: init
    };

})(podcastController, podcastUI);