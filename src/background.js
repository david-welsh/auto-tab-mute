function Controller() {
    this.selectedTabs = [];
    this.mutingStrategies = [new ActiveTab({}), new TabWhitelist({whitelist: this.selectedTabs})];
    this.active = true;
}

Controller.prototype.updateAfterToggle = function (enabled) {
    chrome.browserAction.setBadgeText({
        "text": (enabled ? "On" : "Off")
    });
    this.active = enabled;

    if (enabled) {
        this.setActiveStrategy(this.activeStrategy);
    } else {
        this.unsetActiveStrategy();
        MuteUtils.unmuteAll();
    }
};

Controller.prototype.init = function () {
    let self = this;

    this.setActiveStrategy(this.mutingStrategies[0]);

    chrome.runtime.onMessage.addListener(function (request) {
        if (request.type === MessageType.STRATEGY_SELECT) {
            self.selectStrategy(request.selectedStrategy);
        } else if (request.type === MessageType.ADD_SELECTED_TAB) {
            if (!self.selectedTabs.includes(request.tab)) {
                self.selectedTabs.push(request.tab);
                if (self.active) {
                    self.activeStrategy.onSelectedTabsChange(self.selectedTabs);
                }
            }
        } else if (request.type === MessageType.REMOVE_SELECTED_TAB) {
            if (self.selectedTabs.includes(request.tab)) {
                self.selectedTabs.splice(self.selectedTabs.indexOf(request.tab), 1);
                if (self.active) {
                    self.activeStrategy.onSelectedTabsChange(self.selectedTabs);
                }
            }
        } else if (request.type === MessageType.CONFIGURATION_REQUEST) {
            Messaging.sendConfigurationResponse({
                enabled: self.active,
                activeStrategy: self.activeStrategy,
                selectedTabs: self.selectedTabs,
                availableStrategies: self.mutingStrategies
            });
        }
    });

    chrome.tabs.onRemoved.addListener(function(tabId) {
        if (self.selectedTabs.includes(tabId)) {
            self.selectedTabs.splice(self.selectedTabs.indexOf(tabId), 1);
        }
    });
};

Controller.prototype.unsetActiveStrategy = function() {
    chrome.tabs.onActivated.removeListener(this.currentActivationListener);
    chrome.tabs.onUpdated.removeListener(this.currentUpdatedListener);
};

Controller.prototype.setActiveStrategy = function(activeStrategy) {
    this.activeStrategy = activeStrategy;
    let self = this;

    this.currentActivationListener = function(tabInfo) {
        setTimeout(() => self.activeStrategy.onTabActivated(tabInfo), 100);
        setTimeout(() => self.activeStrategy.onTabActivated(tabInfo), 250);
        setTimeout(() => self.activeStrategy.onTabActivated(tabInfo), 500);
        setTimeout(() => self.activeStrategy.onTabActivated(tabInfo), 1000);
    };
    this.currentUpdatedListener = function(tabId, changeInfo, updatedTab) {
        self.activeStrategy.onTabUpdate(tabId, changeInfo, updatedTab);
    };

    if (self.active) {
        chrome.tabs.onActivated.addListener(this.currentActivationListener);
        chrome.tabs.onUpdated.addListener(this.currentUpdatedListener);

        self.activeStrategy.onToggle(self.selectedTabs);
    }
};

Controller.prototype.selectStrategy = function(selectedStrategy) {
    let selection = this.mutingStrategies.find(strategy => strategy.name === selectedStrategy);

    if (selection !== undefined) {
        this.unsetActiveStrategy();
        this.setActiveStrategy(selection);
    }
};

const controller = new Controller();
new Config(controller);

controller.init();