define('service', ['jquery'], function($) {
    'use strict';

    console.log('[Services module initialized]');

    var updateEarthQuakes = function(success) {
        $.getJSON('data/all_day.geojson', null, function(data) {
            success(data.features);
        });
    };

    return {
        updateEarthQuakes : updateEarthQuakes
    };
});