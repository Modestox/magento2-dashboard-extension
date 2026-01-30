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

    return function () {

        /* =========================
         * Cached DOM elements
         * ========================= */
        var $searchField = $('#modestox-config-search'),
            $clearBtn    = $('#modestox-search-clear'),
            $cards       = $('.m2-config-card-container'),
            $groups      = $('.m2-tab-group'),
            $noResults   = $('#modestox-no-results'),
            $mainGrid    = $('#modestox-main-grid');

        /* =========================
         * Helpers
         * ========================= */

        /**
         * Reset grid to default state
         */
        function resetGrid() {
            $cards.show();
            $groups.show();
            $mainGrid.show();
            $noResults.hide();
            $clearBtn.hide();

            $('.m2-card-groups-wrapper').hide();
            $('.m2-card-toggle').removeClass('active');
        }

        /**
         * Open section and tab always (independent of previous state)
         */
        function openAlways($target) {
            var $section = $target.closest('.section-config'),
                $sectionHead = $section.find('.entry-edit-head').first();

            if ($sectionHead.length) {
                if (!$section.hasClass('active')) {
                    $sectionHead.trigger('click');
                }
            }

            if ($target.length) {
                setTimeout(function () {
                    var isOpened = $target.hasClass('open') ||
                        $target.hasClass('active') ||
                        $target.hasClass('_active') ||
                        $target.attr('aria-expanded') === 'true';

                    if (!isOpened) {
                        $target.get(0).click();
                    }
                }, 150);
            }
        }

        /**
         * Handle URL hash (open tab based on #hash)
         */
        function handleUrlHash() {
            var hash = window.location.hash;

            if (!hash || hash.indexOf('-head') === -1) {
                return;
            }

            var attempts = 0;
            var interval = setInterval(function () {
                var $target = $(hash);

                if ($target.length) {
                    openAlways($target);

                    // Scroll to element
                    $('html, body').animate({ scrollTop: $target.offset().top - 100 }, 400);

                    clearInterval(interval);
                }

                if (++attempts > 20) clearInterval(interval);
            }, 250);
        }

        /* =========================
         * Search / Filter logic
         * ========================= */
        function filterGrid(value) {
            var query = (value || '').toLowerCase().trim(),
                MIN_QUERY_LENGTH = 3;

            if (query.length < MIN_QUERY_LENGTH) {
                resetGrid();
                return;
            }

            $clearBtn.show();
            var hasResults = false;

            $cards.each(function () {
                var $card = $(this),
                    term = ($card.data('search-term') || '').toString().toLowerCase();

                if (term.indexOf(query) !== -1) {
                    $card
                        .show()
                        .find('.m2-card-groups-wrapper')
                        .show();

                    $card.find('.m2-card-toggle').addClass('active');
                    hasResults = true;
                } else {
                    $card.hide();
                }
            });

            $groups.each(function () {
                var $group = $(this),
                    visibleCards = $group.find('.m2-config-card-container:visible').length;

                $group.toggle(visibleCards > 0);
            });

            $mainGrid.toggle(hasResults);
            $noResults.toggle(!hasResults);
        }

        /* =========================
         * Events
         * ========================= */

        // Prevent form submit on Enter
        $searchField.on('keydown', function (e) {
            if (e && e.keyCode === 13) {
                e.preventDefault();
            }
        });

        // Input search
        $searchField.on('input', function () {
            filterGrid(this.value);
        });

        // Clear search
        $clearBtn.on('click', function () {
            $searchField.val('').focus();
            filterGrid('');
        });

        // Toggle card groups
        $(document).on('click', '.m2-card-toggle', function () {
            var $card = $(this)
                .toggleClass('active')
                .closest('.m2-config-card-container');

            $card.find('.m2-card-groups-wrapper').slideToggle(200);
        });

        // Navigate to group via link
        $(document).on('click', '.m2-group-link', function (e) {
            if (e) e.preventDefault();

            var $card = $(this).closest('.m2-config-card-container'),
                groupId = $(this).data('group-id'),
                baseUrl = $card.find('a.m2-config-card').attr('href');

            if (!baseUrl || !groupId) {
                return;
            }

            var targetUrl = baseUrl + '#' + groupId + '-head';

            if (window.location.href === targetUrl) {
                handleUrlHash();
            } else {
                window.location.href = targetUrl;
            }
        });

        // Initialize hash handling on page load
        handleUrlHash();
    };
});
