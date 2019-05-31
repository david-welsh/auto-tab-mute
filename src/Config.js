function Config(configListener) {
    this.extensionEnabled = true;
    this.selectedStrategy = "Active tab";
    this.configListener = configListener;
    this.init();
}

Config.prototype.init = function() {
    let self = this;

    chrome.storage.sync.get(["extension_enabled", "selected_strategy"], function (results) {
        if (!results["extension_enabled"]) {
            self.extensionEnabled = false;
            chrome.storage.sync.set({"extension_enabled": false}, null);
        } else {
            self.extensionEnabled = results["extension_enabled"];
            chrome.browserAction.setBadgeText({
                "text": (self.extensionEnabled ? "On" : "Off")
            });
        }

        if (results["selected_strategy"]) {
            self.configListener.selectStrategy(results["selected_strategy"]);
        }
    });

    chrome.commands.onCommand.addListener(function (command) {
        if (command === "toggle_extension") {
            self.extensionEnabled = !self.extensionEnabled;
            chrome.storage.sync.set({"extension_enabled": self.extensionEnabled}, null);
            self.configListener.updateAfterToggle.call(self.configListener, self.extensionEnabled);
        }
    });

    chrome.runtime.onMessage.addListener(function (request) {
        if (request.type === MessageType.ENABLE_DISABLE) {
            self.extensionEnabled = request.isEnabled;
            chrome.storage.sync.set({"extension_enabled": self.extensionEnabled}, null);
            self.configListener.updateAfterToggle.call(self.configListener, self.extensionEnabled);
        } else if (request.type === MessageType.STRATEGY_SELECT) {
            self.selectedStrategy = request.selectedStrategy;
            chrome.storage.sync.set({"selected_strategy": self.selectedStrategy}, null);
        }
    });
};
