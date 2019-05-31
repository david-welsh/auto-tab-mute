const MuteUtils = {
    muteAudibleTabs: function(exclusions) {
        chrome.tabs.query({audible: true}, function (tabs) {
            tabs.forEach(function (tab) {
                if (!(exclusions.includes(tab.id) || exclusions === tab.id)) {
                    chrome.tabs.update(tab.id, {muted: true});
                } else {
                    chrome.tabs.update(tab.id, {muted: false});
                }
            });
        })
    },

    muteAudibleUnselectedTabs: function () {
        chrome.tabs.query({highlighted: true}, function (tabs) {
            MuteUtils.muteAudibleTabs(tabs.map(value => value.id));
        });
    },

    muteBackgroundTabIfSelectedIsAudible: function(backgroundTabId) {
        chrome.tabs.query({highlighted: true}, function (currentTabs) {
            currentTabs.forEach(function (currentTab) {
                if (currentTab.audible) {
                    chrome.tabs.update(backgroundTabId, {muted: true});
                }
            });
        });
    },

    unmuteAll: function() {
        chrome.tabs.query({}, function (allTabs) {
            allTabs.forEach(function (tab) {
                chrome.tabs.update(tab.id, {muted: false});
            });
        });
    }
};