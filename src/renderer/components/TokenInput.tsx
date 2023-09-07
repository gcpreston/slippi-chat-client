import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

type TokenInputProps = {
  token: string | null;
  submit: (newToken: string) => void;
};

const TokenInput = ({ token, submit }: TokenInputProps) => {
  const [inputVal, setInputVal] = useState(token || '');

  return (
    <div className='flex space-x-4'>
      <TextField
        variant='filled'
        type='password'
        size='small'
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        inputRef={(input) => input && input.focus()}
      />
      <Button variant="contained" onClick={() => {
        submit(inputVal);
      }}>
        Save
      </Button>
    </div>
  )
}

export default TokenInput;
