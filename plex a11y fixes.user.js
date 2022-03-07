// ==UserScript==
// @name Plex Accessibility Fixes
// @description    Improves the accessibility of Plex.
// @author         Dickson Tan
// @copyright 2022 Dickson Tan
// @license Mozilla Public License version 2.0
// @version        0.1
// @include https://app.plex.tv/desktop/*
// ==/UserScript==

/*** Functions for common tweaks. ***/

function makeHeading(el, level) {
  el.setAttribute("role", "heading");
  el.setAttribute("aria-level", level);
}

function makeRegion(el, label) {
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", label);
}

function makeButton(el, label) {
  el.setAttribute("role", "button");
  if (label) {
    el.setAttribute("aria-label", label);
  }
}

function makePresentational(el) {
  el.setAttribute("role", "presentation");
}

function setLabel(el, label) {
  el.setAttribute("aria-label", label);
}

function makeHidden(el) {
  el.setAttribute("aria-hidden", "true");
}

function setExpanded(el, expanded) {
  el.setAttribute("aria-expanded", expanded ? "true" : "false");
}

var idCounter = 0;
// Get a node's id. If it doesn't have one, make and set one first.
function setAriaIdIfNecessary(elem) {
  if (!elem.id) {
    elem.setAttribute("id", "axsg-" + idCounter++);
  }
  return elem.id;
}

function makeElementOwn(parentElement, listOfNodes) {
  ids = [];
  for (let node of listOfNodes) {
    ids.push(setAriaIdIfNecessary(node));
  }
  parentElement.setAttribute("aria-owns", ids.join(" "));
}

// Focus something even if it wasn't made focusable by the author.
function forceFocus(el) {
  let focusable = el.hasAttribute("tabindex");
  if (focusable) {
    el.focus();
    return;
  }
  el.setAttribute("tabindex", "-1");
  el.focus();
}

/*** Code to apply the tweaks when appropriate. ***/

function applyTweak(el, tweak) {
  if (Array.isArray(tweak.tweak)) {
    let [func, ...args] = tweak.tweak;
    func(el, ...args);
  } else {
    tweak.tweak(el);
  }
}

function applyTweaks(root, tweaks, checkRoot, forAttrChange = false) {
  for (let tweak of tweaks) {
    if (!forAttrChange || tweak.whenAttrChangedOnAncestor !== false) {
      for (let el of root.querySelectorAll(tweak.selector)) {
        try {
          applyTweak(el, tweak);
        } catch (e) {
          console.log(
            "Exception while applying tweak for '" + tweak.selector + "': " + e
          );
        }
      }
    }
    if (checkRoot && root.matches(tweak.selector)) {
      try {
        applyTweak(root, tweak);
      } catch (e) {
        console.log(
          "Exception while applying tweak for '" + tweak.selector + "': " + e
        );
      }
    }
  }
}

let observer = new MutationObserver(function (mutations) {
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
        applyTweaks(mutation.target, DYNAMIC_TWEAKS, true, true);
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
  options = { childList: true, subtree: true };
  if (DYNAMIC_TWEAK_ATTRIBS.length > 0) {
    options.attributes = true;
    options.attributeFilter = DYNAMIC_TWEAK_ATTRIBS;
  }
  observer.observe(document, options);
}

const menuKeyboardNavigation = (event) => {
  const key = event.key;
  const focused = document.activeElement;
  // menu items are buttons or links
  const possibleMenuItemElements = ["BUTTON", "A"];

  switch (key) {
    case "ArrowDown":
    case "Down": {
      let nextItem = focused.nextElementSibling;
      // skip of <div> menu separators between menu items
      while (
        nextItem &&
        !possibleMenuItemElements.includes(nextItem.nodeName)
      ) {
        nextItem = nextItem.nextElementSibling;
      }
      if (nextItem) {
        nextItem.focus();
      }
      break;
    }
    case "ArrowUp":
    case "Up": {
      let prevItem = focused.previousElementSibling;
      // skip of <div> menu separators between menu items
      while (
        prevItem &&
        !possibleMenuItemElements.includes(prevItem.nodeName)
      ) {
        prevItem = prevItem.previousElementSibling;
      }
      if (prevItem) {
        prevItem.focus();
      }
      break;
    }
    case "Home": {
      focused.parentNode.firstChild.focus();
      break;
    }
    case "End": {
      focused.parentNode.lastChild.focus();
      break;
    }
    default:
      break;
  }
};

/*** Define the actual tweaks. ***/

// Tweaks that only need to be applied on load.
const LOAD_TWEAKS = [];

// Attributes that should be watched for changes and cause dynamic tweaks to be
// applied.
const DYNAMIC_TWEAK_ATTRIBS = ["class"];

// Tweaks that must be applied whenever an element is added/changed.
const DYNAMIC_TWEAKS = [
  /* Make the navigation sidebar and main content easier to find */
  {
    selector: 'div[class*="SourceSidebar-openSidebar"]',
    tweak: (el) => {
      el.setAttribute("role", "navigation");
      el.setAttribute("aria-label", "Libraries");
    },
  },
  {
    selector: 'div[class*="Page-pageScroller"]',
    tweak: (el) => {
      el.setAttribute("role", "main");
    },
  },
  /* Add missing labels to buttons for playback of music albums */
  {
    selector: 'button[data-testid="preplay-shuffle"]',
    tweak: [setLabel, "Shuffle"],
  },
  {
    selector: 'button[data-testid="preplay-addToPlaylist"]',
    tweak: [setLabel, "Add To..."],
  },
  {
    selector: 'button[data-testid="preplay-edit"]',
    tweak: [setLabel, "Edit"],
  },
  {
    selector: 'button[data-testid="preplay-more"]',
    tweak: [setLabel, "More"],
  },
  /* Make the selection toolbar easier to find */
  {
    selector: 'div[class*="PageHeaderMultiselectActions-container"]',
    tweak: (el) => {
      el.setAttribute("role", "navigation");
      el.setAttribute("aria-label", "Selection Toolbar");
    },
  },
  /* Add missing labels to buttons on selected items toolbar */
  {
    selector: 'svg[id*="plex-icon-toolbar-play"]',
    tweak: (el) => {
      setLabel(el.parentNode, "Play");
    },
  },
  {
    selector: 'svg[id*="plex-icon-toolbar-add-to-playlist"]',
    tweak: (el) => {
      setLabel(el.parentNode, "Add To...");
    },
  },
  {
    selector: 'svg[id*="plex-icon-toolbar-edit"]',
    tweak: (el) => {
      setLabel(el.parentNode, "Edit");
    },
  },
  {
    selector: 'svg[id*="plex-icon-toolbar-more"]',
    tweak: (el) => {
      setLabel(el.parentNode, "More");
    },
  },
  /* Make the deselect button visible to screen readers */
  {
    selector:
      'div[class*="MetadataTableRow-selectedListRow"] button[class*="RowSelectButton-selectButton"]',
    tweak: (el) => {
      el.setAttribute("aria-hidden", "false");
    },
  },
  /* Add keyboard navigation in menus */
  {
    selector: 'div[class*="Menu-menuScroller"]',
    tweak: (el) => {
      const firstItem = el.querySelector('button[role="menuitem"]');
      firstItem.focus();
      el.addEventListener("keydown", menuKeyboardNavigation);
    },
  },
];

/*** Lights, camera, action! ***/
init();
