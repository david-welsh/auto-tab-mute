import Browser from "webextension-polyfill";
import constants from "./constants";

export class Messaging {
    static sendEnableDisable(enabled: boolean) {
        Messaging.sendMessage(constants.MessageType.ENABLE_DISABLE, {isEnabled: enabled});
    }

    static sendStrategySelect(strategy: string) {
        Messaging.sendMessage(constants.MessageType.STRATEGY_SELECT, {selectedStrategy: strategy});
    }

    static sendAddSelectedTab(tabId: number) {
        Messaging.sendMessage(constants.MessageType.ADD_SELECTED_TAB, {tab: tabId});
    }

    static sendRemoveSelectedTab(tabId: number) {
        Messaging.sendMessage(constants.MessageType.REMOVE_SELECTED_TAB, {tab: tabId});
    }

    static sendConfigurationRequest() {
        Messaging.sendMessage(constants.MessageType.CONFIGURATION_REQUEST);
    }

    static sendConfigurationResponse(configuration: any) {
        Messaging.sendMessage(constants.MessageType.CONFIGURATION_RESPONSE, {config: configuration});
    }

    static sendMessage(type: string, props: any = {}) {
        Browser.runtime.sendMessage({type, ...props});
    }
}
