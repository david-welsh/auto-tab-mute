import Browser, { Tabs } from "webextension-polyfill";
import { MutingStrategy } from "./MutingStrategy";
import { MuteUtils } from "./MuteUtils";

export class ActiveTabStrategy extends MutingStrategy {
    onTabActivated(tabInfo: Tabs.OnActivatedActiveInfoType): void {
        Browser.tabs.get(tabInfo.tabId).then((currentTab) => {
            if (currentTab.audible) {
                Browser.storage.sync.get("onlySelectedWindow").then(({onlySelectedWindow}) => {
                    MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
                });
            }
        });
    }
    onTabUpdate(_: number, tabInfo: Tabs.OnUpdatedChangeInfoType, tab: Browser.Tabs.Tab): void {
        if (tabInfo.audible) {
            Browser.storage.sync.get("onlySelectedWindow").then(({onlySelectedWindow}) => {
                if (tab.highlighted) {
                    MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
                } else {
                    MuteUtils.muteBackgroundTabIfSelectedIsAudible(tab.id!, onlySelectedWindow);
                }
            });
        }
    }
    onToggle(): void {
        Browser.tabs.query({highlighted: true}).then((tabs) => {
            Browser.storage.sync.get("onlySelectedWindow").then(({onlySelectedWindow}) => {
                tabs.forEach((tab) => {
                    if (tab.audible) {
                        MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
                    }
                })
            });
        });
    }
    onSelectedTabsChange(): void {}
}