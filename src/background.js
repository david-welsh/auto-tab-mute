/*
 *	Auto Tab Mute
 *
 *	Chrome extension for automatically muting background tabs
 *
 *	Author: David Welsh
 */

var extensionEnabled;
 
var muteAudibleUnselectedTabs = function () {
	chrome.tabs.query({audible: true}, function (tabs) {
		tabs.forEach(function (tab) {
			if (!tab.highlighted && tab.audible) {
				chrome.tabs.update(tab.id, {muted: true});
			} else {
				chrome.tabs.update(tab.id, {muted: false});
			}
		});		
	});
};

var updateAfterToggle = function () {
	chrome.browserAction.setBadgeText({
		"text": (extensionEnabled ? "On" : "Off")
	});
	
	if (extensionEnabled) {
		chrome.tabs.query({highlighted: true}, function (currentTabs) {
			currentTabs.forEach( function(currentTab) {
				if (currentTab.audible) {
					muteAudibleUnselectedTabs();
				}
			});
		});
	}
	
	chrome.storage.sync.set({"extension_enabled": extensionEnabled}, null);
};

// Manage storage of variable to determine if the extension is enabled/disabled
chrome.storage.sync.get("extension_enabled", function (storedExtensionEnabled) {
	if (!storedExtensionEnabled) {
		extensionEnabled = false;
		chrome.storage.sync.set({"extension_enabled": false}, null);
	} else {
		extensionEnabled = storedExtensionEnabled;
	}
	updateAfterToggle();
});

// Check muting on changing tabs
chrome.tabs.onActivated.addListener(function (activeInfo) {
	if (extensionEnabled) {
		chrome.tabs.get(activeInfo.tabId, function (currentTab) {
			if (currentTab.audible){
				muteAudibleUnselectedTabs();
			}
		});
	}
});

// Check muting on update to any tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
	if (extensionEnabled && changeInfo.audible) {
		if (updatedTab.highlighted) {
			muteAudibleUnselectedTabs();
		} else {
			// Mute a background tab that has become audible
			// only if highlighted tab is audible
			chrome.tabs.query({highlighted: true}, function (currentTabs) {
				currentTabs.forEach( function(currentTab) {
					if (currentTab.audible) {
						chrome.tabs.update(updatedTab.id, {muted: true});
					}
				});
			});
		}
	}
});

// Toggle on/off with button clicked
chrome.browserAction.onClicked.addListener(function () {
	extensionEnabled = !extensionEnabled;
	updateAfterToggle();
});

// Toggle on/off with keyboard shortcut
chrome.commands.onCommand.addListener(function(command) {
	switch (command) {
		case "toggle_extension":
			extensionEnabled = !extensionEnabled;
			updateAfterToggle();
			break;
		default:
			break;
	}
});

