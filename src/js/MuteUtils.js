import Browser from "./Browser";

export default class MuteUtils {
    static muteAudibleTabs(exclusions) {
        Browser.queryTabs({audible: true}, function (tabs) {
            tabs.forEach(function (tab) {
                if (!(exclusions.includes(tab.id) || exclusions === tab.id)) {
                    Browser.updateTab(tab.id, {muted: true});
                } else {
                    Browser.updateTab(tab.id, {muted: false});
                }
            });
        })
    }

    static muteAudibleUnselectedTabs() {
        Browser.queryTabs({highlighted: true}, function (tabs) {
            MuteUtils.muteAudibleTabs(tabs.map(value => value.id));
        });
    }

    static muteBackgroundTabIfSelectedIsAudible(backgroundTabId) {
        Browser.queryTabs({highlighted: true}, function (currentTabs) {
            currentTabs.forEach(function (currentTab) {
                if (currentTab.audible) {
                    Browser.updateTab(backgroundTabId, {muted: true});
                }
            });
        });
    }

    static unmuteAll() {
        Browser.queryTabs({}, function (allTabs) {
            allTabs.forEach(function (tab) {
                Browser.updateTab(tab.id, {muted: false});
            });
        });
    }
}
