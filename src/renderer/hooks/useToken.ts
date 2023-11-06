import { useState, useEffect } from 'react';

type ClientTokenType = string | null | undefined;
// string -> token is loaded and set
// null -> token is loaded and not set
// undefined -> token is not yet loaded

const useToken: () => [ClientTokenType, (newToken: string | null) => Promise<void>] = () => {
  const [token, setToken] = useState<ClientTokenType>(undefined);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await window.electron.getClientToken();
      setToken(token);
    };

    fetchToken();
  }, []);

  const writeToken = async (newToken: string | null) => {
    await window.electron.setClientToken(newToken);
    setToken(newToken);
  };

  return [token, writeToken];
};

export default useToken;
