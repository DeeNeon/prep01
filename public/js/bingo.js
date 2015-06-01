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
            if(outer.hasClass('notReady'))
                outer.attr({'data-toggle':"modal", 'data-target':'#numberDialog', 'data-bingo':i});

            $('.bingo').append(outer);
        }
        $('.filtros').show();

        openFirst();
    });

    //Find first notReady element and trigger onClick on it
    function openFirst(){
        $('.circle.notReady:first-child').trigger('click');

        setTimeout(function(){
            $('.chosen-search input').blur();
            $('#txtCantidad').focus();
        },50);
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
        $('.circle-inner').removeClass('selected');
        $(event.relatedTarget).find('.circle-inner').addClass('selected');
        $(window).scrollTop($(event.relatedTarget).position().top);
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.data('bingo'); // Extract info from data-* attributes
        var modal = $(this);
        modal.find('.modal-title').text('Actual : ' + recipient);
        $('.chosen-search input').blur();
        $('#txtCantidad').focus();

    });

    $("#txtCantidad").keyup(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        // Allow: home, end, left, right, down, up

        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {

            if(e.keyCode == 13 && !isNaN($(this).val()) && $(this).val() != ""){
                $('.selected').parent().removeClass('notReady').addClass('ready');
                var cant = $(this).val(),
                    bingo = $('.selected .circle-text').text(),
                    casilla = $('#casilla_chosen span').text();

                $('#numberDialog').modal('hide');
                $('.circle.notReady').first().trigger('click');
                $(this).val('');

                $.post( "service/bingo", function( data ) {
                    notifications(true, cant, bingo, casilla);
                }).fail(function() {
                    notifications(false, cant, bingo, casilla);
                });
            }

            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    function notifications(isOk, cant, bingo, casilla){
        var alertClass = isOk ? 'success' : 'danger',
            msg = isOk ? 'Se guardó ' : 'Error al guardar ',
            infoElem = $('.alert-info');

        if(infoElem.length) $('.alert-info').remove();
        var alert = $('<div></div>',{
                role: 'alert',
                class: 'alert'
            }),
            alertText = $('<strong></strong>'),
            alertClose = $('<span></span>',{
                class: 'fa fa-times removeItem'
            });

        msg += cant + ' en #' + bingo + ' en ' + casilla;

        $('.logBody')
            .append(alert.addClass('alert-'+alertClass)
                .append(alertText.text(msg))
                .append(alertClose));
    }

    $('#clearLog').on('click', function(e){
        e.preventDefault();
        $('.panel-body.logBody').empty();
        var alert = $('<div></div>',{
                role: 'alert',
                class: 'alert'
            }),
            alertText = $('<strong></strong>'),
            alertClose = $('<span></span>',{
                class: 'fa fa-times removeItem'
            });
        alert.addClass('alert-info')
            .append(alertText.text('Sin registros...'))
            .append(alertClose);
    });

    $('.logBody').on('click','.removeItem, .alert', function() {
        if($(this).hasClass('removeItem'))
            $(this).parent().remove();
        else
            $(this).remove();
    });

});