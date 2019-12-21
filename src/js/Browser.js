export default class Browser {
    static sendMessage(type, props) {
        chrome.runtime.sendMessage({type, ...props});
    }

    static storeValue(key, value) {
        chrome.storage.sync.set({[key]: value}, null);
    }

    static getValues(keys, callback) {
        chrome.storage.sync.get(keys, callback);
    }

    static setBadgeText(value) {
        chrome.browserAction.setBadgeText({"text": value});
    }

    static addCommandListener(listener) {
        chrome.commands.onCommand.addListener(listener);
    }

    static addMessageListener(listener) {
        chrome.runtime.onMessage.addListener(listener);
    }

    static addTabRemoveListener(listener) {
        chrome.tabs.onRemoved.addListener(listener);
    }

    static addTabUpdateListener(listener) {
        chrome.tabs.onUpdated.addListener(listener);
    }

    static removeTabUpdateListener(listener) {
        chrome.tabs.onUpdated.removeListener(listener);
    }

    static addTabActivatedListener(listener) {
        chrome.tabs.onActivated.addListener(listener);
    }

    static removeTabActivatedListener(listener) {
        chrome.tabs.onActivated.removeListener(listener);
    }

    static queryTabs(query, callback) {
        chrome.tabs.query(query, callback);
    }

    static updateTab(id, properties) {
        chrome.tabs.update(id, properties);
    }

    static getTab(id, callback) {
        chrome.tabs.get(id, callback);
    }
}
