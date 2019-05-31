function ActiveTab() {
    this.name = "Active tab";
}

ActiveTab.prototype.onToggle = function() {
    chrome.tabs.query({highlighted: true}, function (currentTabs) {
        currentTabs.forEach(function (currentTab) {
            if (currentTab.audible) {
                MuteUtils.muteAudibleUnselectedTabs();
            }
        });
    });
};

ActiveTab.prototype.onTabUpdate = function(tabId, changeInfo, updatedTab) {
    if (changeInfo.audible) {
        if (updatedTab.highlighted) {
            MuteUtils.muteAudibleUnselectedTabs();
        } else {
            MuteUtils.muteBackgroundTabIfSelectedIsAudible(updatedTab.id)
        }
    }
};

ActiveTab.prototype.onTabActivated = function(tabInfo) {
    chrome.tabs.get(tabInfo.tabId, function (currentTab) {
        if (currentTab.audible) {
            MuteUtils.muteAudibleUnselectedTabs();
        }
    });
};

ActiveTab.prototype.onSelectedTabsChange = function() {
};



function TabWhitelist() {
    this.whitelist = [];
    this.name = "Whitelist";
}

TabWhitelist.prototype.onToggle = function(whitelist) {
    this.onSelectedTabsChange(whitelist);
};

TabWhitelist.prototype.onTabUpdate = function() {
    MuteUtils.muteAudibleTabs(this.whitelist);
};

TabWhitelist.prototype.onTabActivated = function() {
    MuteUtils.muteAudibleTabs(this.whitelist);
};

TabWhitelist.prototype.onSelectedTabsChange = function(whitelist) {
    this.whitelist = whitelist;
    MuteUtils.muteAudibleTabs(whitelist);
};
