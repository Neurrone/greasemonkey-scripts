# Greasemonkey Scripts

This is a set of Greasemonkey scripts to fix accessibility problems with various websites, inspired by the [axSGrease project](https://github.com/nvaccess/axSGrease).

## Installation

Before you can install any of these scripts, you must first install a user script manager for your browser; [GreaseMonkey for firefox](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
There are also user script managers for other browsers.
See the [Greasy Fork's page on user script installations](https://greasyfork.org/en/help/installing-user-scripts) for more details.

After installing a user script manager, activate the link for each script to install it.

## GitLab Accessibility Fixes

[Download GitLab Accessibility Fixes](https://github.com/Neurrone/greasemonkey-scripts/raw/master/gitlab%20a11y%20fixes.user.js)

This script fixes the following problems on [GitLab](https://gitlab.com):

- Adding table semantics for pseudo div tables for the issues and merge requests table.
- Adding level 4 headings for file names to facilitate more convenient navigation when viewing diffs.

## Pivotal Tracker Accessibility Fixes

[Download Pivotal Tracker Accessibility Fixes](https://github.com/Neurrone/greasemonkey-scripts/raw/master/pivotal%20tracker%20a11y%20fixes.user.js)

This script improves the accessibility of [Pivotal Tracker](https://pivotaltracker.com) by:

- Making releases and stories level 1 and 2 headings, respectively for faster navigation.

This site is particularly awful, and is one of the worst I've seen. There is only so much that scripts like this can do.

## Plex Web Accessibility Fixes

[Download Plex Web Accessibility Fixes](https://github.com/Neurrone/greasemonkey-scripts/raw/master/plex%20a11y%20fixes.user.js)

This script improves the accessibility of the [Plex Web interface](https://app.plex.tv) by:

- Adding labelled regions for more efficient navigation around the interface for screen reader users
- Adding missing labels to buttons on the album details and playback control widgets as well as the selection tool bar
- When multiple items are selected, the toolbar that appears to operate on selected items is exposed via a labelled region
- Menus are made keyboard accessible. Focus automatically moves to menus when opened. The up/down arrow, home and end keys can be used to navigate through menu items. First-letter navigation is supported as well (i.e, pressing "p" moves you to the next option that starts with p, if any)
- The playlist, album track list and playback queue pseudo-tables are exposed as a table via aria
- In contexts when multiple tracks can be selected, The `aria-hidden` attribute on the deselect button next to each track is unhidden as it was mistakenly set

Press the `?` key for a list of built-in hotkeys. The most important ones to note are:

- `/` brings focus to the search field
- `space` plays / pauses
- `up` / `down` increases / decreases volume in steps of 10%. This is particularly important as the volume progress bar is not keyboard accessible
- `shift` + `left / right`: moves to the previous or next item in the play queue

## WhatsApp Web Accessibility Fixes

[Download WhatsApp Web Accessibility Fixes](https://github.com/Neurrone/greasemonkey-scripts/raw/master/whatsApp%20Web%20a11y%20fixes.user.js)

This script improves the accessibility of [WhatsApp Web](https://web.whatsapp.com) by:

- Adding regions around the conversation selection pane and the main conversation area.
- Making incoming and outgoing messages level 4 and 5 headings respectively.
- Automatic announcement of new incoming and outgoing messages for the currently selected conversation.

## Miniflux Accessibility Fixes

[Download Miniflux Accessibility Fixes](https://github.com/Neurrone/greasemonkey-scripts/raw/master/miniflux%20a11y%20fixes.user.js)

This script improves the accessibility of [Miniflux](https://reader.miniflux.app) by:

- Adding the list and list item roles to feed items for convenient navigation
- Removing list roles / semantics which aren't important and would prevent efficient navigation via list elements
