var reviewController = (function(){
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
        
        if($('input#IsActive').length > 0){
            element = element + '<input name="acepted" id="IsActive" type="checkbox" class="is-active btn-switch" checked><label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
        } else {
            element = element + '<input name="acepted" id="IsActive" type="checkbox" class="is-active btn-switch"><label for="IsActive" data-off="non attivo" data-on="attivo"></label>';
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
            element = element + '<input type="text" id="IsActive" name="acepted" class="color-black" value="Attivo" />';
            element = element + '</span>'
        }
        element = element + '</form>';

        $('div#sidebar').after(element);

        filterReview();
    }

    var filterReview = function(){
        var param = '?' + $('form').serialize() + '&pageSize=15&pageNumber=1';
        event.data = new app.Data(false, null, param, '/backoffice/Review/Find', true, $('div.content > ul.list'));

        app.callback(event, createReviewList);
        $('div#overlay').remove();
    };

    var removeFilter = function(){
        $(this).remove();

        var param = '?' + $('form').serialize() + '&pageSize=15&pageNumber=1';
        event.data = new app.Data(false, null, param, '/backoffice/Review/Find', true, $('div.content > ul.list'));

        if($('form.display-filter > *').length == 0){
            $('form.display-filter').remove();
        }

        return app.callback(event, createReviewList);
    };
    
    //Get all review
    var getAll = function(){
        var event = {};
        event.data = new app.Data(false, null, '?pageSize=16&pageNumber=1', 'Review/GetAll', true, $('div.content > ul.list'))
        app.callback(event, createReviewList)
    }

    var createReviewList = function(obj){
        $('div.content > ul.list > li').remove();
        var element = '';
        for(var i in obj.displayReviews){
            element = element + '<li class="list" id="' + obj.displayReviews[i].id +'">';
            element = element + '<p public="' + obj.displayReviews[i].acepted + '">' +  obj.displayReviews[i].email + '</p>';
            element = element + '<p>' +  obj.displayReviews[i].postTitle + '</p>';
            element = element + '<span class="btn btn-circle edit background-color-blue-light"></span>';
            element = element + '<span class="btn btn-circle remove background-color-red"></span>';
            element = element + '</li>';
        }
         
        return element;
    }

    /* EDIT */
    var editReview = function(event){
        var $overlay = app.createOverlay();

        var id = parseInt($(event.target).parent().attr('id'));

        event.data = new app.Data(false, id, null, 'Review/GetById/', false, $overlay);

        app.callback(event, CreateEditReview);
    }

    var CreateEditReview = function(obj){
        var element = '';
        element = element + '<form id="' + obj.id + '" class="box-shadow border-radius-small text-center background-color-white edit" autocomplete="off">';
        element = element + '<input type="text" name="name" class="name" id="name" autocomplete="off" value="'+ obj.postTitle +'" disabled>';
        element = element + '<input type="text" name="email" class="name" id="email" autocomplete="off" value="'+ obj.email +'" disabled>';
        element = element + '<input type="text" name="title" class="name" id="title" autocomplete="off" value="'+ obj.titolo +'" disabled>';
        element = element + '<textarea name="review" class="name" id="review" autocomplete="off" disabled>'+ obj.testo + '</textarea>';
        if(obj.acepted === true){
            element =  element + '<input name="acepted" id="IsActive" type="checkbox" class="is-active btn-switch" checked>';
        } else {
            element =  element + '<input name="acepted" id="IsActive" type="checkbox" class="is-active btn-switch">';
        };

        element = element + '<label for="IsActive" data-off="non pubblico" data-on="pubblico"></label>';
        
        
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">';
        element = element + '<input type="submit" id="update" class="btn btn-rounded update btn-submit text-center color-white box-shadow background-color-blue-light margin-top-small" value="Aggiorna">';   
        element = element + '</div>';
        
        element = element + '</form>'

        return element;
    }

    var updateReview = function(event){
        event.preventDefault();
        var id = $('form').attr('id');

        event.data = new app.Data(true, id, null, 'Review/Update/', false, null);
        app.callback(event, updateReviewList);
    }

    var updateReviewList = function(event){
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
            feedback = app.feedbackEvent(true, 'Commento pubblicato');
        } else {
            feedback = app.feedbackEvent(false, 'ops, si è verificato un errore nella pubblicazione del commento, provare a ricicare la pagina');
        } 
        $overlay.after(feedback);
    }

    /* DELETE */
    var createRemoveReview = function(event){
        var id = $(this).parent().attr('id');

        var element = '';

        element = element + '<div id="' + id + '" class="box-shadow border-radius-small text-center background-color-white delete">';
        element = element + '<p class="text-center confirm">Sei sicuro di voler eliminare il commento?</p>';
    
        element = element + '<div class="text-right">';
        element = element + '<input type="button" id="return" class="btn btn-rounded return text-center color-black box-shadow background-color-white margin-top-small" value="Indietro">'
        element = element + '<input type="submit" id="delete" class="btn btn-rounded save btn-submit text-center color-white box-shadow background-color-red margin-top-small" value="Elimina">';    
        element = element + '</div>';

        element = element + '</div>';

        var $overlay = app.createOverlay();
        $overlay.after(element);
    }

    var deleteReview = function(event){
        var id = $('div.delete').attr('id');
        
        event.data = new app.Data(true, id, null, 'Review/Delete/', false, null);
        app.callback(event, updateReviewList);
    }

    /* CHANGE PAGE */
    var changePage = function(event){
        //Remove active class
        $(event.target).parent().find('span.btn.paginator.active').removeClass('active');
        
        //Add class active to element pressed and take page attribute
        $(this).addClass('active');

        var href = $(this).attr('page');
        
        event.data = new app.Data(false, null, href, 'Review/GetAll', true, $('div.content > ul.list'));
        app.callback(event, createReviewList);

    }

    return {
        createFilterForm: createFilterForm,
        displayFilter: displayFilter,
        removeFilter: removeFilter,
        getAll: getAll,
        editReview: editReview,
        createRemoveReview: createRemoveReview,
        updateReview: updateReview,
        deleteReview: deleteReview,
        changePage: changePage
    }
})();

var reviewUI = (function(){
    
    var DOM = {
        btnFilter: '.btn#filter',
        btnFind: '.btn#find',
        btnRemoveFilter: 'form.display-filter > span.close-filter',
        btnUpdate: '.btn#update',
        btnDelete: '.btn#delete',
        list: 'div.content > ul',
        btnEdit: '.btn.edit',
        btnRemove: '.btn.remove',
        btnChangePage: 'span.btn.paginator'
    }

    return {
        DOMElement: DOM
    };

})();

var review = (function(reviewUI, reviewCtrl){
    var DOMElement = reviewUI.DOMElement;

    var init = function(){
        console.log('review init');
        
        $('span#add').remove();
        reviewCtrl.getAll();

        //Add event handler on button
        $(document).on('click', DOMElement.btnFilter, reviewCtrl.createFilterForm);
        $(document).on('click', DOMElement.btnFind, reviewCtrl.displayFilter);
        $(document).on('click', DOMElement.btnRemoveFilter, reviewCtrl.removeFilter);

        $(document).on('click', DOMElement.btnEdit, { reviewList: DOMElement.list }, reviewCtrl.editReview);
        
        $(document).on('click', DOMElement.btnRemove , reviewCtrl.createRemoveReview);
        $(document).on('click', DOMElement.btnUpdate, reviewCtrl.updateReview);
        $(document).on('click', DOMElement.btnDelete, reviewCtrl.deleteReview);

        //Change page 
        $(document).on('click', DOMElement.btnChangePage, reviewCtrl.changePage);
    }

    return{
        init: init
    }
})(reviewUI, reviewController)