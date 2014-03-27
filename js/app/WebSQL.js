define('WebSQL', function(){
    'use strict';

    var WebSQL = (function(){
        var db = null;

        // Constructor
        function WebSQL(config) {
            this.name = (config && config.name) || 'default';
            this.version = (config && config.version) || '1.0';
            this.desc = (config && config.desc) || 'Description';
            this.size = (config && config.size) || 2 * 1024 * 1024;

            this.init();
        }

        var showStatus = function(status) {
            console.log(status);
        };

        var showSuccess = function(tx, results) {
            console.log('[WebSQL OK] ', tx);
        };

        var showError = function(tx, error) {
            console.log('[WebSQL ERROR] ', error);
        };

        WebSQL.prototype.init = function(callback, error) {
            showStatus('[WebSQL] Initialising DB');

            try {
                if (window.openDatabase) {
                    db = openDatabase(this.name, this.version, this.desc, this.size);
                    if (db) {
                        db.transaction(function(tx) {
                            var eartquakeTable = 'CREATE TABLE IF NOT EXISTS earthquake (' +
                                                    '_id TEXT PRIMARY KEY,' +
                                                    'title TEXT,' +
                                                    'desc TEXT,' +
                                                    'mag REAL,' +
                                                    'lat REAL,' +
                                                    'long REAL,' +
                                                    'depth REAL,' +
                                                    'link TEXT,' +
                                                    'time INTEGER,' +
                                                    'created_at INTEGER' +
                                                ')';

                            tx.executeSql(eartquakeTable, [], callback || showSuccess, error || showError);
                        });
                    } else {
                        showStatus('[WebSQL] Error occurred trying to open DB.');
                    }
                } else {
                    showStatus('[WebSQL] Web SQL Databases not supported');
                }
            } catch (e) {
                showStatus('[WebSQL] Error occurred during DB init, Web SQL Database supported?');
            }
        };

        WebSQL.prototype.addEarthQuake = function(earthquake, success, error) {
            db.transaction(function(tx) {
                // Created at
                var now = (new Date()).getTime();

                // Insert earthquake
                tx.executeSql('INSERT OR IGNORE INTO earthquake (_id, title, desc, mag, long, lat, depth, link, time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                              [earthquake.id, earthquake.title, earthquake.desc, earthquake.mag, earthquake.long, earthquake.lat, earthquake.depth, earthquake.link, earthquake.time, now / 1000],
                              success || showSuccess,
                              error || showError);
            });
        };

        WebSQL.prototype.getEarthQuake = function(id, success, error) {
            db.transaction(function(tx) {
                // Get earthquake
                tx.executeSql('SELECT * FROM earthquake WHERE _id = ?', [id],
                              function(tx, results) {
                                if(results.rows.length > 0)
                                    success(results.rows.item(0));
                                else
                                    success(null);
                              }, error || showError);
            });
        };

        WebSQL.prototype.removeEarthQuake = function(id, success, error) {
            db.transaction(function(tx) {
                // Get earthquake
                this.getEarthQuake(id, function(tx, earthquake) {
                    if(earthquake) {
                        // Delete earthquake
                        tx.executeSql('DELETE FROM earthquake WHERE _id = ?', [earthquake.id],
                                      function(tx, results) {
                                          success(earthquake);
                                      },
                                      error || showError);
                    }
                });
            });
        };

        WebSQL.prototype.query = function(filter, success, error) {
            db.transaction(function(tx) {
                var where = [],
                    args = [];

                if(filter) {
                    if(filter.name) {
                        where.push('title LIKE "%' + filter.name + '%"');
                        // args.push(filter.name);
                    }

                    if(filter.mag) {
                        where.push('mag >= ?');
                        args.push(filter.mag);
                    }
                }

                var sql = 'SELECT * FROM earthquake';
                if(where.length > 0) {
                    sql += ' WHERE ' + where.join('AND');
                }
                sql += ' ORDER BY time DESC LIMIT ?';
                args.push(filter.limit);

                // Get earthquakes
                tx.executeSql(sql, args,
                              function(tx, results) {
                                var _results = [];

                                if(results.rows.length) {
                                    var _l = results.rows.length;
                                    for (var i = 0; i < _l; i++) {
                                        _results.push(results.rows.item(i));
                                    }
                                }
                                
                                success(_results);
                              }, error || showError);
            });
        };

        return WebSQL;
    })();

    return WebSQL;
});