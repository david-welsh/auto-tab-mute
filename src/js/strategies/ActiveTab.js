import Browser from "../Browser";
import MuteUtils from "../MuteUtils";

export default class ActiveTab {
    constructor() {
        this.name = "Active tab";
    }

    onToggle() {
        Browser.queryTabs({highlighted: true}, function (currentTabs) {
            currentTabs.forEach(function (currentTab) {
                if (currentTab.audible) {
                    MuteUtils.muteAudibleUnselectedTabs();
                }
            });
        });
    }

    onTabUpdate(tabId, changeInfo, updatedTab) {
        if (changeInfo.audible) {
            if (updatedTab.highlighted) {
                MuteUtils.muteAudibleUnselectedTabs();
            } else {
                MuteUtils.muteBackgroundTabIfSelectedIsAudible(updatedTab.id)
            }
        }
    }

    onTabActivated(tabInfo) {
        Browser.getTab(tabInfo.tabId, function (currentTab) {
            if (currentTab.audible) {
                MuteUtils.muteAudibleUnselectedTabs();
            }
        });
    }

    onSelectedTabsChange() {
    }
}
