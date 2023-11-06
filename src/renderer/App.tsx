import React, { useEffect, useState } from 'react';
import { Button, Container, Snackbar, Alert, AlertColor, CircularProgress } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';
import Link from '@mui/icons-material/Link';
import LinkOff from '@mui/icons-material/LinkOff';

import useBackendConnectionStatus from './hooks/useBackendConnectionStatus';
import useSlippiConnectionStatus from './hooks/useSlippiConnectionStatus';
import MagicLoginDialog from './components/MagicLoginDialog';
import TokenInput from './components/TokenInput';
import { generateMagicToken, magicVerify } from './api';
import useToken from './hooks/useToken';
import { baseHTTP, isProduction } from '../utils';
import { BackendConnectionStatus } from './types';
import { SlippiClientConnectionStatus } from '../slippi/types';

const CHAT_URL = `${baseHTTP}/chat`;

const getSlippiStatusIcon = (status: SlippiClientConnectionStatus) => {
  switch (status) {
    case SlippiClientConnectionStatus.CONNECTED:
      return <Link color='success' />;
    case SlippiClientConnectionStatus.CONNECTING:
      return <CircularProgress size={20} />;
    default:
      return <LinkOff color='error' />;
  }
}

const App = () => {
  const [backendStatus, clientCode] = useBackendConnectionStatus();
  const slippiStatus = useSlippiConnectionStatus();
  const [token, setToken] = useToken();

  const [magicDialogOpen, setMagicDialogOpen] = useState(false);
  const [magicToken, setMagicToken] = useState<string | undefined>();

  type SnackbarData = {
    open: boolean;
    variant: AlertColor;
    message: string;
  };

  const [snackbarData, setSnackbarData] = useState<SnackbarData>({ open: false, variant: 'success', message: '' });

  useEffect(() => {
    window.electron.connectToSlippi();
    window.electron.connectToPhoenix();
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

  const backendStatusIcon = backendStatus === BackendConnectionStatus.CONNECTED ? <Link color='success' /> : <LinkOff color='error' />;

  return (
    <Container maxWidth="md">
      <h1 className="text-3xl font-bold mb-4">SlippiChat Client {!isProduction && '(development)'}</h1>

      <div className='mt-8'>
        Slippi: {getSlippiStatusIcon(slippiStatus)}
        { slippiStatus === SlippiClientConnectionStatus.DISCONNECTED && <button onClick={() => window.electron.connectToSlippi()}><Refresh /></button>}
      </div>

      <div className='mt-2'>
        { backendStatus === BackendConnectionStatus.CONNECTED ?
          <div>
            <div className='mb-2'>SlippiChat backend: {backendStatusIcon} {clientCode && ` (${clientCode})`}</div>
            { backendStatus === BackendConnectionStatus.CONNECTED &&
              <Button variant='contained'>
                <a href={CHAT_URL} target='_blank'>Open chat</a>
              </Button>
            }
          </div>
          :
          <div>
            { backendStatus === BackendConnectionStatus.ERROR && <Alert severity='error' className='mb-2'>Error connecting to SlippiChat backend.</Alert>}
            { token === undefined ?
              <CircularProgress size={20} />
              :
              <TokenInput
                token={token}
                backendStatus={backendStatus}
                submit={(newToken) => {
                  setToken(newToken).then(() => window.electron.connectToPhoenix());
                }}
              />
            }
          </div>
        }
      </div>

      <hr className='my-8' />

      <div>
        <Button variant='contained' onClick={startMagicLogin}>Magic login</Button>
        <MagicLoginDialog open={magicDialogOpen} magicToken={magicToken} handleClose={handleCloseMagicDialog} handleSubmit={handleSubmitMagicDialog} />
        <Snackbar open={snackbarData.open} autoHideDuration={3000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity={snackbarData.variant} sx={{ width: '100%' }}>
            {snackbarData.message}
          </Alert>
        </Snackbar>
      </div>

      <div className='mt-4'>
        <Button variant='contained' onClick={() => window.electron.disconnectFromPhoenix()}>Change client token</Button>
      </div>
    </Container>
  );
};

export default App;
