import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { BackendConnectionStatus } from '../types';

type TokenInputProps = {
  token: string | null;
  backendStatus: BackendConnectionStatus;
  submit: (newToken: string) => void;
};

const TokenInput = ({ token, backendStatus, submit }: TokenInputProps) => {
  const [inputVal, setInputVal] = useState(token || '');

  return (
    <div className='flex space-x-4'>
      <TextField
        placeholder='Client token'
        variant='outlined'
        type='password'
        size='small'
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        inputRef={(input) => input && input.focus()}
      />
      <Button variant='contained' onClick={() => {
        submit(inputVal);
      }}>
        Connect
      </Button>
      { backendStatus === BackendConnectionStatus.CONNECTING && <CircularProgress size={20} />}
    </div>
  )
}

export default TokenInput;
