import ActiveTab from "./strategies/ActiveTab";
import TabWhitelist from "./strategies/TabWhitelist";
import Browser from "./Browser";
import MuteUtils from "./MuteUtils";
import MessageType from "./constants";
import Messages from "./Messages";
import Config from "./Config";

export default class Controller {
    constructor() {
        this.selectedTabs = [];
        this.mutingStrategies = [new ActiveTab(), new TabWhitelist()];
        this.active = true;

        this.config = new Config(this);
    }

    init() {
        console.log("initiating controller");

        this.setActiveStrategy(this.mutingStrategies[0]);

        Browser.addMessageListener(request => {
            if (request.type === MessageType.STRATEGY_SELECT) {
                this.selectStrategy(request.selectedStrategy);
            } else if (request.type === MessageType.ADD_SELECTED_TAB) {
                if (!this.selectedTabs.includes(request.tab)) {
                    this.selectedTabs.push(request.tab);
                    if (this.active) {
                        this.activeStrategy.onSelectedTabsChange(this.selectedTabs);
                    }
                }
            } else if (request.type === MessageType.REMOVE_SELECTED_TAB) {
                if (this.selectedTabs.includes(request.tab)) {
                    this.selectedTabs.splice(this.selectedTabs.indexOf(request.tab), 1);
                    if (this.active) {
                        this.activeStrategy.onSelectedTabsChange(this.selectedTabs);
                    }
                }
            } else if (request.type === MessageType.CONFIGURATION_REQUEST) {
                Messages.sendConfigurationResponse({
                    enabled: this.active,
                    activeStrategy: this.activeStrategy,
                    selectedTabs: this.selectedTabs,
                    availableStrategies: this.mutingStrategies
                });
            }
        });

        Browser.addTabRemoveListener(tabId => {
            if (this.selectedTabs.includes(tabId)) {
                this.selectedTabs.splice(this.selectedTabs.indexOf(tabId), 1);
            }
        });
    }

    updateAfterToggle(enabled) {
        Browser.setBadgeText(enabled ? "On" : "Off");
        this.active = enabled;

        if (enabled) {
            this.setActiveStrategy(this.activeStrategy);
        } else {
            this.unsetActiveStrategy();
            MuteUtils.unmuteAll();
        }
    }

    unsetActiveStrategy() {
        Browser.removeTabActivatedListener(this.currentActivationListener);
        Browser.removeTabUpdateListener(this.currentUpdatedListener);
    }

    setActiveStrategy(activeStrategy) {
        this.activeStrategy = activeStrategy;

        this.currentActivationListener = tabInfo => {
            this.activeStrategy.onTabActivated(tabInfo);
        };
        this.currentUpdatedListener = (tabId, changeInfo, updatedTab) => {
            this.activeStrategy.onTabUpdate(tabId, changeInfo, updatedTab);
        };

        if (this.active) {

            Browser.addTabActivatedListener(this.currentActivationListener);
            Browser.addTabUpdateListener(this.currentUpdatedListener);

            this.activeStrategy.onToggle(this.selectedTabs);
        }
    }

    selectStrategy(selectedStrategy) {
        let selection = this.mutingStrategies.find(strategy => strategy.name === selectedStrategy);

        if (selection !== undefined) {
            this.unsetActiveStrategy();
            this.setActiveStrategy(selection);
        }
    }
}
