import React from 'react';

import { Button } from '@mui/material';

const App = () => {
  const sendEvent = async () => {
    console.log('sending to main');
    console.log(await window.electron.getThing());
  };

  return (
    <div>
      <h2>Hello from React</h2>
      <Button variant='contained' onClick={sendEvent}>Send</Button>
    </div>
  );
};

export default App;
