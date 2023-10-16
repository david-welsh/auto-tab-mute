import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import './styles.scss';

const ActiveTabOptions: React.FC<{
  applyAcrossWindows: boolean;
  onChange: (apply: boolean) => void;
}> = ({applyAcrossWindows, onChange}) => {
  return (
    <FormControl>
      <FormControlLabel
        label="Apply across windows"
        control={
          <Checkbox
            checked={applyAcrossWindows}
            onChange={(event) => onChange(event.target.checked)}
          />
        }
      />
    </FormControl>
  );
};

export default ActiveTabOptions;
