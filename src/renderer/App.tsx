import React, { useState, useEffect } from 'react';

import useToken from './hooks/useToken';
import { SlippiEvent } from '../slippi/types';

const App = () => {
  const [token, setToken] = useToken();
  const [clientCode, setClientCode] = useState<string | null>(null);
  const [phoenixState, setPhoenixState] = useState('...');
  const [slippiState, setSlippiState] = useState('...');

  useEffect(() => {
    window.electron.onPhoenixConnected((_electronEvent, phxEvent) => {
      setPhoenixState('connected');
      setClientCode(phxEvent.clientCode);
    });

    window.electron.onPhoenixConnectError((_electronEvent, phxEvent) => {
      console.log('phx connect error', phxEvent.error);
      setPhoenixState('error connecting');
    });

    window.electron.onSlippiStatusChanged((_electronEvent, slpEvent: SlippiEvent) => {
      setSlippiState(slpEvent.status);
    });

    window.electron.connectToPhoenix();
    window.electron.connectToSlippi();

    return () => {
      window.electron.backendClearBindings();
    };
  }, []);

  const clearToken = () => setToken(null);

  // TODO: react-hook-form (on plane can't install lol)
  const [tokenInputVal, setTokenInputVal] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('setting token to', tokenInputVal);
    setToken(tokenInputVal);
    setTokenInputVal('');
  };

  return (
    <div>
      <h2>Hello from React</h2>
      <div>Token: {token}</div>
      <div>Phoenix state: {phoenixState}{phoenixState === 'connected' && ` (${clientCode})`}</div>
      <div>Slippi state: {slippiState}</div>

      { token && <button onClick={clearToken}>Clear token</button> }
      { !token &&
        <form onSubmit={handleSubmit}>
          <label htmlFor="token">Token</label>
          <input type="text" name="token" value={tokenInputVal} onChange={(event) => setTokenInputVal(event.target.value)} />
          <button type="submit">Save</button>
        </form>
      }
    </div>
  );
};

export default App;
