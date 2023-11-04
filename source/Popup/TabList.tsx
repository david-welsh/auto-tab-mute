import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import './styles.scss';
import Browser from 'webextension-polyfill';

const TabList: React.FC<{
  tabs: Browser.Tabs.Tab[];
  selectedTabIds: number[];
  selectTab: (tabId: number) => void;
  deselectTab: (tabId: number) => void;
}> = ({ tabs, selectedTabIds, selectTab, deselectTab }) => {
  return (
    <FormControl>
      <FormLabel style={{ marginBottom: '5px' }}>Allowed tabs</FormLabel>
      <TableContainer component={Paper}>
        <Table size="small" style={{ tableLayout: 'fixed' }}>
          <TableBody>
            {tabs.map((tab) => {
              const checked = selectedTabIds.includes(tab.id!);
              return (
                <TableRow
                  key={tab.id!}
                  onClick={() => {
                    if (checked) {
                      deselectTab(tab.id!);
                    } else {
                      selectTab(tab.id!);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      width: '70%',
                      overflowX: 'clip',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {tab.title}
                  </TableCell>
                  <TableCell align="right">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectTab(tab.id!);
                        } else {
                          deselectTab(tab.id!);
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </FormControl>
  );
};

export default TabList;
