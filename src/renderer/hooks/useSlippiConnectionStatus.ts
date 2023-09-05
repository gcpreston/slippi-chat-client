import { useState, useEffect } from 'react';

import { SlippiClientConnectionStatus } from '../../slippi/types';

const useSlippiConnectionStatus = () => {
  const [slippiStatus, setSlippiStatus] = useState(SlippiClientConnectionStatus.DISCONNECTED);

  useEffect(() => {
    window.electron.onSlippiStatusChanged((_electronEvent, slpEvent) => {
      setSlippiStatus(slpEvent.status);
    });
  });

  return slippiStatus;
};

export default useSlippiConnectionStatus;
