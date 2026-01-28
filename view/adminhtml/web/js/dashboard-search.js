/**
 * Copyright © 2026 Modestox (https://github.com/modestox). All rights reserved.
 * License: MIT
 */
define([
    'jquery',
    'mage/collapsible',
    'domReady!'
], function ($) {
    'use strict';

    return function (config) {
        var $searchField = $('#modestox-config-search'),
            $clearBtn = $('#modestox-search-clear'),
            $cards = $('.m2-config-card-container'),
            $groups = $('.m2-tab-group'),
            $noResults = $('#modestox-no-results'), /** Restored element */
            $mainGrid = $('#modestox-main-grid');

        /**
         * Safely expand Magento groups using native click to avoid TypeError
         */
        function checkUrlHash() {
            var hash = window.location.hash;
            if (!hash || hash.indexOf('-head') === -1) return;

            var attempts = 0;
            var interval = setInterval(function () {
                var $target = $(hash);
                if ($target.length) {
                    var $parentSection = $target.closest('.section-config');

                    if ($parentSection.length && !$parentSection.hasClass('active')) {
                        var $sectionHead = $parentSection.find('.entry-edit-head').first();
                        if ($sectionHead.length) $sectionHead.get(0).click();
                    }

                    if (!$target.hasClass('active') && !$target.hasClass('_active')) {
                        $target.get(0).click();
                    }

                    clearInterval(interval);
                    $('html, body').animate({scrollTop: $target.offset().top - 100}, 400);
                }
                if (attempts++ > 15) clearInterval(interval);
            }, 200);
        }

        checkUrlHash();

        /** Filter logic with No Results handling */
        function filterGrid(value) {
            var query = value.toLowerCase().trim();

            if (query.length === 0) {
                $cards.show();
                $groups.show();
                $mainGrid.show();
                $noResults.hide();
                /** Hide No Results when empty */
                $('.m2-card-groups-wrapper').hide();
                $('.m2-card-toggle').removeClass('active');
                $clearBtn.hide();
                return;
            }

            $clearBtn.show();
            var hasAnyResults = false;

            $cards.each(function () {
                var term = $(this).data('search-term') || '';
                if (term.toString().toLowerCase().indexOf(query) > -1) {
                    $(this).show().find('.m2-card-groups-wrapper').show();
                    $(this).find('.m2-card-toggle').addClass('active');
                    hasAnyResults = true;
                } else {
                    $(this).hide();
                }
            });

            $groups.each(function () {
                var isVisible = $(this).find('.m2-config-card-container:visible').length > 0;
                $(this).toggle(isVisible);
            });

            /** Handle No Results display */
            if (hasAnyResults) {
                $mainGrid.show();
                $noResults.hide();
            } else {
                $mainGrid.hide();
                $noResults.show();
            }
        }

        /** Restored: Prevent form submission on Enter key */
        $searchField.on('keydown', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });

        $(document).on('click', '.m2-card-toggle', function (e) {
            $(this).toggleClass('active').closest('.m2-config-card-container').find('.m2-card-groups-wrapper').slideToggle(200);
        });

        $(document).on('click', '.m2-group-link', function (e) {
            e.preventDefault();
            var groupId = $(this).data('group-id'),
                baseUrl = $(this).closest('.m2-config-card-container').find('a.m2-config-card').attr('href');
            if (baseUrl && groupId) {
                var newUrl = baseUrl + '#' + groupId + '-head';
                if (window.location.href === newUrl) {
                    checkUrlHash();
                } else {
                    window.location.href = newUrl;
                }
            }
        });

        $searchField.on('input', function () {
            filterGrid($(this).val());
        });
        $clearBtn.on('click', function () {
            $searchField.val('');
            filterGrid('');
            $searchField.focus();
        });
    };
});