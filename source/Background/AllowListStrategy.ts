import { MutingStrategy } from "./MutingStrategy";
import { MuteUtils } from "./MuteUtils";
import Browser from "webextension-polyfill";

export class AllowListStrategy extends MutingStrategy {
    onTabActivated(): void {
        this.applyAllowlist();
    }
    onTabUpdate(): void {
        this.applyAllowlist();
    }
    onToggle(): void {
        this.applyAllowlist();
    }
    onSelectedTabsChange(): void {
        this.applyAllowlist();
    }
    private applyAllowlist(): void {
        Browser.storage.local.get(["selectedTabs"]).then(({selectedTabs}) => {
            MuteUtils.muteAudibleTabs(selectedTabs);
        });
    }
}