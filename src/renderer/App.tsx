import React, { useEffect, useState } from 'react';
import { Button, Container, Snackbar, Alert, AlertColor } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';

import useBackendConnectionStatus from './hooks/useBackendConnectionStatus';
import useSlippiConnectionStatus from './hooks/useSlippiConnectionStatus';
import Token from './components/Token';
import MagicLoginDialog from './components/MagicLoginDialog';
import { generateMagicToken, magicVerify } from './api';
import useToken from './hooks/useToken';
import { baseHTTP } from '../utils';
import { BackendConnectionStatus } from './types';

const CHAT_URL = `${baseHTTP}/chat`;

const App = () => {
  const [backendStatus, clientCode] = useBackendConnectionStatus();
  const slippiStatus = useSlippiConnectionStatus();
  const [token, _setToken] = useToken();

  const [magicDialogOpen, setMagicDialogOpen] = useState(false);
  const [magicToken, setMagicToken] = useState<string | undefined>();

  type SnackbarData = {
    open: boolean;
    variant: AlertColor;
    message: string;
  };

  const [snackbarData, setSnackbarData] = useState<SnackbarData>({ open: false, variant: 'success', message: '' });

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
          setMagicDialogOpen(true);
        });
    }
  };

  const handleCloseMagicDialog = () => setMagicDialogOpen(false);

  const handleSubmitMagicDialog = (verificationCode) => {
    if (!token) {
      console.error("Can't verify magic login unless authorized.");
    } else {
      magicVerify(token, verificationCode)
        .then(() => {
          setSnackbarData({ open: true, variant: 'success', message: 'Magic login success!' });
        })
        .catch((err) => {
          console.error(err);
          setSnackbarData({ open: true, variant: 'error', message: 'Something went wrong with magic login' });
        })
        .finally(() => setMagicDialogOpen(false));
    }
  };

  const handleSnackClose = () => setSnackbarData({ open: false, variant: 'success', message: '' });

  return (
    <Container maxWidth="md">
      <h1 className="text-3xl font-bold mb-4">Slippi Chat Client</h1>
      <Token />
      <div>
        Phoenix state: {backendStatus}{clientCode && ` (${clientCode})`}
        { [BackendConnectionStatus.Disconnected, BackendConnectionStatus.Error].includes(backendStatus) && <button onClick={() => window.electron.connectToPhoenix()}><Refresh /></button>}
        { backendStatus === BackendConnectionStatus.Connected &&
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
        <MagicLoginDialog open={magicDialogOpen} magicToken={magicToken} handleClose={handleCloseMagicDialog} handleSubmit={handleSubmitMagicDialog} />
        <Snackbar open={snackbarData.open} autoHideDuration={3000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity={snackbarData.variant} sx={{ width: '100%' }}>
            {snackbarData.message}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
};

export default App;
