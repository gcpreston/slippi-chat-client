import { useState, useEffect } from 'react';

const useToken: () => [string | null, (newToken: string | null) => Promise<void>] = () => {
  const [token, setToken] = useState<string | null>(null);

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
