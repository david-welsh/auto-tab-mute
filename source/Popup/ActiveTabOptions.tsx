import * as React from 'react';

import Browser from 'webextension-polyfill';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import './styles.scss';

const ActiveTabOptions: React.FC<{
  applyAcrossWindows: boolean;
  onChange: (apply: boolean) => void;
}> = ({ applyAcrossWindows, onChange }) => {
  return (
    <FormControl>
      <FormControlLabel
        label={Browser.i18n.getMessage('applyAcrossWindows')}
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
