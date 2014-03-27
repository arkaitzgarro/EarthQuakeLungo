define('controller', ['service', 'data', 'ui', 'quo'], function(Service, DB, UI, $) {
    'use strict';

    console.log('[Controller module initialized]');

    var filterEarthQuakes = function(e) {
        var $this = $(this);
        var filter = JSON.parse(sessionStorage.getItem('filter')) || {};

        filter.name = this.value;
        DB.searchEarthQuakes(filter);
    };

    var showDetail = function(e) {
        var $this = $(this),
            id = this.dataset.id;

        DB.getEarthQuake(id, function(earthquake) {
            UI.showDetail(earthquake);
        });
    };

    var showMap = function(e) {
        UI.showMap(DB.getLatestData());
    };

    return {
        showDetail : showDetail,
        showMap : showMap,
        filterEarthQuakes : filterEarthQuakes
    };
});