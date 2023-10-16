import * as React from 'react';

import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import './styles.scss';

const StrategySelect: React.FC<{
  strategies: string[];
  selectedStrategy: string;
  onChange: (selected: string) => void;
}> = ({strategies, selectedStrategy, onChange}) => {
  return (
    <FormControl>
      <FormLabel>Strategy</FormLabel>
      <RadioGroup
        value={selectedStrategy}
        onChange={(event) => onChange(event.target.value)}
      >
        {strategies.map((strategy) => {
          return (
            <FormControlLabel
              value={strategy}
              control={<Radio size="small" />}
              label={strategy}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default StrategySelect;
