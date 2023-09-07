import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';

import useBackendConnectionStatus from './hooks/useBackendConnectionStatus';
import useSlippiConnectionStatus from './hooks/useSlippiConnectionStatus';
import Token from './components/Token';

const App = () => {
  const [backendStatus, clientCode] = useBackendConnectionStatus();
  const slippiStatus = useSlippiConnectionStatus();

  useEffect(() => {
    window.electron.connectToPhoenix();
    window.electron.connectToSlippi();
  }, []);

  return (
    <Container maxWidth="md">
      <h1 className="text-3xl font-bold mb-4">Slippi Chat Client</h1>
      <Token />
      <div>
        Phoenix state: {backendStatus}{clientCode && ` (${clientCode})`}
        { backendStatus === 'DISCONNECTED' && <span onClick={() => window.electron.connectToPhoenix()}><Refresh /></span>}
      </div>
      <div>
        Slippi state: {slippiStatus}
        { slippiStatus === 'DISCONNECTED' && <span onClick={() => window.electron.connectToSlippi()}><Refresh /></span>}
      </div>
    </Container>
  );
};

export default App;
