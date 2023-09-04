import React, { useState, useEffect } from 'react';

import useToken from './hooks/useToken';

const App = () => {
  const [token, setToken] = useToken();
  const [phoenixState, setPhoenixState] = useState('...');
  const [slippiState, setSlippiState] = useState('...');

  useEffect(() => {
    window.electron.onPhoenixConnected((event) => {
      console.log('phoenix connected', event);
      setPhoenixState('connected');
    });

    window.electron.onPhoenixConnectError((event) => {
      console.log('phoenix connect error', event);
      setPhoenixState('error connecting');
    });

    window.electron.onSlippiStatusChanged((_electronEvent, slpEvent) => {
      console.log('slippi status changed', slpEvent);
      if (slpEvent.status === 2) {
        setSlippiState('connected');
      } else if (slpEvent.status === 0) {
        setSlippiState('disconnected');
      } else if (slpEvent.status === 1) {
        setSlippiState('connecting...');
      } else if (slpEvent.status === 3) {
        setSlippiState('reconnect wait (?)');
      } else {
        setSlippiState(`something weird: ${slpEvent.status}`);
      }
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
      <div>Phoenix state: {phoenixState}</div>
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
