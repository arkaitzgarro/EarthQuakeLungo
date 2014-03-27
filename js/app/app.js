define('app', ['jquery', 'lungo', 'events', 'service', 'data', 'ui', 'ui.adapter'],
  function($, Lungo, Events, Service, DB, UI, Adapter) {

  'use strict';

  /* Initialize */

  var start = function() {
    console.log('[Loading Earthquake]');

    Lungo.init({
        name: 'EarthQuake',
        resources: ['views/aside.html']
    });

    var config = JSON.parse(localStorage.getItem('userConfig'));

    // Create a list adapter. Link to data and UI
    var listAdapter = new Adapter(DB.searchEarthQuakes,
                                  DB.getLatestData,
                                  [UI.drawList],
                                  null);
    DB.subscribe(listAdapter);
    DB.init(config);

    // Update earthquakes
    Service.updateEarthQuakes(function(results) {
        DB.insertEarthQuakes(results);
    });
  };

  $(function() {
      start();
  });
});