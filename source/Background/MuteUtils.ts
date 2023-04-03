import Browser from "webextension-polyfill";

export class MuteUtils {
    static muteAudibleTabs(exclusions: (undefined | number)[]): void {
        this.getAudibleTabs().then((tabs) => {
            tabs.forEach((tab) => {
                if (tab.id != null) {
                    if (exclusions?.includes(tab.id)) {
                        this.unmuteTab(tab.id);
                    } else {
                        this.muteTab(tab.id);
                    }
                }
            });
        });
    }

    static muteAudibleUnselectedTabs(onlySelectedWindow: boolean = false): void {
        this.getHighlightedTabs(onlySelectedWindow).then((tabs) => {
            this.muteAudibleTabs(tabs.map(tab => tab.id))
        });
    }

    static muteBackgroundTabIfSelectedIsAudible(backgroundTabId: number, onlySelectedWindow: boolean = false): void {
        this.getHighlightedTabs(onlySelectedWindow).then((tabs) => {
            tabs.forEach((tab) => {
                if (tab.audible) {
                    this.muteTab(backgroundTabId);
                }
            });
        });
    }

    static unmuteAll(): void {
        Browser.tabs.query({}).then((tabs) => {
            tabs.forEach((tab) => {
                if (tab.id != null) {
                    this.unmuteTab(tab.id);
                }
            });
        });
    }

    static muteAll(): void {
        Browser.tabs.query({}).then((tabs) => {
            tabs.forEach((tab) => {
                if (tab.id != null) {
                    this.muteTab(tab.id);
                }
            });
        });
    }

    private static getHighlightedTabs(onlySelectedWindow: boolean): Promise<Browser.Tabs.Tab[]> {
        if (onlySelectedWindow) {
            return Browser.tabs.query({highlighted: true}).then(async (tabs) => {
                const lastActiveWindow = (await Browser.storage.local.get("lastActiveWindow")).lastActiveWindow;
                const filtered = await this.asyncFilter(tabs, async (tab) => {
                    const window = await Browser.windows.get(tab.windowId!)
                    return (window.focused || tab.windowId == lastActiveWindow) && tab.audible!;
                });
                if (filtered.length === 0) return tabs;
                return filtered;
            });
        } else {
            return Browser.tabs.query({highlighted: true});
        }
    }

    private static getAudibleTabs(): Promise<Browser.Tabs.Tab[]> {
        return Browser.tabs.query({audible: true});
    }

    private static muteTab(tabId: number): void { this.setTabMuted(tabId, true); }
    private static unmuteTab(tabId: number): void { this.setTabMuted(tabId, false); }

    private static setTabMuted(tabId: number, muted: boolean): void {
        Browser.tabs.update(tabId, {muted: muted});
    }

    private static async asyncFilter<T>(arr: T[], predicate: (a: T) => Promise<boolean>) {
        const results = await Promise.all(arr.map(predicate));
        return arr.filter((_v, index) => results[index]);
    }
}