import {
  useAssetOwnedQuantity,
  useIsViewerAnOwner,
} from "@/services/cometh-marketplace/assetOwners"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { UserLink } from "@/components/ui/user/UserLink"
import { useUpdateTabQueryParam } from "@/components/activities/asset-details/tabs/pageTabHooks"
import { AuthenticationButton } from "@/components/AuthenticationButton"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantity from "@/components/erc1155/TokenQuantity"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlockContainer"

import { BuyAssetButton } from "../buttons/BuyAssetButton"
import { CancelListingButton } from "../buttons/CancelListingButton"
import { MakeBuyOfferButton } from "../buttons/MakeBuyOfferPriceDialog"
import { SellAssetButton } from "../buttons/SellAssetButton"
import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { BestOfferColumn } from "./BestOfferColumn"

export type ProductBlockProps = {
  asset: AssetWithTradeData
}

export function ProductBlock({ asset }: ProductBlockProps) {
  const isOnSale = !!asset.orderbookStats.lowestListingPrice

  const isViewerAnOwner = useIsViewerAnOwner(asset)
  const assetOwnedQuantity = useAssetOwnedQuantity(asset)
  const isAsset1155 = useAssetIs1155(asset)
  const updateTabQueryParam = useUpdateTabQueryParam()
  const isAsset721 = !isAsset1155

  const listingPrice = asset.orderbookStats.lowestListingPrice

  const shouldDisplaySellButton = isViewerAnOwner && (isAsset1155 || !isOnSale)
  const shouldDisplayBuyButton = isOnSale && (isAsset1155 || !isViewerAnOwner)
  const shoulmdDisplayMakeOfferButton = isAsset1155 || !isViewerAnOwner
  const shouldDisplayCancelListingButton =
    isAsset721 && isOnSale && isViewerAnOwner

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>
          {isAsset1155 ? "Cheapest listing" : "Price"}
        </ProductBlockLabel>
        <Price size="lg" amount={listingPrice} shouldDisplayFiatPrice={true} />
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      {asset.owner && isOnSale && isAsset721 && (
        <ProductBlockDividedColumn>
          <ProductBlockLabel>Listed by</ProductBlockLabel>
          <UserLink
            className="mt-1"
            user={{ address: asset.owner as Address }}
          />
        </ProductBlockDividedColumn>
      )}

      <div className="flex w-full">
        {isAsset1155 && (
          <div className=" mr-2 rounded-lg border px-3 py-1 text-sm font-semibold">
            Supply:{" "}
            <TokenQuantity value={asset.supply} />
          </div>
        )}
        {isViewerAnOwner && (
          <div className="border-owner rounded-lg border px-3 py-1 text-sm font-semibold">
            Owned
            {isAsset1155 && (
              <>
                {": "}
                <TokenQuantity value={assetOwnedQuantity} />
              </>
            )}
          </div>
        )}
      </div>

      <ProductBlockCenteredColumn>
        <AuthenticationButton fullVariant customText="Login to buy">
          <SwitchNetwork>
            {shouldDisplaySellButton && (
              <SellAssetButton asset={asset} size="lg" />
            )}
            {shouldDisplayBuyButton &&
              (isAsset721 ? (
                <BuyAssetButton asset={asset} />
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => updateTabQueryParam("listings")}
                >
                  Buy now
                </Button>
              ))}
            {shoulmdDisplayMakeOfferButton && (
              <MakeBuyOfferButton variant="secondary" asset={asset} />
            )}
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>

      {shouldDisplayCancelListingButton && (
        <ProductBlockCenteredColumn>
          <AuthenticationButton fullVariant>
            <SwitchNetwork>
              <CancelListingButton asset={asset} />
            </SwitchNetwork>
          </AuthenticationButton>
        </ProductBlockCenteredColumn>
      )}
    </ProductBlockContainer>
  )
}
