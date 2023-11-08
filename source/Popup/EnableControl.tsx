import * as React from 'react';

import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import './styles.scss';
import Browser from 'webextension-polyfill';

const EnableControl: React.FC<{
  enabled: boolean;
  toggle: (enabled: boolean) => void;
}> = ({ enabled, toggle }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(event) => toggle(event.target.checked)}
          />
        }
        label={Browser.i18n.getMessage("extensionEnabled")}
        labelPlacement="end"
      />
    </FormGroup>
  );
  return (
    <Button
      size="medium"
      variant="outlined"
      style={{
        width: '100%',
      }}
      onClick={() => toggle(!enabled)}
    >
      {enabled ? 'Disable extension' : 'Enable extension'}
    </Button>
  );
};

export default EnableControl;
