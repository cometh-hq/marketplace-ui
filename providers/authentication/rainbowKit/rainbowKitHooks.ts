import { useConnectModal } from "@rainbow-me/rainbowkit";

export const useOpenLoginModal = () => {
  const { openConnectModal } = useConnectModal();
  return openConnectModal
} 