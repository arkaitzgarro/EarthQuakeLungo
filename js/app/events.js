define('events', ['jquery', 'controller'], function($, Controller) {
    'use strict';

    console.log('[Events module initialized]');

    $(function(){
        $('article#main-map').on('load', Controller.showMap);
        $('.earthquake-list').on('click', 'li.arrow', Controller.showDetail);
        $('.earthquake-list').on('singleTap', 'li.arrow', Controller.showDetail);
        $('#search').on('keyup', Controller.filterEarthQuakes);
    });
});