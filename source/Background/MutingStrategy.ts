import Browser from 'webextension-polyfill';

export abstract class MutingStrategy {
  abstract onTabActivated(
    tabInfo: Browser.Tabs.OnActivatedActiveInfoType
  ): void;

  abstract onTabUpdate(
    tabId: number,
    tabInfo: Browser.Tabs.OnUpdatedChangeInfoType,
    tab: Browser.Tabs.Tab
  ): void;

  abstract onToggle(): void;

  abstract onSelectedTabsChange(): void;

  abstract onWindowFocusChanged(windowId: number): void;
}
