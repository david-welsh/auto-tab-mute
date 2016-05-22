/*
 *
 *
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


chrome.storage.sync.get("extension_enabled", function (storedExtensionEnabled) {
	if (!storedExtensionEnabled) {
		extensionEnabled = false;
		chrome.storage.sync.set({"extension_enabled": false}, null);
	} else {
		extensionEnabled = storedExtensionEnabled;
	}
	updateAfterToggle();
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	if (extensionEnabled) {
		chrome.tabs.get(activeInfo.tabId, function (currentTab) {
			if (currentTab.audible){
				muteAudibleUnselectedTabs();
			}
		});
	}
});

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

chrome.browserAction.onClicked.addListener(function () {
	extensionEnabled = !extensionEnabled;
	updateAfterToggle();
});
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

