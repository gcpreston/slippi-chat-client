import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Cancel from '@mui/icons-material/Cancel';

import useToken from '../hooks/useToken';
import TokenInput from './TokenInput';

const Token = () => {
  const [token, setToken] = useToken();
  const [editing, setEditing] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };

  const copyToken = () => {
    const type = "text/plain";
    const blob = new Blob([token || ''], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    return navigator.clipboard.write(data);
  };

  return (
    <>
      { editing ?
        <TokenInput
          token={token}
          submit={(newToken) => {
            setToken(newToken);
            setEditing(false);
          }}
          cancel={() => setEditing(false)}
        />
        :
        <div className='flex space-x-4'>
          { token ?
            <span>
              <Check />
              Token set
            </span>
            :
            <span>
              <Cancel />
              No token set
            </span>
          }
          <Button variant='contained' onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant='outlined' onClick={() => copyToken().then(() => setSnackOpen(true))}>
            Copy
          </Button>

          <Snackbar
            open={snackOpen}
            autoHideDuration={4000}
            onClose={handleClose}
            message="Copied to clipboard"
          />
        </div>
      }
    </>
  );
};

export default Token;
