define('IndexedDB', function(){
    'use strict';

    var IndexedDB = (function(){
        var db = null;

        // Constructor
        function IndexedDB(config) {
            this.name = (config && config.name) || 'default';
            this.version = (config && config.version) || '1.0';
            this.desc = (config && config.desc) || 'Description';
            this.size = (config && config.size) || 2 * 1024 * 1024;
        }

        var showStatus = function(status) {
            console.log(status);
        };

        var showError = function(tx, error) {
            console.log('[IndexedDB ERROR] ', error);
        };

        IndexedDB.prototype.init = function(callback, error) {
            showStatus('[IndexedDB] Initialising DB');
        };

        IndexedDB.prototype.addEarthQuake = function(earthquake, success) {
            
        };

        IndexedDB.prototype.getEarthQuake = function(id, success, error) {
            
        };

        IndexedDB.prototype.removeEarthQuake = function(id, success, error) {
            
        };

        return IndexedDB;
    })();

    return IndexedDB;
});