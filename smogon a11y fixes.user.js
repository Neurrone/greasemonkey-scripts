// ==UserScript==
// @name           Smogon Accessibility Fixes
// @description    Improves the accessibility of Smogon.
// @author         Neurrone
// @copyright 2018
// @license GNU General Public License version 2.0
// @version        1.0
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://raw.githubusercontent.com/Neurrone/greasemonkey-scripts/master/waitForKeyElements.js
// @grant GM_log
// @include https://www.smogon.com/*
// ==/UserScript==

// Give pseudo div tables appropriate roles
function onDexTableLoad(index, target) {
    target.setAttribute("role", "table");
    
    for (elem of target.querySelectorAll(".PokemonAltRow, .MoveRow"))
        elem.setAttribute("role", "row");
    
    for (elem of target.querySelectorAll(".PokemonAltRow-name, .PokemonAltRow-types, .PokemonAltRow-abilities, .PokemonAltRow-tags, .PokemonAltRow-hp, .PokemonAltRow-atk, .PokemonAltRow-def, .PokemonAltRow-spa, .PokemonAltRow-spd, .PokemonAltRow-spe, .MoveRow-name, .MoveRow-type, .MoveRow-damage, .MoveRow-power, .MoveRow-accuracy, .MoveRow-pp, .MoveRow-description"))
		elem.setAttribute("role", "cell");
    
    // add text for screen readers to the third column of the move data table for each pokemon's moves, corresponding to the visual indication of the move's damage type
    for (elem of target.querySelectorAll(".MoveRow-damage .Physical"))
        elem.setAttribute("aria-label", "Physical");
    for (elem of target.querySelectorAll(".MoveRow-damage .Special"))
        elem.setAttribute("aria-label", "Special");
    for (elem of target.querySelectorAll(".MoveRow-damage .Non-Damaging"))
        elem.setAttribute("aria-label", "Non-Damaging");
}

// wait till the Ajax calls loads the table
waitForKeyElements (".DexTable", function(nodes) { nodes.each(onDexTableLoad); });
