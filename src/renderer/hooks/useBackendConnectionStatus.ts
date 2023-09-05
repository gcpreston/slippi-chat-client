import { useState, useEffect } from 'react';

const useBackendConnectionStatus = () => {
  const [backendStatus, setBackendStatus] = useState('DISCONNECTED');
  const [clientCode, setClientCode] = useState<string | null>(null);

  useEffect(() => {
    window.electron.onPhoenixConnected((_electronEvent, phxEvent) => {
      setBackendStatus('CONNECTED');
      setClientCode(phxEvent.clientCode);
    });

    window.electron.onPhoenixConnectError((_electronEvent, phxEvent) => {
      console.log('phx connect error', phxEvent.error);
      setBackendStatus('ERROR');
    });

    return () => {
      window.electron.backendClearBindings();
    };
  }, []);

  return [backendStatus, clientCode];
};

export default useBackendConnectionStatus;
