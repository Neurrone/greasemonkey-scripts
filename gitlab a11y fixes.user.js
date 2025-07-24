// ==UserScript==
// @name           Gitlab Accessibility Fixes
// @description    Improves the accessibility of Gitlab.
// @author         Neurrone
// @copyright 2018
// @license GNU General Public License version 2.0
// @version        1.0
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://raw.githubusercontent.com/Neurrone/greasemonkey-scripts/master/waitForKeyElements.js
// @grant GM_log
// @include https://gitlab.com/*
// ==/UserScript==

// Give add comment buttons on difs a proper label
function onDifButtonLoad(index, target) {
  target.setAttribute("aria-label", "Add Comment");
  target.style.cssText = ""; // strip display: none, making it invisible
  target.classList.add("screen-reader");
  target.classList.add("screen-reader-focusable");
}

function onDifTableLoad(index, target) {
  target.setAttribute("role", "table");
}

function onDifTableRowLoad(index, target) {
  target.setAttribute("role", "row");
}

function onDifTableRowPresentationLoad(index, target) {
  target.setAttribute("role", "presentation");
}

function onDifTableCellLoad(index, target) {
  if (
    target.className.indexOf("line-coverage") >= 0 ||
    target.className.indexOf("line-codequality") >= 0
  ) {
    target.setAttribute("role", "presentation");
  } else {
    target.setAttribute("role", "cell");
  }
}

/*
  Add table semantics to divs being used for the issues table, which have the following structure:
  <ul class="content-list issues-list issuable-list"> // set role="table"
    <li class="issue" data-id="95" data-labels="[]" id="issue_95" url="/..."> // set role="row", each issue is inside a <li>
      <div class="issue-box"> // set role="presentation"
        <div class="issue-info-container|issuable-info-container"> // role = "presentation", newer versions of gitlab use issuable-info-container for the class name
          <div class="issue-main-info|issuable-main-info"> // role = "presentation", children are actual cells
            <div class="issue-title title">
            <div class="issuable-info">
          <div class="issuable-meta"> // role = "presentation", children are cells
            <ul class="controls"> // also set child <li>s's role to presentational
            <div class="float-right issuable-updated-at d-none d-sm-inline-block">
  
  The div structure for the merge request table is also virtually identical, so we handle it here.
  
  <ul class="content-list mr-list issuable-list"> // role="table"
    <li class="merge-request" data-id="1600" data-labels="[...]" id="merge_request_1600"> // role="row", each MR is inside a <li>
      <div class="issue-info-container|issuable-info-container"> // role = "presentation", newer versions of gitlab use issuable-info-container for the class name
        <div class="issue-main-info|issuable-main-info"> // role = "presentation", children are actual cells
          <div class="merge-request-title title"> // role = "cell"
          <div class="issuable-info"> // role="cell"
        <div class="issuable-meta"> // role="presentation"
          <ul class="controls"> // role="cell", set child <li>s's role to presentational
          <div class="float-right issuable-updated-at d-none d-sm-inline-block"> //role="cell"
  
  also, fix the number of related merge requests, comments and upvotes being shown on its own with no accessible indication of what the numbers mean
  */
function onIssuesOrMRTableLoad(index, target) {
  target.setAttribute("role", "table");
  for (row of target.querySelectorAll("li.issue, li.merge-request"))
    row.setAttribute("role", "row");
  for (elem of target.querySelectorAll(
    "div.issue-box, div.issue-info-container, div.issuable-info-container, div.issue-main-info, div.issuable-main-info, div.issuable-meta, ul.controls > *"
  ))
    elem.setAttribute("role", "presentation");
  for (cell of target.querySelectorAll(
    ".issue-check, .issue-main-info > div, .issuable-main-info > div, .issuable-meta > *"
  ))
    cell.setAttribute("role", "cell");
  for (elem of target.querySelectorAll("li.issuable-mr"))
    elem.innerHTML = elem.innerText + " related MRs";
  for (elem of target.querySelectorAll("li.issuable-comments"))
    elem.innerHTML = elem.innerText + " comments";
  for (elem of target.querySelectorAll("li.issuable-upvotes"))
    elem.innerHTML = elem.innerText + " upvotes";
}

// Make file titles headings for faster navigation
function onDiffLoad(index, target) {
  for (elem of target.querySelectorAll("strong.file-title-name")) {
    elem.setAttribute("role", "heading");
    elem.setAttribute("aria-level", "4");
  }
}

var sheet = document.createElement("style");
sheet.innerHTML = `
  /**
   * see https://gomakethings.com/hidden-content-for-better-a11y/#hiding-the-link
   * Visually hide an element, but leave it available for screen readers
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link http://snook.ca/archives/html_and_css/hiding-content-for-accessibility
   */
  .screen-reader {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
  }
  
  /**
   * Extends the .screen-reader class to allow the element to be focusable when navigated to via the keyboard
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link https://www.drupal.org/node/897638
   */
  .screen-reader-focusable:active,
  .screen-reader-focusable:focus {
      clip: auto;
      height: auto;
      margin: 0;
      overflow: visible;
      position: static;
      white-space: normal;
      width: auto;
  }
  `;
document.body.appendChild(sheet);

// wait for ajax calls to load the required elements
waitForKeyElements(".add-diff-note", function (nodes) {
  nodes.each(onDifButtonLoad);
});
waitForKeyElements("div.diff-wrap-lines", function (nodes) {
  nodes.each(onDifTableLoad);
});
waitForKeyElements("div.diff-grid-row", function (nodes) {
  nodes.each(onDifTableRowLoad);
});
waitForKeyElements("div.diff-grid-row > div", function (nodes) {
  nodes.each(onDifTableRowPresentationLoad);
});
waitForKeyElements("div.diff-grid-row > div > div", function (nodes) {
  nodes.each(onDifTableCellLoad);
});

waitForKeyElements("ul.issuable-list", function (nodes) {
  nodes.each(onIssuesOrMRTableLoad);
});
waitForKeyElements("div.file-header-content", function (nodes) {
  nodes.each(onDiffLoad);
})
