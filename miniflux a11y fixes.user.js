// ==UserScript==
// @name           Miniflux accessibility fixes
// @description    Improves the accessibility of the Miniflux rss reader
// @author         Neurrone
// @copyright 2020
// @license GNU General Public License version 2.0
// @version        1.0
// @grant GM_log
// @include https://reader.miniflux.app/*
// ==/UserScript==

/*** Code to apply the tweaks when appropriate. ***/

function applyTweak(el, tweak) {
	if (Array.isArray(tweak.tweak)) {
		let [func, ...args] = tweak.tweak;
		func(el, ...args);
	} else {
		tweak.tweak(el);
	}
}

function applyTweaks(root, tweaks, checkRoot) {
	for (let tweak of tweaks) {
		for (let el of root.querySelectorAll(tweak.selector)) {
			try {
				applyTweak(el, tweak);
			} catch (e) {
				console.log("Exception while applying tweak for '" + tweak.selector + "': " + e);
			}
		}
		if (checkRoot && root.matches(tweak.selector)) {
			try {
				applyTweak(root, tweak);
			} catch (e) {
				console.log("Exception while applying tweak for '" + tweak.selector + "': " + e);
			}
		}
	}
}

let observer = new MutationObserver(function(mutations) {
	for (let mutation of mutations) {
		try {
			if (mutation.type === "childList") {
				for (let node of mutation.addedNodes) {
					if (node.nodeType != Node.ELEMENT_NODE) {
						continue;
					}
					applyTweaks(node, DYNAMIC_TWEAKS, true);
				}
			} else if (mutation.type === "attributes") {
				applyTweaks(mutation.target, DYNAMIC_TWEAKS, true);
			}
		} catch (e) {
			// Catch exceptions for individual mutations so other mutations are still handled.
			console.log("Exception while handling mutation: " + e);
		}
	}
});

function init() {
	applyTweaks(document, LOAD_TWEAKS, false);
	applyTweaks(document, DYNAMIC_TWEAKS, false);
	options = {childList: true, subtree: true};
	if (DYNAMIC_TWEAK_ATTRIBS.length > 0) {
		options.attributes = true;
		options.attributeFilter = DYNAMIC_TWEAK_ATTRIBS;
	}
	observer.observe(document, options);
}

/*** Define the actual tweaks. ***/

// Tweaks that only need to be applied on load.
const LOAD_TWEAKS = [
];

// Attributes that should be watched for changes and cause dynamic tweaks to be
// applied.
const DYNAMIC_TWEAK_ATTRIBS = [
];

// Tweaks that must be applied whenever an element is added/changed.
const DYNAMIC_TWEAKS = [
    {
        selector: 'div.items',
        tweak: ele => {
            ele.setAttribute("role", "list");
        }
    },
    {
        selector: 'div.items > *',
        tweak: ele => {
            ele.setAttribute("role", "listitem");
        }
    },
    // nuke ul and list roles for possible actions (e.g, edit, delete)
    {
        selector: 'ul.item-meta-info, ul.item-meta-icons',
        tweak: ele => {
            ele.setAttribute("role", "presentation");
        }
    },
    {
        selector: 'ul.item-meta-info>*, ul.item-meta-icons>*',
        tweak: ele => {
            ele.setAttribute("role", "presentation");
        }
    }
];

/*** Lights, camera, action! ***/
init();