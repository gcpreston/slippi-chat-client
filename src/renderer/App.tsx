import React, { useEffect } from 'react';
import { Button, Container } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';

import useBackendConnectionStatus from './hooks/useBackendConnectionStatus';
import useSlippiConnectionStatus from './hooks/useSlippiConnectionStatus';
import Token from './components/Token';

const CHAT_URL = 'https://slippichat.net/chat';

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
        { backendStatus === 'DISCONNECTED' && <button onClick={() => window.electron.connectToPhoenix()}><Refresh /></button>}
        { backendStatus === 'CONNECTED' &&
          <Button variant='contained'>
            <a href={CHAT_URL} target='_blank'>Open chat</a>
          </Button>
        }
      </div>
      <div>
        Slippi state: {slippiStatus}
        { slippiStatus === 'DISCONNECTED' && <button onClick={() => window.electron.connectToSlippi()}><Refresh /></button>}
      </div>
    </Container>
  );
};

export default App;
