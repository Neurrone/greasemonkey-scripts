// ==UserScript==
// @name           Smogon forums Accessibility Fixes
// @description    Improves the accessibility of Smogon's forums.
// @author         Neurrone
// @copyright 2018
// @license GNU General Public License version 2.0
// @version        1.0
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://raw.githubusercontent.com/Neurrone/greasemonkey-scripts/master/waitForKeyElements.js
// @grant GM_log
// @include https://www.smogon.com/forums/*
// ==/UserScript==

// Give pseudo div tables appropriate roles
function onThreadsTableLoad(index, target) {
    target.setAttribute("role", "table");
    
    for (elem of target.querySelectorAll(".structItem--thread"))
        elem.setAttribute("role", "row");
    
    for (elem of target.querySelectorAll(".structItem-cell"))
		elem.setAttribute("role", "cell");
}

// wait till the Ajax calls loads the table
waitForKeyElements (".structItemContainer-group--sticky, .js-threadList", function(nodes) { nodes.each(onThreadsTableLoad); });
