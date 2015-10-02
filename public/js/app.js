/**
 * Created by David on 19/04/2015.
 */
'use strict';
var App = (function(self){

    var popup = L.popup(),
        map;

    self.dropdownClick = function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+'<span class="caret"></span>');
    };

    self.initMap = function(){
        map = L.map('map').setView([22.896806, -109.924451], 13);
        map.options.maxZoom = 13;
        map.options.minZoom = 12;

        // OpenStreetMap tile layer
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', self.onMapClick);

        return self;
    };

    self.createSelectItem = function(text, select){
        var option = $('<option></option>').val(text);
            option.text(text);
        select.append(option);

        return self;
    };
    ///////////////////
    self.loadDistritos = function() {
        $("#distritos").select2({
            placeholder: 'Seleccionar distrito',
            hidden: true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "/service/distritos",
                dataType: 'json',
                quietMillis: 250,
                data: function (term, page) {
                    return {
                        q: term, // search term
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter the remote JSON data
                    return { results: data.items };
                },
                cache: true
            }
        });
    };

    self.loadSecciones = function() {

    };

    self.loadPoligonos = function(id_seccion) {
        $.getJSON('/service/seccion/'+id_seccion,function(data){
        }).fail(function(err) {
            console.log('Fail: '+ err);
        }).complete(function(data) {
            var items = data.responseJSON;
            var polygons = [];
            for(var item in items){
                if (items.hasOwnProperty(item)) {
                    polygons.push(items[item].poligon);
                }
            }
            for(var p in polygons){
                if (polygons.hasOwnProperty(p)) {
                    polygons[p].split(',').chunk(2);
                }
            }

            for(var p1 in polygons){
                if (polygons.hasOwnProperty(p1)) {
                    //console.log(polygons[p1].split(',').chunk(2));
                    var pol = polygons[p1].split(',').chunk(2);
                    var arr = [];
                    for(var e in pol){
                        if (pol.hasOwnProperty(e)){
                            arr.push(new L.LatLng(pol[e][0], pol[e][1]));
                        }
                    }
                    //console.log(arr);
                    var polygon = new L.Polygon(arr);
                    map.addLayer(polygon);
                }
            }
        });
    };

    self.init = function(){
        $('body').on('click','.dropdown-menu li a', self.dropdownClick);

        self.initMap();
        self.loadSecciones();
        self.loadDistritos();
        //self.loadPoligonos();

        return self;
    };

    self.rowPopup = function(labelText, col1Text, col2Text, color){
        color = color == 'b' ? 'labelBlue' : (color == 'r' ? 'labelRed' : 'labelGray') ;

        var elemLabel = $('<h5></h5>').text(labelText),
            elemCol1 = $('<h5></h5>').text(col1Text).addClass('labelGray'),
            elemCol2 = $('<h5></h5>').text(col2Text).addClass(color),
            row = $('<div></div>',{
            class : 'row'
            }),
            label = $('<div></div>',{
                class : 'col-sm-8'
            }).append(elemLabel.addClass(color)),
            col1 = $('<div></div>',{
                class : 'col-sm-2'
            }).append(elemCol1),
            col2 = $('<div></div>',{
                class : 'col-sm-2'
            }).append(elemCol2);

        row.append(label, col1, col2);

        return row;
    };

    self.onMapClick = function (e) {
        var casilla = $('<h4></h4>').addClass('popupHeader labelBlue').text('Casilla 332 B'),
            wrapper = $('<div class="popupContainer"></div>'),
            promovidos = self.rowPopup('Promovidos', '999', '99%','b'),
            noPromovidos = self.rowPopup('No Promovidos', '999', '99%','r'),
            total = self.rowPopup('Total', '999', '99%','g');

        wrapper.append(casilla, promovidos, noPromovidos, total);
        wrapper.wrap('<div></div>');
        popup
            .setLatLng(e.latlng)
            .setContent(wrapper.parent().html())
            .openOn(map);

        return self;
    };

    //Ver mas btn
    /*$('.btn').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');

        $this = $this.find('i');
        if($this.hasClass('glyphicon-chevron-up')){
            $this.removeClass('glyphicon-chevron-up');
            $this.addClass('glyphicon-chevron-down');
        }
        else{
            $this.removeClass('glyphicon-chevron-down');
            $this.addClass('glyphicon-chevron-up');
        }

    });*/

    return self;
})(App || {}).init();

Array.prototype.chunk = function(chunkSize) {
    var array=this;
    return [].concat.apply([],
        array.map(function(elem,i) {
            return i%chunkSize ? [] : [array.slice(i,i+chunkSize).reverse()];
        })
    );
};