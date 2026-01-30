/**
 * Copyright © 2026 Modestox (https://github.com/modestox). All rights reserved.
 * License: MIT
 */
define(['jquery', 'domReady!'], function ($) {
    'use strict';

    return function () {
        /* =========================
         * Find link to our main config section
         * ========================= */
        var $realLink = $('a[href*="section/modestox_dashboard_extension"]');

        if ($realLink.length) {
            var $navBlock = $realLink.closest('.config-nav-block');
            var $title = $navBlock.find('.admin__page-nav-title');
            var targetUrl = $realLink.attr('href');

            /* =========================
             * Remove standard items list
             * ========================= */
            $navBlock.find('.admin__page-nav-items').remove();

            /* =========================
             * Apply our new CSS class and update text
             * ========================= */
            $title.addClass('modestox-nav-header no-arrow').show();
            $title.find('strong').text('Extension List');

            /* =========================
             * Handle click to redirect
             * ========================= */
            $title.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = targetUrl;
            });
        }
    };
});