// ==UserScript==
// @name           WhatsApp Web accessibility fixes
// @description    Improves the accessibility of WhatsApp Web.
// @author         Neurrone
// @copyright 2018
// @license GNU General Public License version 2.0
// @version        1.0
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://raw.githubusercontent.com/Neurrone/greasemonkey-scripts/master/waitForKeyElements.js
// @grant GM_log
// @include https://web.whatsapp.com/*
// ==/UserScript==

function setConversationRegion(index, target) {
    target.setAttribute("role", "region");
    target.setAttribute("aria-label", "conversation");
}

function setConversationSelectionRegion(index, target) {
    target.setAttribute("role", "region");
    target.setAttribute("aria-label", "conversation selection");
}

// announces new messages automatically
function setMessagesLiveRegion(index, target) {
    target.setAttribute("aria-live", "polite");
}

// make outgoing messages an h5
function onOutgoingMsg(index, target) {
    target.setAttribute("role", "heading");
    target.setAttribute("aria-level", "5");
}

// make incoming messages h4
function onIncomingMsg(index, target) {
    target.setAttribute("role", "heading");
    target.setAttribute("aria-level", "4");
}

// wait till the Ajax calls loads the required elements

waitForKeyElements ("#main", function(nodes) { nodes.each(setConversationRegion); });
waitForKeyElements ("#pane-side", function(nodes) { nodes.each(setConversationSelectionRegion); });
waitForKeyElements ("div.copyable-area > span+span+div", function(nodes) { nodes.each(setMessagesLiveRegion); });
waitForKeyElements (".message-out .selectable-text.copyable-text", function(nodes) { nodes.each(onOutgoingMsg); });
waitForKeyElements (".message-in .selectable-text.copyable-text", function(nodes) { nodes.each(onIncomingMsg); });