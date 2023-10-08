import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';

import useBackendConnectionStatus from './hooks/useBackendConnectionStatus';
import useSlippiConnectionStatus from './hooks/useSlippiConnectionStatus';
import Token from './components/Token';
import MagicLoginDialog from './components/MagicLoginDialog';
import { generateMagicToken } from './api';
import useToken from './hooks/useToken';

const CHAT_URL = 'https://slippichat.net/chat';

const App = () => {
  const [backendStatus, clientCode] = useBackendConnectionStatus();
  const slippiStatus = useSlippiConnectionStatus();
  const [token, _setToken] = useToken();

  const [magicToken, setMagicToken] = useState<string | undefined>();

  useEffect(() => {
    window.electron.connectToPhoenix();
    window.electron.connectToSlippi();
  }, []);

  const startMagicLogin = () => {
    if (!token) {
      console.error("Can't start magic login unless authorized.");
    } else {
      generateMagicToken(token)
        .then((response) => {
          console.log('got magic response', response);
          setMagicToken(response.data.magic_token);
        });
    }
  };

  const handleCloseMagicDialog = () => setMagicToken(undefined);

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
      <div>
        <Button variant='contained' onClick={startMagicLogin}>Magic login</Button>
        <MagicLoginDialog magicToken={magicToken} handleClose={handleCloseMagicDialog} handleSubmit={handleCloseMagicDialog} />
      </div>
    </Container>
  );
};

export default App;
