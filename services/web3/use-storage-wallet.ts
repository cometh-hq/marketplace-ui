import { useState, useEffect } from 'react';

export function useStorageWallet() {
  const [comethWalletAddressInStorage, setComethWalletAddressInStorage] = useState<string | null>(null);

  useEffect(() => {
    const keysInStorage = Object.keys(localStorage);
    for (let key of keysInStorage) {
      if (key.startsWith("cometh-connect")) {
        const keyParts = key.split("-");
        const address = keyParts[keyParts.length - 1];
        console.warn('address', address);
        setComethWalletAddressInStorage(address);
        break;
      }
    }
  }, []);

  return {
    comethWalletAddressInStorage
  };
}