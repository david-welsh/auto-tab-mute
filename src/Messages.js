const MessageType = {
    ENABLE_DISABLE: "enable_disable",
    ADD_SELECTED_TAB: "add_selected_tab",
    REMOVE_SELECTED_TAB: "remove_selected_tab",
    STRATEGY_SELECT: "strategy_select",
    CONFIGURATION_REQUEST: "configuration_request",
    CONFIGURATION_RESPONSE: "configuration_response"
};

const Messaging = {
    sendEnableDisable: function(enabled) {
        Messaging.sendMessage(MessageType.ENABLE_DISABLE, {isEnabled: enabled});
    },

    sendStrategySelect: function(strategy) {
        Messaging.sendMessage(MessageType.STRATEGY_SELECT, {selectedStrategy: strategy});
    },

    sendAddSelectedTab: function(tabId) {
        Messaging.sendMessage(MessageType.ADD_SELECTED_TAB, {tab: tabId});
    },

    sendRemoveSelectedTab: function(tabId) {
        Messaging.sendMessage(MessageType.REMOVE_SELECTED_TAB, {tab: tabId});
    },

    sendConfigurationRequest: function() {
        Messaging.sendMessage(MessageType.CONFIGURATION_REQUEST);
    },

    sendConfigurationResponse: function(configuration) {
        Messaging.sendMessage(MessageType.CONFIGURATION_RESPONSE, {config: configuration});
    },

    sendMessage: function(type, props) {
        chrome.runtime.sendMessage({type, ...props});
    }
};
