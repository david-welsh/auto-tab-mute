import Browser from "./Browser";
import MessageType from "./constants";

export default class Config {
    constructor(configListener) {
        this.configListener = configListener;
        this.extensionEnabled = true;
        this.selectedStrategy = "Active tab";

        this.init();
    }

    init() {
        Browser.getValues(["extension_enabled", "selected_strategy"], results => {
            if (!results["extension_enabled"]) {
                this.extensionEnabled = false;
                Browser.storeValue("extension_enabled", false);
            } else {
                this.extensionEnabled = results["extension_enabled"];
                Browser.setBadgeText(this.extensionEnabled ? "On" : "Off");
            }

            if (results["selected_strategy"]) {
                this.configListener.selectStrategy(results["selected_strategy"]);
            }
        });

        Browser.addCommandListener(command => {
            if (command === "toggle_extension") {
                this.extensionEnabled = !this.extensionEnabled;
                Browser.storeValue("extension_enabled", this.extensionEnabled);
                this.configListener.updateAfterToggle.call(this.configListener, this.extensionEnabled);
            }
        });

        Browser.addMessageListener(request => {
            if (request.type === MessageType.ENABLE_DISABLE) {
                this.extensionEnabled = request.isEnabled;
                Browser.storeValue("extension_enabled", this.extensionEnabled);
                this.configListener.updateAfterToggle.call(this.configListener, this.extensionEnabled);
            } else if (request.type === MessageType.STRATEGY_SELECT) {
                this.selectedStrategy = request.selectedStrategy;
                Browser.storeValue("selected_strategy", this.selectedStrategy);
            }
        });
    }
}
