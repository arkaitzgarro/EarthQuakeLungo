define('ui', ['jquery', 'lungo', 'handlebars', 'underscore', 'gmaps', 'jquery.gmap3'], function($, Lungo, Handlebars, _, gmaps) {
    'use strict';

    console.log('[UI module initialized]');

    var drawList = function(earthquakes) {
        console.log('[UI] Drawing the list');

        var $list = $$('.earthquake-list'),
            $ul = $list.find('ul'),
            sections = [];
        
        $list.find('.main-loading').remove();
        $ul.empty();

        var _l = earthquakes.length;
        var _strDate = _formatDate(new Date(0));

        for (var i = 0; i < _l; i++) {
            var section;

            var _earthquakeDate = _formatDate(earthquakes[i].time);
            if(_earthquakeDate !== _strDate) {
                _strDate = _formatDate(earthquakes[i].time);
                section = {
                    date : (new Date(earthquakes[i].time)).toDateString(),
                    earthquakes : []
                };
                sections.push(section);
            }
            section.earthquakes.push(earthquakes[i]);
        }
        
        // TODO: precompile templates
        Handlebars.getTemplate('earthquake-list');
        $ul.append(Handlebars.templates['earthquake-list']({earthquakes : sections}));
    };

    var showMap = function(earthquakes) {
        var $map = $('#main-map'),
            values = [];

        for(var i in earthquakes) {
            values.push({
                latLng : [earthquakes[i].lat, earthquakes[i].long],
                data : earthquakes[i].title
            });
        }

        $map.gmap3({
            clear : {
                name : ['marker']
            }
        });

        $map.gmap3({
            marker :{
                values : values,
                options :{
                  draggable : false
                },
            },
            autofit : {},
            events:{
                mouseover: function(marker, event, context){
                    var $map = $(this).gmap3('get'),
                        infowindow = $map.gmap3({get:{name:'infowindow'}});
                    
                    if (infowindow){
                        infowindow.open($map, marker);
                        infowindow.setContent(context.data);
                    } else {
                        $(this).gmap3({
                            infowindow:{
                                anchor: marker,
                                options: {content: context.data}
                            }
                        });
                    }
                },
                mouseout: function(){
                    var infowindow = $(this).gmap3({get:{name:'infowindow'}});
        
                    if (infowindow){
                        infowindow.close();
                    }
                }
            }
        });
    };

    var showDetail = function(earthquake) {
        // TODO: precompile templates
        Handlebars.getTemplate('earthquake-detail');

        $('#earthquake-detail').remove();
        $('body').append(Handlebars.templates['earthquake-detail'](earthquake));

        Lungo.Router.section('earthquake-detail');
    };

    var _formatDate = function(date) {
        if(_.isNumber(date))
            date = new Date(date);

        return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDay();
    };

    var _formatTime = function(date) {
        if(_.isNumber(date))
            date = new Date(date);

        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    };

    Handlebars.getTemplate = function(name){
        if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
            var response = $.ajax({
                url : 'views/' + name + '.hbs',
                // success : function(data) {
                //     console.log('[UI template ' + name + ' loaded]');
                //     if (Handlebars.templates === undefined) {
                //         Handlebars.templates = {};
                //     }
                //     Handlebars.templates[name] = Handlebars.compile(data);
                // },
                error : function(xhr, type) {
                    console.error('[UI error loading template ' + name + ']');
                    console.error(xhr, type);
                },
                dataType: 'html',
                async : false
            });

            if (Handlebars.templates === undefined) {
                Handlebars.templates = {};
            }
            Handlebars.templates[name] = Handlebars.compile(response.responseText);

            // var script = document.createElement('script');
            // script.type  = 'text/javascript';
            // script.text = response;
            // document.body.appendChild(script);
        }

        return Handlebars.templates[name];
    };

    Handlebars.registerHelper('className', function(mag) {
        if(mag > 7) {
            return 'red';
        } else if(mag > 4) {
            return 'orange';
        }

        return 'green';
    });

    Handlebars.registerHelper('formatTime', function(time) {
        var dateTime = new Date(time);
        return dateTime.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    });

    return {
        drawList : drawList,
        showMap : showMap,
        showDetail : showDetail
    };
});