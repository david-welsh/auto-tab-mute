import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './styles.scss';
import Browser from 'webextension-polyfill';

const TabList: React.FC<{ tabs: Browser.Tabs.Tab[], selectedTabIds: number[], selectTab: (tabId: number) => void, deselectTab: (tabId: number) => void }> = 
    ({ tabs, selectedTabIds, selectTab, deselectTab }) => {
            (<table id="tabTable">
                {tabs.map((tab) => {
                    const checked = selectedTabIds.includes(tab.id!);
                    return (
                        <tr className="tabRow">
                            <td className="tabNameCol">{tab.title}</td>
                            <td className="tabMuteCol">
                                <input type="checkbox" checked={checked} onChange={(event) => {
                                    if (event.target.checked) {
                                        selectTab(tab.id!);
                                    } else {
                                        deselectTab(tab.id!);
                                    }
                                }}/>
                            </td>
                        </tr>
                    );
                })}
            </table>);

        return (
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableBody>
                    {tabs.map((tab) => {
                        const checked = selectedTabIds.includes(tab.id!);
                        return (
                            <TableRow key={tab.id!} >
                                <TableCell component="th" scope="row">
                                    {tab.title}
                                </TableCell>
                                <TableCell align="right">
                                    <input type="checkbox" checked={checked} onChange={(event) => {
                                        if (event.target.checked) {
                                            selectTab(tab.id!);
                                        } else {
                                            deselectTab(tab.id!);
                                        }
                                    }}/>    
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
};

export default TabList;
