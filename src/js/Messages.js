import Browser from "./Browser";
import constants from "./constants";

export default class Messaging {
    static sendEnableDisable(enabled) {
        Messaging.sendMessage(constants.MessageType.ENABLE_DISABLE, {isEnabled: enabled});
    }

    static sendStrategySelect(strategy) {
        Messaging.sendMessage(constants.MessageType.STRATEGY_SELECT, {selectedStrategy: strategy});
    }

    static sendAddSelectedTab(tabId) {
        Messaging.sendMessage(constants.MessageType.ADD_SELECTED_TAB, {tab: tabId});
    }

    static sendRemoveSelectedTab(tabId) {
        Messaging.sendMessage(constants.MessageType.REMOVE_SELECTED_TAB, {tab: tabId});
    }

    static sendConfigurationRequest() {
        Messaging.sendMessage(constants.MessageType.CONFIGURATION_REQUEST);
    }

    static sendConfigurationResponse(configuration) {
        Messaging.sendMessage(constants.MessageType.CONFIGURATION_RESPONSE, {config: configuration});
    }

    static sendMessage(type, props) {
        Browser.sendMessage(type, props);
    }
}
