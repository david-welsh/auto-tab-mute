import Browser from "webextension-polyfill";
import { ActiveTabStrategy } from "./ActiveTabStrategy";
import { AllowListStrategy } from "./AllowListStrategy";
import { MutingStrategy } from "./MutingStrategy";
import constants from "../constants";
import { MuteUtils } from "./MuteUtils";
import { MuteAllStrategy } from "./MuteAllStrategy";

const mutingStrategies = new Map<string, MutingStrategy>();
mutingStrategies.set("Active tab", new ActiveTabStrategy());
mutingStrategies.set("Allow list", new AllowListStrategy());
mutingStrategies.set("Mute all", new MuteAllStrategy());

async function getConfig(): Promise<{ enabled: boolean; selectedStrategy: string; onlySelectedWindow: boolean }> {
    const config = await Browser.storage.sync.get(["extension_enabled", "selected_strategy", "onlySelectedWindow"]);
    return {
        enabled: config.extension_enabled,
        selectedStrategy: config.selected_strategy,
        onlySelectedWindow: config.onlySelectedWindow
    };
}

async function getSelectedTabs(): Promise<{ selectedTabs: number[] }> {
    const { selectedTabs } = await Browser.storage.local.get("selectedTabs");
    return {
        selectedTabs
    };
}

getConfig().then(({selectedStrategy, enabled}) => {
    if (selectedStrategy == null) Browser.storage.sync.set({ selected_strategy: "Active tab" });
    if (enabled == null) Browser.storage.sync.set({ extension_enabled: true });
    Browser.action.setBadgeText({
        "text": ((enabled == null || enabled) ? "On" : "Off")
    });
});
getSelectedTabs().then(({selectedTabs}) => {
    if (selectedTabs == null) Browser.storage.local.set({ selectedTabs: [] });
});
Browser.storage.local.set({ availableStrategies: Array.from(mutingStrategies.keys()) })

function toggleExtension(nowEnabled: boolean): void {
    getConfig().then(({selectedStrategy}) => {
        Browser.storage.sync.set({"extension_enabled": nowEnabled})
        if (nowEnabled) {
            mutingStrategies.get(selectedStrategy)?.onToggle();
        } else {
            MuteUtils.unmuteAll();
        }

        Browser.action.setBadgeText({
            "text": (nowEnabled ? "On" : "Off")
        });
    });
}

Browser.tabs.onActivated.addListener(async (tabInfo) => {
    const {enabled, selectedStrategy} = await getConfig();
    if (enabled) {
        const strategy = mutingStrategies.get(selectedStrategy);
        strategy?.onTabActivated(tabInfo);
    }
});
Browser.tabs.onUpdated.addListener(async (tabId, tabInfo, tab) => {
    const {enabled, selectedStrategy} = await getConfig();
    if (enabled) {
        const strategy = mutingStrategies.get(selectedStrategy);
        strategy?.onTabUpdate(tabId, tabInfo, tab);
    }
});
Browser.windows.onFocusChanged.addListener(async (windowId) => {
    const {enabled, selectedStrategy} = await getConfig();

    const currentWindow = (await Browser.storage.local.get("currentWindow")).currentWindow;
    if (windowId < 0) {
        await Browser.storage.local.set({ lastActiveWindow: currentWindow });
    } else {
        await Browser.storage.local.remove("lastActiveWindow");
        await Browser.storage.local.set({ currentWindow: windowId });
    }

    if (enabled) {
        const strategy = mutingStrategies.get(selectedStrategy);
        strategy?.onToggle();
    }
});

Browser.commands.onCommand.addListener((command) => {
    if (command === "toggle_extension") {
        getConfig().then(({enabled}) => {
            toggleExtension(!enabled);
        })
    }
});

Browser.runtime.onMessage.addListener((request) => {
    switch (request.type) {
        case constants.MessageType.STRATEGY_SELECT:
            if (mutingStrategies.has(request.selectedStrategy)) {
                Browser.storage.sync.set({"selected_strategy": request.selectedStrategy});
                mutingStrategies.get(request.selectedStrategy)?.onToggle();
            } else {
                console.warn("Unknown strategy selected: %s", request.selectedStrategy);
            }
            break;
        case constants.MessageType.ADD_SELECTED_TAB:
            getSelectedTabs().then(({selectedTabs}) => {
                if (!selectedTabs?.includes(request.tab)) {
                    const updatedSelectedTabs = [...selectedTabs, request.tab];
                    Browser.storage.local.set({ selectedTabs: updatedSelectedTabs });

                    getConfig().then(({enabled, selectedStrategy}) => {
                        if (enabled) {
                            mutingStrategies.get(selectedStrategy)?.onSelectedTabsChange();
                        }
                    });
                }
            });
            break;
        case constants.MessageType.REMOVE_SELECTED_TAB:
            getSelectedTabs().then(({selectedTabs}) => {
                if (selectedTabs?.includes(request.tab)) {
                    const updatedSelectedTabs = selectedTabs.filter((tab) => tab !== request.tab);
                    Browser.storage.local.set({ selectedTabs: updatedSelectedTabs });

                    getConfig().then(({enabled, selectedStrategy}) => {
                        if (enabled) {
                            mutingStrategies.get(selectedStrategy)?.onSelectedTabsChange();
                        }
                    });
                }
            });
            break;
        case constants.MessageType.ENABLE_DISABLE:
            toggleExtension(request.isEnabled);
            break;
        case constants.MessageType.STRATEGY_SELECT:
            if (mutingStrategies.has(request.selectedStrategy)) {
                Browser.storage.sync.set({"selected_strategy": request.selectedStrategy});
                mutingStrategies.get(request.selectedStrategy)?.onToggle();
            } else {
                console.warn("Unknown strategy selected: %s", request.selectedStrategy);
            }
            break;
        default:
            console.log("Unknown message type: %s", request.type)
            break;
    }
})

Browser.tabs.onRemoved.addListener((tabId) => {
    getSelectedTabs().then(({selectedTabs}) => {
        if (tabId != null && selectedTabs?.includes(tabId)) {
            const updatedSelectedTabs = selectedTabs.filter((tab) => tab !== tabId);
            Browser.storage.local.set({ selectedTabs: updatedSelectedTabs });

            getConfig().then(({enabled, selectedStrategy}) => {
                if (enabled) {
                    mutingStrategies.get(selectedStrategy)?.onSelectedTabsChange();
                }
            });
        }
    });
});
