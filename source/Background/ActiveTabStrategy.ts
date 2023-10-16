import Browser, {Tabs} from 'webextension-polyfill';
import {MutingStrategy} from './MutingStrategy';
import {MuteUtils} from './MuteUtils';
import {Logging} from '../Logging';

export class ActiveTabStrategy extends MutingStrategy {
  onTabActivated(tabInfo: Tabs.OnActivatedActiveInfoType): void {
    Browser.tabs.get(tabInfo.tabId).then((currentTab) => {
      if (currentTab.audible) {
        Browser.storage.sync
          .get('onlySelectedWindow')
          .then(({onlySelectedWindow}) => {
            Logging.trace(
              `Activated tab ${tabInfo.tabId} was marked audible, muting others`
            );
            MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
          });
      }
    });
  }

  onTabUpdate(
    _: number,
    tabInfo: Tabs.OnUpdatedChangeInfoType,
    tab: Browser.Tabs.Tab
  ): void {
    if (tabInfo.audible) {
      Browser.storage.sync
        .get('onlySelectedWindow')
        .then(({onlySelectedWindow}) => {
          if (tab.highlighted) {
            MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
          } else {
            MuteUtils.muteBackgroundTabIfSelectedIsAudible(
              tab.id!,
              onlySelectedWindow
            );
          }
        });
    }
  }

  onToggle(): void {
    Browser.tabs.query({highlighted: true}).then((tabs) => {
      Browser.storage.sync
        .get('onlySelectedWindow')
        .then(({onlySelectedWindow}) => {
          tabs.forEach((tab) => {
            if (tab.audible) {
              MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
            }
          });
        });
    });
  }

  onSelectedTabsChange(): void {}

  onWindowFocusChanged(windowId: number): void {
    Browser.tabs.query({highlighted: true}).then((tabs) => {
      Browser.storage.sync
        .get('onlySelectedWindow')
        .then(({onlySelectedWindow}) => {
          tabs.forEach((tab) => {
            if (tab.audible && tab.windowId === windowId) {
              MuteUtils.muteAudibleUnselectedTabs(onlySelectedWindow);
            }
          });
        });
    });
  }
}
