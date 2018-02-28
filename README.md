# Greasemonkey Scripts

This is a set of Greasemonkey scripts to fix accessibility problems with various websites, inspired by the [axSGrease project](https://github.com/nvaccess/axSGrease).

## Installation

Before you can install any of these scripts, you must first install a user script manager for your browser.
For Firefox, you can install [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Note that at the time of writing, the release version, v4.2, has a bug that prevents  installation of scripts hosted on GitHub. If you're experiencing this, [download the latest beta of v4.3](https://addons.mozilla.org/firefox/addon/greasemonkey/versions/beta); [refer to this issue for details](https://github.com/greasemonkey/greasemonkey/issues/2631).

For Chrome, you can install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
There are also user script managers for other browsers.
See [Greasy Fork's page on   user script installations](https://greasyfork.org/en/help/installing-user-scripts) for more details.

After installing a user script manager,  activate the link for each script to install it.

## WhatsApp Web Accessibility Fixes

[Download WhatsApp Web Accessibility Fixes](https://github.com/Neurrone/greasemonkey-scripts/raw/master/whatsApp%20Web%20a11y%20fixes.user.js)

This script improves the accessibility of [WhatsApp Web](https://web.whatsapp.com) by:

* Adding regions around the conversation selection pane and the main conversation area.
* Making incoming and outgoing messages level 4 and 5 headings respectively.
* Automatic announcement of new incoming and outgoing messages for the currently selected conversation.