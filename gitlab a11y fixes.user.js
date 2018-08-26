// ==UserScript==
// @name           Gitlab Accessibility Fixes
// @description    Improves the accessibility of Gitlab.
// @author         Neurrone
// @copyright 2018
// @license GNU General Public License version 2.0
// @version        1.0
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://raw.githubusercontent.com/Neurrone/greasemonkey-scripts/master/waitForKeyElements.js
// @grant GM_log
// @include https://gitlab.com/*
// ==/UserScript==
/*
// Give add comment buttons on difs a proper label
function onDifButtonLoad(index, target) {
    for (elem of target.querySelectorAll(":first-child"))
        elem.setAttribute("aria-label", "Add Comment");
}

// Give dif table cells  a role=cell
function onDifTableCellLoad(index, target) {
    target.setAttribute("role", "table");
    for (elem of target.querySelectorAll("tr"))
        elem.setAttribute("role", "row");
    for (elem of target.querySelectorAll("td"))
        elem.setAttribute("role", "cell");
    for (elem of target.querySelectorAll("tr:last-child"))
        elem.setAttribute("aria-hidden", "true");
}
*/

/*
Add table semantics to divs being used for the issues table, which have the following structure:
<ul class="content-list issues-list issuable-list"> // set role="table"
  <li class="issue" data-id="95" data-labels="[]" id="issue_95" url="/..."> // set role="row", each issue is inside a <li>
    <div class="issue-box"> // set role="presentation"
      <div class="issue-info-container"> // role="presentation"
        <div class="issue-main-info"> // role = "presentation", children are actual cells
          <div class="issue-title title">
          <div class="issuable-info">
        <div class="issuable-meta"> // role = "presentation", children are cells
          <ul class="controls"> // also set child <li>s's role to presentational
          <div class="float-right issuable-updated-at d-none d-sm-inline-block">

The div structure for the merge request table is also virtually identical, so we handle it here.

<ul class="content-list mr-list issuable-list">
  <li class="merge-request" data-id="1600" data-labels="[...]" id="merge_request_1600"> // role="row", each MR is inside a <li>
    <div class="issue-info-container"> // role = "presentation"
      <div class="issue-main-info"> // role = "presentation", children are actual cells
        <div class="merge-request-title title">
        <div class="issuable-info">
      <div class="issuable-meta"> 
        <ul class="controls"> // also set child <li>s's role to presentational
        <div class="float-right issuable-updated-at d-none d-sm-inline-block">

also, fix the number of related merge requests, comments and upvotes being shown on its own with no accessible indication of what the numbers mean
*/

function onIssuesOrMRTableLoad(index, target) {
    target.setAttribute("role", "table");
    for (row of target.querySelectorAll("li.issue, li.merge-request"))
        row.setAttribute("role", "row");
    for (elem of target.querySelectorAll("div.issue-box, div.issue-info-container, div.issue-main-info, div.issuable-meta, ul.controls > *"))
        elem.setAttribute("role", "presentation");
    for (cell of target.querySelectorAll('.issue-main-info > div, .issuable-meta > *'))
        cell.setAttribute("role", "cell");
	for (elem of target.querySelectorAll("li.issuable-mr"))
		elem.innerHTML = elem.innerText + " related MRs";
	for (elem of target.querySelectorAll("li.issuable-comments"))
		elem.innerHTML = elem.innerText + " comments";
	for (elem of target.querySelectorAll("li.issuable-upvotes"))
		elem.innerHTML = elem.innerText + " upvotes";
}

function onDiffLoad (index, target) {
	for (elem of target.querySelectorAll("div.file-header-content > a")) {
		elem.setAttribute("role", "heading");
		elem.setAttribute("aria-level", "4");
	}
	
	for (elem of target.querySelectorAll("a.js-toggle-diff-comments"))
		elem.setAttribute("aria-label", "toggle comments for this file");
}

// wait for ajax calls to load the required elements
//waitForKeyElements ('[title="Add a comment to this line"]', function(nodes) { nodes.each(onDifButtonLoad); });
//waitForKeyElements ('[table, .diff-wrap-lines', function(nodes) { nodes.each(onDifTableCellLoad); });

waitForKeyElements ('ul.issuable-list', function(nodes) { nodes.each(onIssuesOrMRTableLoad); });
waitForKeyElements ('div.file-holder', function(nodes) { nodes.each(onDiffLoad); });