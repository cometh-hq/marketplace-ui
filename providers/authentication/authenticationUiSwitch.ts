"use client"

import { manifest } from "@/manifests/manifests"
import { AuthenticationUiLibrary } from "@/manifests/types"
import * as rainbowKit from "@/providers/authentication/rainbowKit/rainbowKitWagmiProvider"
import * as web3Modal from "@/providers/authentication/web3Modal/web3ModalWagmiProvider"

const authVariables =
  manifest.authenticationUiType === AuthenticationUiLibrary.RAINBOW_KIT ? rainbowKit : web3Modal

export const wagmiConfig = authVariables.wagmiConfig
export const useOpenLoginModal = authVariables.useOpenLoginModal
export const MarketplaceWagmiProvider = authVariables.MarketplaceWagmiProvider
