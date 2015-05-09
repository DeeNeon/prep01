/**
 * Created by David on 04/05/2015.
 */
$(function() {

    //TODO: Fill selects via AJAX

    $('#seccion,#casilla').chosen({no_results_text: "Sin resultados..."});

    $('#casilla').on('change', function(evt, params) {
        //TODO: $.ajax({params})
        //id params.selected

        for(var i = 1; i <= 300; i++)
        {
            var outer = $('<div></div>',{
                    class : 'circle circle-border'
                }),
                inner = $('<div class="circle-inner"></div>'),
                text = $('<div class="circle-text"></div>');

            var readyClass = (i % 3 == 0) ? 'ready' : 'notReady';
            outer.addClass(readyClass).append(inner.append(text.text(i)));
            if(outer[0].className.indexOf('notReady') > 0)
                outer.attr({'data-toggle':"modal", 'data-target':'#numberDialog', 'data-bingo':i});

            $('.bingo').append(outer);
        }
        $('.filtros').show();

        openFirst();
    });

    //Find first notReady element and trigger onClick on it
    function openFirst(){
        $('.circle.notReady:first-child').trigger('click');
    }

    $('[name=filtro]').on('click',function(){
        var ready = $('.ready'),
            notReady = $('.notReady');

        $('.circle-inner').removeClass('selected');
        switch($(this).val())
        {
            case "true":
                ready.show();
                notReady.hide();
                break;
            case "false":
                ready.hide();
                notReady.show();
                openFirst();
                break;
            default:
                ready.show();
                notReady.show();
                break;
        }

    });

    $('#numberDialog').on('shown.bs.modal', function (event) {

        $('#txtCantidad').focus();

        $('.circle-inner').removeClass('selected');
        $(event.relatedTarget).find('.circle-inner').addClass('selected');
        $(window).scrollTop($(event.relatedTarget).position().top);
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.data('bingo'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-title').text('Actual : ' + recipient);

    });

    $(window).keypress(function(e) {
        $('.circle:contains('+String.fromCharCode(e.which)+')');

        if (e.ctrlKey && $('')) {
            console.log( "You pressed CTRL + C" );
        }
    });

    $("#txtCantidad").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        // Allow: home, end, left, right, down, up

        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {

            if(e.keyCode == 13 && !isNaN($(this).val()) && $(this).val() != ""){
                $('.selected').parent().removeClass('notReady').addClass('ready');
                $('#numberDialog').modal('hide');
                $('.circle.notReady').first().trigger('click');
                $(this).val('');
            }

            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

});