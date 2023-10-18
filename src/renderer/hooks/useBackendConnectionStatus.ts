import { useState, useEffect } from 'react';

import { BackendConnectionStatus } from '../types';

const useBackendConnectionStatus = (): [BackendConnectionStatus, string | null] => {
  const [backendStatus, setBackendStatus] = useState(BackendConnectionStatus.Disconnected);
  const [clientCode, setClientCode] = useState<string | null>(null);

  useEffect(() => {
    window.electron.onPhoenixConnected((_electronEvent, phxEvent) => {
      setBackendStatus(BackendConnectionStatus.Connected);
      setClientCode(phxEvent.clientCode);
    });

    window.electron.onPhoenixConnectError((_electronEvent, phxEvent) => {
      console.log('phx connect error', phxEvent.error);
      setBackendStatus(BackendConnectionStatus.Error);
    });

    return () => {
      window.electron.backendClearBindings();
    };
  }, []);

  return [backendStatus, clientCode];
};

export default useBackendConnectionStatus;
