// ==UserScript==
// @name           Pivotal Tracker Accessibility Fixes
// @description    Improves the accessibility of Pivotal Tracker.
// @author         Neurrone
// @copyright 2019
// @license GNU General Public License version 2.0
// @version        1.0
// @requireÂ  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  https://code.jquery.com/jquery-3.3.1.min.js
// @require https://raw.githubusercontent.com/Neurrone/greasemonkey-scripts/master/waitForKeyElements.js
// @grant GM_log
// @include https://www.pivotaltracker.com/n/*
// ==/UserScript==

// Add heading roles for releases and individual stories for more efficient navigation
function onStoryLoad(index, target) {
    for (node of target.querySelectorAll("div.feature span.story_name, div.chore span.story_name, div.bug span.story_name")) {
        node.setAttribute("role", "heading");
        node.setAttribute("aria-level", "2");
    }
    for (node of target.querySelectorAll("div.release span.story_name")) {
        node.setAttribute("role", "heading");
        node.setAttribute("aria-level", "1");
    }
}

// Make panels labelled regions for ease of navigation and understanding of page layout
function onPanelLoad(index, target) {
    target.setAttribute("role", "region");
    target.setAttribute('aria-label', target.getAttribute('data-type'));
}

// wait for ajax calls to load the required elements
waitForKeyElements ('div.story', function(nodes) { nodes.each(onStoryLoad); });
waitForKeyElements ('div[data-aid=Panel]', function(nodes) { nodes.each(onPanelLoad); });