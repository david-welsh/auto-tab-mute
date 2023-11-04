import Browser from 'webextension-polyfill';
import { MutingStrategy } from './MutingStrategy';
import { MuteUtils } from './MuteUtils';

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

  onWindowFocusChanged() {
    // Intentionally left empty
  }

  private applyAllowlist(): void {
    Browser.storage.local.get(['selectedTabs']).then(({ selectedTabs }) => {
      MuteUtils.muteAudibleTabs(selectedTabs);
    });
  }
}
