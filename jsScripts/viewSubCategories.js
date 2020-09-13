$('document').ready(function(){

    
    $.each($('.viewSubCatListWrapper'), function(i, cat){
        if($(cat).children().length === 0){
            $(cat).append(`<p>No Sub Categories</p>`);
        }
    })
})