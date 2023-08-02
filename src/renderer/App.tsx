import React, { useState } from 'react';

import useToken from './hooks/useToken';

const App = () => {
  const [token, setToken] = useToken();

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
