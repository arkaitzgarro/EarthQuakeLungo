define('ui.adapter', function() {
    'use strict';

    var Adapter = (function(){
        var _db_search_data,
            _db_get_data,
            _views,
            _filter,
            _data;

        // Constructor
        var Adapter = function(db_search_data, db_get_data, views, filter) {
            _db_search_data = db_search_data || null;
            _db_get_data = db_get_data || null;
            _views = views || null;
            _filter = filter || {};
        };

        // Data provider data change notificaxztion
        Adapter.prototype.notify = function() {
            // Get latest data from data provider
            _data = _db_get_data(_filter);

            // Update views
            for(var i in _views) {
                _views[i](_data);
            }
        };

        Adapter.prototype.updateFilter = function(filter) {
            // Update data filter
            _filter = filter;
            _db_search_data(_filter);
        };

        return Adapter;

    })();

    return Adapter;
});