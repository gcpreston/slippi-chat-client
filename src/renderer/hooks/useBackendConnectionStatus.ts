import { useState, useEffect } from 'react';

import { BackendConnectionStatus } from '../types';

const useBackendConnectionStatus = (): [BackendConnectionStatus, string | null] => {
  const [backendStatus, setBackendStatus] = useState(BackendConnectionStatus.DISCONNECTED);
  const [clientCode, setClientCode] = useState<string | null>(null);

  useEffect(() => {
    window.electron.onPhoenixConnected((_electronEvent, phxEvent) => {
      setBackendStatus(BackendConnectionStatus.CONNECTED);
      setClientCode(phxEvent.clientCode);
    });

    window.electron.onPhoenixConnectError((_electronEvent, phxEvent) => {
      console.error('Phoenix connect error:', phxEvent.error);
      setBackendStatus(BackendConnectionStatus.ERROR);
    });

    window.electron.onPhoenixDisconnected((_electronEvent, phxEvent) => {
      console.log('phx disconnected', phxEvent);
      setBackendStatus(BackendConnectionStatus.DISCONNECTED);
    })

    return () => {
      window.electron.backendClearBindings();
    };
  }, []);

  return [backendStatus, clientCode];
};

export default useBackendConnectionStatus;
