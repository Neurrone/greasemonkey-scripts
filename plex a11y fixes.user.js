// ==UserScript==
// @name Plex Accessibility Fixes
// @description    Improves the accessibility of Plex.
// @author         Dickson Tan
// @copyright 2022 Dickson Tan
// @license Mozilla Public License version 2.0
// @version        0.1
// @include https://app.plex.tv/desktop/*
// ==/UserScript==

/*
 * These utility functions were lifted from James Teh's framework which simplifies many common tasks
 * See https://github.com/jcsteh/axSGrease/tree/master/framework
 */

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

const fixArtistToolbar = (el) => {
  makeRegion(el, "Artist Tool Bar");
  setLabel(
    el.querySelector('a[data-testid="toolbarPrevious"]'),
    "Previous Album"
  );
  setLabel(el.querySelector('a[data-testid="toolbarNext"]'), "Next Album");
  setLabel(
    el.querySelector('button[class*="ToolbarButton-toolbarButton"]'),
    "Albums"
  );
};

const menuKeyboardNavigation = (event) => {
  const key = event.key;
  const focused = document.activeElement;
  // menu items are buttons or links
  const possibleMenuItemElements = ["BUTTON", "A"];

  switch (key) {
    case "ArrowDown":
    case "Down": {
      event.stopPropagation(); // prevent decreases in volume caused by down arrow
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
      event.stopPropagation(); // prevent increases in volume caused by up arrow
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
    default: {
      const isKeyEligibleForFirstLetterNav =
        key.length === 1 && key.match(/[a-zA-Z0-9]/);

      if (
        !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) &&
        isKeyEligibleForFirstLetterNav
      ) {
        // Prevent triggering a built-in Plex shortcut
        event.stopPropagation();
        const normalizedKey = key.toLowerCase();

        let nextItem = focused.nextElementSibling;
        // skip of <div> menu separators between menu items,
        // and find an item with a label that matches the key pressed
        while (
          nextItem &&
          (!possibleMenuItemElements.includes(nextItem.nodeName) ||
            nextItem.innerText.toLowerCase()[0] !== normalizedKey)
        ) {
          nextItem = nextItem.nextElementSibling;
        }
        if (nextItem && nextItem.innerText.toLowerCase()[0] === normalizedKey) {
          nextItem.focus();
        }
      }
      break;
    }
  }
};

const fixAlbumListTable = (el) => {
  el.setAttribute("role", "table");
  for (let row of el.querySelectorAll("div[class*=ListRow-row]")) {
    row.setAttribute("role", "row");
  }

  for (let col of el.querySelectorAll("div[class*=ListRow-row] > div")) {
    col.setAttribute("role", "cell");
  }
};

const fixPlaylistTable = (el) => {
  el.setAttribute("role", "table");
  for (let child of el.childNodes) {
    child.setAttribute("role", "presentation");
  }

  for (let node of el.querySelectorAll(
    "div > div[class*=PlaylistItemDragSource-container]"
  )) {
    node.setAttribute("role", "presentation");
  }
  for (let node of el.querySelectorAll(
    "div > div[class*=PlaylistItemDragSource-container] > div[class*=PlaylistItemRow-container]"
  )) {
    node.setAttribute("role", "row");
  }
  for (let node of el.querySelectorAll(
    "div > div[class*=PlaylistItemDragSource-container] > div[class*=PlaylistItemRow-container] > div[class*=PlaylistItemRow-overlay]"
  )) {
    node.setAttribute("role", "presentation");
  }
  for (let node of el.querySelectorAll(
    "div > div[class*=PlaylistItemDragSource-container] > div[class*=PlaylistItemRow-container] > div[class*=PlaylistItemRow-overlay] > div"
  )) {
    node.setAttribute("role", "cell");
  }
};

const fixPlayQueueTable = (el) => {
  el.setAttribute("role", "table");
  for (let node of el.querySelectorAll(
    "div[class*=AudioVideoPlayQueueItemDragSource-container]"
  )) {
    node.setAttribute("role", "presentation");
  }

  for (let row of el.querySelectorAll(
    "div[class*=AudioVideoPlayQueueItem-container]"
  )) {
    row.setAttribute("role", "row");
  }

  for (let col of el.querySelectorAll(
    "div[class*=AudioVideoPlayQueueItem-container] > div"
  )) {
    col.setAttribute("role", "cell");
  }
};

const fixLibraryContentsTable = (el) => {
  console.log("fixing library contents table");
  el.setAttribute("role", "table");

  const header = el.querySelector(
    "div[class*=DirectoryListTableHeader-tableHeader"
  );
  header.setAttribute("role", "row");
  for (let col of header.childNodes) {
    col.setAttribute("role", "columnheader");
  }

  const rows = header.nextElementSibling;
  console.log("setting rowgroup");
  rows.setAttribute("role", "rowgroup");
  for (let row of rows.querySelectorAll("div[class*=ListRow]")) {
    row.setAttribute("role", "row");
    for (let cell of row.childNodes) {
      cell.setAttribute("role", "cell");
    }
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
  /* Fix artist album navigation toolbar */
  {
    selector:
      'div[class*="PageHeaderRight-pageHeaderRight"] a[data-testid="toolbarPrevious"]',
    tweak: (el) => {
      fixArtistToolbar(el.parentNode);
    },
  },
  /* Make the player controls area a labelled region */
  {
    selector: 'div[class*="Player-miniPlayerContainer"]',
    tweak: (el) => {
      makeRegion(el, "Playback Controls");
    },
  },
  /* Add labels to the seek and volume progress bars */
  {
    selector: 'div[class*="SeekBar-seekBar"] button[role=slider]',
    tweak: (el) => {
      setLabel(el, "Seek");
    },
  },
  {
    selector: 'div[class*="PlayerControls-volumeSlider"] button[role=slider]',
    tweak: (el) => {
      setLabel(el, "Volume");
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
  /* Indicate which view is active on the library page */
  {
    selector: 'a[class*="PivotTab-button"]',
    tweak: (el) => {
      if (el.className.includes("PivotTab-selectedButton")) {
        el.setAttribute("aria-current", "page");
      } else {
        el.setAttribute("aria-current", "false");
      }
    },
  },
  /* Add keyboard navigation in menus */
  {
    selector: 'div[class*="Menu-menuScroller"]',
    tweak: (el) => {
      const firstItem = el.querySelector(
        // menu items are buttons or links
        'button[role="menuitem"], a[role="menuitem"]'
      );
      firstItem.focus();
      el.addEventListener("keydown", menuKeyboardNavigation);
    },
  },
  /* Make pseudo-tables look like real tables via aria */
  {
    selector: 'div[class*="AlbumDisc-trackList"]',
    tweak: [fixAlbumListTable],
  },
  {
    selector: 'div[class*="PrePlayListTopDivider-topDivider"] + div',
    tweak: [fixPlaylistTable],
  },
  {
    selector: 'div[class*="AudioVideoPlayQueue-content"]',
    tweak: [fixPlayQueueTable],
  },
  /*
  // commented out because it doesn't seem to work with the virtualized table
  {
    selector: "div[class*=DirectoryListTableHeader-tableHeader] + div",
    tweak: (el) => {
      fixLibraryContentsTable(el.parentNode);
    },
  },
  */
];

/*** Lights, camera, action! ***/
init();
