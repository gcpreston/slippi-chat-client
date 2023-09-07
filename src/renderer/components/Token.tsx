import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Cancel from '@mui/icons-material/Cancel';

import useToken from '../hooks/useToken';
import TokenInput from './TokenInput';

const Token = () => {
  const [token, setToken] = useToken();
  const [editing, setEditing] = useState(false);

  return (
    <>
      { editing ?
        <TokenInput
          token={token}
          submit={(newToken) => {
            setToken(newToken);
            setEditing(false);
          }}
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
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>
      }
    </>
  );
};

export default Token;
