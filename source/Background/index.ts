import Browser from 'webextension-polyfill';
import {ActiveTabStrategy} from './ActiveTabStrategy';
import {AllowListStrategy} from './AllowListStrategy';
import {MutingStrategy} from './MutingStrategy';
import constants from '../constants';
import {MuteUtils} from './MuteUtils';
import {MuteAllStrategy} from './MuteAllStrategy';
import {Logging} from '../Logging';

const mutingStrategies = new Map<string, MutingStrategy>();
mutingStrategies.set('Active tab', new ActiveTabStrategy());
mutingStrategies.set('Allow list', new AllowListStrategy());
mutingStrategies.set('Mute all', new MuteAllStrategy());

async function getConfig(): Promise<{
  enabled: boolean;
  selectedStrategy: string;
  onlySelectedWindow: boolean;
}> {
  Logging.trace('Fetching sync config');
  const config = await Browser.storage.sync.get([
    'extension_enabled',
    'selected_strategy',
    'onlySelectedWindow',
  ]);
  Logging.trace('Fetched sync config', config);
  return {
    enabled: config.extension_enabled,
    selectedStrategy: config.selected_strategy,
    onlySelectedWindow: config.onlySelectedWindow,
  };
}

async function getSelectedTabs(): Promise<{selectedTabs: number[]}> {
  Logging.trace('Fetching selected tabs');
  const {selectedTabs} = await Browser.storage.local.get('selectedTabs');
  return {
    selectedTabs,
  };
}

function onEnabled(enabled: boolean | undefined): Promise<void> {
  const details = {
    path: {
      '16': enabled
        ? '../assets/icons/Logo-16x16.png'
        : '../assets/icons/Disabled-16x16.png',
      '48': enabled
        ? '../assets/icons/Logo-48x48.png'
        : '../assets/icons/Disabled-48x48.png',
      '128': enabled
        ? '../assets/icons/Logo-128x128.png'
        : '../assets/icons/Disabled-128x128.png',
    },
  };
  return Browser.action.setIcon(details);
}

function applyIfEnabled(f: (s: MutingStrategy) => void): void {
  Logging.trace('Applying strategy if enabled');
  getConfig().then(({enabled, selectedStrategy}) => {
    if (enabled) {
      const strategy = mutingStrategies.get(selectedStrategy);
      if (strategy == null) {
        Logging.warn('Unexpected strategy: ', selectedStrategy);
      } else {
        f(strategy);
      }
    }
  });
}

function toggleExtension(nowEnabled: boolean): void {
  Logging.trace('Toggling extension', nowEnabled);
  getConfig().then(({selectedStrategy}) => {
    Browser.storage.sync.set({extension_enabled: nowEnabled});
    if (nowEnabled) {
      mutingStrategies.get(selectedStrategy)?.onToggle();
    } else {
      MuteUtils.unmuteAll();
    }

    onEnabled(nowEnabled);
  });
}

function initStorage(): void {
  Logging.trace('Initialising storage');
  getConfig().then(({selectedStrategy, enabled}) => {
    if (selectedStrategy == null)
      Browser.storage.sync.set({selected_strategy: 'Active tab'});
    if (enabled == null) Browser.storage.sync.set({extension_enabled: true});
    onEnabled(enabled);
  });
  getSelectedTabs().then(({selectedTabs}) => {
    if (selectedTabs == null) Browser.storage.local.set({selectedTabs: []});
  });
  Browser.storage.local.set({
    availableStrategies: Array.from(mutingStrategies.keys()),
  });
}

function initCommandsAndMessages(): void {
  Browser.commands.onCommand.addListener((command) => {
    Logging.trace('Received command', command);
    if (command === 'toggle_extension') {
      getConfig().then(({enabled}) => {
        toggleExtension(!enabled);
      });
    }
  });
  Browser.runtime.onMessage.addListener((request) => {
    Logging.trace('Received message', request);
    switch (request.type) {
      case constants.MessageType.STRATEGY_SELECT:
        if (mutingStrategies.has(request.selectedStrategy)) {
          Browser.storage.sync.set({
            selected_strategy: request.selectedStrategy,
          });
          mutingStrategies.get(request.selectedStrategy)?.onToggle();
        } else {
          Logging.warn(
            'Unknown strategy selected: %s',
            request.selectedStrategy
          );
        }
        break;
      case constants.MessageType.ADD_SELECTED_TAB:
        getSelectedTabs().then(({selectedTabs}) => {
          if (!selectedTabs?.includes(request.tab)) {
            const updatedSelectedTabs = [...selectedTabs, request.tab];
            Browser.storage.local.set({selectedTabs: updatedSelectedTabs});
            applyIfEnabled((strategy) => strategy.onSelectedTabsChange());
          }
        });
        break;
      case constants.MessageType.REMOVE_SELECTED_TAB:
        getSelectedTabs().then(({selectedTabs}) => {
          if (selectedTabs?.includes(request.tab)) {
            const updatedSelectedTabs = selectedTabs.filter(
              (tab) => tab !== request.tab
            );
            Browser.storage.local.set({selectedTabs: updatedSelectedTabs});
            applyIfEnabled((strategy) => strategy.onSelectedTabsChange());
          }
        });
        break;
      case constants.MessageType.ENABLE_DISABLE:
        toggleExtension(request.isEnabled);
        break;
      default:
        Logging.info('Unknown message type: %s', request.type, request);
        break;
    }
  });
}

initStorage();
initCommandsAndMessages();

Browser.tabs.onActivated.addListener((tabInfo) => {
  Logging.trace('Tab activated', tabInfo);
  applyIfEnabled((strategy) => strategy.onTabActivated(tabInfo));
});

Browser.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  Logging.trace('Tab updated', tabInfo);
  applyIfEnabled((strategy) => strategy.onTabUpdate(tabId, tabInfo, tab));
});

Browser.windows.onFocusChanged.addListener((window) => {
  Logging.trace('Window focused', window);
  applyIfEnabled((strategy) => strategy.onWindowFocusChanged(window));
});

Browser.tabs.onRemoved.addListener((tabId) => {
  Logging.trace('Tab removed', tabId);
  getSelectedTabs().then(({selectedTabs}) => {
    if (tabId != null && selectedTabs?.includes(tabId)) {
      const updatedSelectedTabs = selectedTabs.filter((tab) => tab !== tabId);
      Browser.storage.local.set({selectedTabs: updatedSelectedTabs});

      applyIfEnabled((strategy) => strategy.onSelectedTabsChange());
    }
  });
});
