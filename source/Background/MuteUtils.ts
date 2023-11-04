import Browser from 'webextension-polyfill';
import { Logging } from '../Logging';

export class MuteUtils {
  static muteAudibleTabs(exclusions: (undefined | number)[]): void {
    Logging.trace('Muting audible tabs');
    this.getAudibleTabs().then((tabs) => {
      Logging.trace('Audible tabs', tabs);
      tabs.forEach((tab) => {
        if (tab.id != null) {
          if (exclusions?.includes(tab.id)) {
            this.unmuteTab(tab.id);
          } else {
            this.muteTab(tab.id);
          }
        }
      });
      Logging.trace('Muted audible tabs', tabs);
    });
  }

  static muteAudibleUnselectedTabs(onlySelectedWindow = false): void {
    Logging.trace(
      'Muting unselected tabs that are audible, only in selected window',
      onlySelectedWindow
    );
    this.getHighlightedTabs(onlySelectedWindow).then((tabs) => {
      this.muteAudibleTabs(tabs.map((tab) => tab.id));
    });
  }

  static muteBackgroundTabIfSelectedIsAudible(
    backgroundTabId: number,
    onlySelectedWindow = false
  ): void {
    Logging.trace(
      'Muting background tab if selected is audible',
      backgroundTabId,
      onlySelectedWindow
    );
    this.getHighlightedTabs(onlySelectedWindow).then((tabs) => {
      Logging.trace('Muting tabs', tabs);
      tabs.forEach((tab) => {
        if (tab.audible) {
          this.muteTab(backgroundTabId);
        }
      });
      Logging.trace('Muted background tabs if selected was audible');
    });
  }

  static unmuteAll(): void {
    Logging.trace('Unmuting all tabs');
    Browser.tabs.query({}).then((tabs) => {
      Logging.trace('Unmuting tabs', tabs);
      tabs.forEach((tab) => {
        if (tab.id != null) {
          this.unmuteTab(tab.id);
        }
      });
      Logging.trace('Unmuted all tabs', tabs);
    });
  }

  static muteAll(): void {
    Logging.trace('Muting all tabs');
    Browser.tabs.query({}).then((tabs) => {
      Logging.trace('Muting tabs', tabs);
      tabs.forEach((tab) => {
        if (tab.id != null) {
          this.muteTab(tab.id);
        }
      });
      Logging.trace('Muted all tabs', tabs);
    });
  }

  private static getHighlightedTabs(
    onlySelectedWindow: boolean
  ): Promise<Browser.Tabs.Tab[]> {
    if (onlySelectedWindow) {
      return Browser.tabs.query({ highlighted: true, lastFocusedWindow: true });
    }
    return Browser.tabs.query({ highlighted: true });
  }

  private static getAudibleTabs(): Promise<Browser.Tabs.Tab[]> {
    return Browser.tabs.query({ audible: true });
  }

  private static muteTab(tabId: number): void {
    this.setTabMuted(tabId, true);
  }

  private static unmuteTab(tabId: number): void {
    this.setTabMuted(tabId, false);
  }

  private static setTabMuted(tabId: number, muted: boolean): void {
    Browser.tabs.update(tabId, { muted });
  }
}
