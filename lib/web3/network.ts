import { ethers } from "ethers";
import { manifest } from "@/manifests";
import { useState, useEffect } from "react";
import { useSetChain } from '@web3-onboard/react';

export const useCorrectNetwork = () => {
  const [
    {
      connectedChain,
      settingChain 
    },
    setChain 
  ] = useSetChain();

  const hexChain = ethers.utils.hexValue(manifest.network.chainId);
  const [isChainSupported, setIsChainSupported] = useState(false);

  useEffect(() => {
    setIsChainSupported(connectedChain?.id ? connectedChain.id === hexChain : false);
  }, [connectedChain, hexChain]);

  const switchToCorrectNetwork = () => {
    setChain({ chainId: hexChain });
  };

  return {
    isChainSupported,
    switchToCorrectNetwork,
    settingChain,
  };
};