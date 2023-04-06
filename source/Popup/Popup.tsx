import * as React from 'react';

import Divider from '@mui/material/Divider';

import './styles.scss';
import Browser from 'webextension-polyfill';
import { Messaging } from '../Messaging';
import StrategySelect from './StrategySelect';
import EnableControl from './EnableControl';
import ActiveTabOptions from './ActiveTabOptions';
import TabList from './TabList';

const Popup: React.FC = () => {
  const [tabs, setTabs] = React.useState<Browser.Tabs.Tab[]>([]);
  const [selectedTabs, setSelectedTabs] = React.useState<number[]>([]);
  const [strategies, setStrategies] = React.useState<string[]>([]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [selectedStrategy, setSelectedStrategy] = React.useState<string>("Active tab");
  const [applyAcrossWindows, setApplyAcrossWindows] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const fetchedTabs = await Browser.tabs.query({});
      const { availableStrategies, selectedTabs } = await Browser.storage.local.get(null);
      const { extension_enabled , selected_strategy, onlySelectedWindow } = await Browser.storage.sync.get(null);
  
      setTabs(fetchedTabs);
      setSelectedTabs(selectedTabs);
      setStrategies(availableStrategies);
      setEnabled(extension_enabled);
      setSelectedStrategy(selected_strategy);
      setApplyAcrossWindows(onlySelectedWindow);
    };

    fetchData();
  }, []);

  const divider = <Divider variant="middle" style={{
    marginTop: "10px",
    marginBottom: "10px"
  }} />

  return (
    <section>
      <EnableControl enabled={enabled} toggle={(nowEnabled) => {
        Messaging.sendEnableDisable(nowEnabled);
        setEnabled(nowEnabled);
      }} />

      {
        enabled
          ? <>
                {divider}
                <StrategySelect strategies={strategies} selectedStrategy={selectedStrategy} onChange= {(selected) => {
                  Messaging.sendStrategySelect(selected);
                  setSelectedStrategy(selected);
                }}/>
                {
                  selectedStrategy === "Active tab"
                    ? (
                      <>
                        {divider}
                        <ActiveTabOptions applyAcrossWindows={applyAcrossWindows} onChange={(apply) => {
                          Browser.storage.sync.set({ onlySelectedWindow: apply });
                          setApplyAcrossWindows(apply);
                          Messaging.sendEnableDisable(enabled);
                        }} />
                      </>
                    ) : null
                }
                {
                  selectedStrategy === "Allow list" 
                    ? (
                      <>
                        {divider}
                        <TabList 
                          tabs={tabs}
                          selectedTabIds={selectedTabs}
                          selectTab={(tabId) => {
                            Messaging.sendAddSelectedTab(tabId);
                            setSelectedTabs([...selectedTabs, tabId]);
                          }}
                          deselectTab={(tabId) => {
                            Messaging.sendRemoveSelectedTab(tabId);
                            setSelectedTabs(selectedTabs.filter(t => t !== tabId))
                          }}
                        />
                      </>
                    )
                    : null
                }
          </>
          : null
      }
      
      
    </section>
  );
};

export default Popup;
