import * as React from 'react';

import './styles.scss';
import Browser from 'webextension-polyfill';
import { Messaging } from '../Messaging';

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

  return (
    <section>
      <label>Toggle AutoTabMute: </label><button onClick={() => {
        Messaging.sendEnableDisable(!enabled);
        setEnabled(!enabled);
      }}>{enabled ? "Off" : "On"}</button>

      {
        enabled
          ? <>
              <hr />
                <label>Strategy: </label>
                <select onChange={(event) => {
                  Messaging.sendStrategySelect(event.target.value);
                  setSelectedStrategy(event.target.value);
                }} value={selectedStrategy}>
                  {strategies.map(strategy => <option value={strategy}>{strategy}</option>)}
                </select>
                {
                  selectedStrategy === "Active tab"
                    ? (
                      <>
                        <hr />
                        <label>Apply across windows</label>
                        <input type="checkbox" checked={applyAcrossWindows} onChange={(event) => {
                          Browser.storage.sync.set({ onlySelectedWindow: event.target.checked });
                          setApplyAcrossWindows(event.target.checked);
                          Messaging.sendEnableDisable(enabled);
                        }} />
                      </>
                    ) : null
                }
                {
                  selectedStrategy === "Allow list" 
                    ? (
                      <>
                        <hr />
                        <table id="tabTable">
                          {tabs.map((tab) => {
                            const checked = selectedTabs?.includes(tab.id!);
                            return (
                              <tr className="tabRow">
                                <td className="tabNameCol">{tab.title}</td>
                                <td className="tabMuteCol">
                                  <input type="checkbox" checked={checked} onChange={(event) => {
                                    if (event.target.checked) {
                                      Messaging.sendAddSelectedTab(tab.id!);
                                      setSelectedTabs([...selectedTabs, tab.id!]);
                                    } else {
                                      Messaging.sendRemoveSelectedTab(tab.id!);
                                      setSelectedTabs(selectedTabs.filter(t => t !== tab.id!))
                                    }
                                  }}/>
                                </td>
                              </tr>
                            );
                          })}
                        </table>
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
