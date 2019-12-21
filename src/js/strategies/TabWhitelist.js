import MuteUtils from "../MuteUtils";

export default class TabWhitelist {
    constructor() {
        this.whitelist = [];
        this.name = "Whitelist";
    }

    onToggle(whitelist) {
        this.onSelectedTabsChange(whitelist);
    }

    onTabUpdate() {
        MuteUtils.muteAudibleTabs(this.whitelist);
    }

    onTabActivated() {
        MuteUtils.muteAudibleTabs(this.whitelist);
    }

    onSelectedTabsChange(whitelist) {
        this.whitelist = whitelist;
        MuteUtils.muteAudibleTabs(whitelist);
    }
}
