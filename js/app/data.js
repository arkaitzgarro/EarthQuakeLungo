define('data', ['WebSQL', 'IndexedDB', 'underscore'], function(WebSQL, IndexedDB, _) {
    'use strict';

    console.log('[Data module initialized]');

    var _subscribers = [],
        _latestData = [],
        _lastFilter = {},
        _config,
        _DB;

    var CONFIG_BASE = {
        name : 'earthquake',
        version : '1.0',
        desc : 'EarthQuakes database',
        size : 2 * 1024 * 1024,
        limit : 50
    };

    var init = function(config) {
        _config = _.extend(CONFIG_BASE, config);
        _lastFilter.limit = _config.limit;

        if(Modernizr.websqldatabase) {
            _DB = new WebSQL(config);
        } else {
            _DB = new IndexedDB(config);
        }

        // Show actual earthquakes
        _prepareData(_lastFilter);
    };

    /**
     * Insert earthquakes into database.
     * @param Array data Earthquakes collection
     */
    var insertEarthQuakes = function(data) {
        for(var i in data) {
            var earthquake = {
                id : data[i].id,
                title : data[i].properties.place,
                desc : data[i].properties.title,
                mag : data[i].properties.mag,
                long : data[i].geometry.coordinates[0],
                lat : data[i].geometry.coordinates[1],
                depth : data[i].geometry.coordinates[2],
                link : data[i].properties.url,
                time : data[i].properties.time
            };

            _DB.addEarthQuake(earthquake);
        }

        // TODO: callback on last instert
        // Refresh data according to new earthquakes
        _prepareData(_lastFilter);
    };

    /**
     * Get earthquakes based on search input
     * @param  String search
     */
    var searchEarthQuakes = function(filter) {
        _lastFilter = _.extend(_lastFilter, filter);
        _prepareData(_lastFilter);
    };

    /**
     * Get earthquakes based on search input
     * @param  String search
     */
    var getEarthQuake = function(id, success) {
        _DB.getEarthQuake(id, function(result) {
            (result)? success(result) : success(null);
        });
    };

    /**
     * Get latest earthquakes and notify to subscribers
     * @param  Object filter Query conditions
     */
    var _prepareData = function(filter) {
        _latestData = [];
        _DB.query(filter, function(results) {
            _latestData = results;
            
            // Notify data change to subscribers
            _notifyAll();
        });
    };

    /**
     * Get latest query data
     * @return Array Results
     */
    var getLatestData = function() {
        return _latestData;
    };

    /**
     * Add a new subscriber to this data provider
     * @param  Object obj Adapter object
     */
    var subscribe = function (obj) {
        _subscribers.push(obj);
    };

    /**
     * Notify all subscribers, data has changed
     */
    var _notifyAll = function() {
        for(var i in _subscribers) {
            _subscribers[i].notify();
        }
    };

    return {
        init : init,
        subscribe : subscribe,
        getLatestData : getLatestData,
        insertEarthQuakes : insertEarthQuakes,
        searchEarthQuakes : searchEarthQuakes,
        getEarthQuake : getEarthQuake
    };
});