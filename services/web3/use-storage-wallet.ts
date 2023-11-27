import { useState, useEffect } from 'react';

export function useStorageWallet() {
  const [comethWalletAddressInStorage, setComethWalletAddressInStorage] = useState<string | null>(null);

  useEffect(() => {
    const keysInStorage = Object.keys(localStorage);
    for (let key of keysInStorage) {
      if (key.startsWith("cometh-connect")) {
        const address = key.split("-")[2];
        setComethWalletAddressInStorage(address);
        break;
      }
    }
  }, []);

  return {
    comethWalletAddressInStorage
  };
}