"use client"

import { useMemo } from "react"
import Link from "next/link"
import { manifest } from "@/manifests/manifests"
import {
  AssetAttribute,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { animated, config, useSpring } from "react-spring"
import { useBoolean } from "usehooks-ts"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { getRandomArrayElement } from "@/lib/utils/arrays"
import { getAssetColor } from "@/lib/utils/colorsAttributes"
import { cn } from "@/lib/utils/utils"
import { Appear } from "@/components/ui/Appear"
import { AssetImage } from "@/components/ui/AssetImage"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Price } from "@/components/ui/Price"
import { BuyAssetButton } from "@/components/asset-actions/buttons/BuyAssetButton"
import { CancelListingButton } from "@/components/asset-actions/buttons/CancelListingButton"
import { MakeBuyOfferButton } from "@/components/asset-actions/buttons/MakeBuyOfferPriceDialog"
import { SellAssetButton } from "@/components/asset-actions/buttons/SellAssetButton"
import { SwitchNetwork } from "@/components/asset-actions/buttons/SwitchNetwork"

import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantity from "@/components/erc1155/TokenQuantity"

import {
  useAssetOwnedQuantity,
  useIsViewerAnOwner,
} from "../../../services/cometh-marketplace/assetOwners"
import { AuthenticationButton } from "@/components/login/AuthenticationButton"

export type AssetCardProps = {
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  }
  children?: React.ReactNode | React.ReactNode[]
}

export type AssetCardBaseProps = {
  src?: string | null
  isViewerAnOwner: boolean
  children?: React.ReactNode | React.ReactNode[]
  fallback?: string | null
  asset: SearchAssetWithTradeData
}

export type AssetImageContainerProps = {
  children?: React.ReactNode | React.ReactNode[]
  color?: string | null
  className?: string
  isHovered?: boolean
  imageAspectRatio?: number
}

export function AssetImageContainer({
  children,
  color,
  className,
  isHovered,
  imageAspectRatio: imageAspectRatio,
}: AssetImageContainerProps) {
  const style = useSpring({
    to: {
      transform: isHovered ? `scale(${1.05})` : `scale(${1})`,
    },
    config: config.gentle,
  })

  const dynamicRatio = useMemo(() => {
    return {
      aspectRatio: imageAspectRatio || 1,
    }
  }, [imageAspectRatio])
  return (
    <div className="h-full overflow-hidden">
      <animated.div className="z-10 h-full" style={style}>
        <div
          className={cn(
            "relative size-auto h-full overflow-hidden p-2  sm:w-full",
            !color && "bg-muted",
            className
          )}
          style={dynamicRatio}
        >
          {children}
        </div>
      </animated.div>
    </div>
  )
}

export function AssetCardBase({
  src,
  fallback,
  children,
  isViewerAnOwner,
  asset,
}: AssetCardBaseProps) {
  const isHovered = useBoolean(false)
  const imageAspectRatio =
    globalConfig.collectionSettingsByAddress[
      asset.contractAddress.toLowerCase() as Address
    ].imageAspectRatio
  const isErc1155 = useAssetIs1155(asset)
  const assetOwnedQuantity = useAssetOwnedQuantity(asset)

  const cardTextHeightsClass = manifest.fiatCurrency.enable
    ? "sm:h-[110px]"
    : "sm:h-[100px]"

  return (
    <Appear
      enabled={false}
      condition={true}
      delay={getRandomArrayElement([0, 25, 50, 75, 100])}
      className={cn(" relative w-full justify-self-center rounded-lg")}
    >
      <Card
        onMouseEnter={isHovered.setTrue}
        onMouseLeave={isHovered.setFalse}
        className={cn(
          isViewerAnOwner ? "border-owner" : "border-muted",
          isHovered.value && "shadow-md",
          "min-h-[140px]",
          "  flex  w-full flex-1 flex-row items-stretch overflow-hidden duration-200 ease-in-out first-letter:transition-all sm:inline-flex sm:flex-col sm:items-start sm:border-2"
        )}
      >
        <div className="relative  w-1/3 sm:w-full">
          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(isHovered.value && "brightness-90", "block h-full")}
          >
            <AssetImageContainer
              color={getAssetColor(asset)}
              isHovered={isHovered.value}
              imageAspectRatio={imageAspectRatio}
            >
              <AssetImage
                src={src}
                fallback={fallback}
                imageData={asset.metadata.image_data}
                fill
                className="z-20 size-full  object-cover"
              />
            </AssetImageContainer>
          </Link>

          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              !isErc1155 && "hidden",
              "bg-foreground/20 text-background absolute left-2 top-2 rounded-lg px-3 py-1 text-sm font-semibold"
            )}
          >
            <TokenQuantity value={asset.supply} />
          </Link>

          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              (!isErc1155 || !assetOwnedQuantity) && "hidden",
              "bg-foreground/20 text-background border-owner absolute right-2 top-2 rounded-lg border px-3 py-1 text-sm font-semibold"
            )}
          >
            Owned: <TokenQuantity value={assetOwnedQuantity} />
          </Link>

          <div
            className={cn(
              !isHovered.value && "hidden",
              "absolute bottom-4 left-1/2 -translate-x-1/2"
            )}
          >
            <AssetActions asset={asset} isViewerAnOwner={isViewerAnOwner} />
          </div>
        </div>

        <div className={cn(cardTextHeightsClass, "h-full w-2/3 sm:w-full")}>
          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              "text-primary flex h-full flex-nowrap text-sm font-semibold leading-tight "
            )}
          >
            <div className="w-full">{children}</div>
          </Link>
        </div>
      </Card>
    </Appear>
  )
}

function AssetListingsButton({ asset }: { asset: SearchAssetWithTradeData }) {
  return (
    <Link href={`/nfts/${asset.contractAddress}/${asset.tokenId}?tab=listings#tabs`}>
      <Button className="w-full" size="lg">
        Listings
      </Button>
    </Link>
  )
}


function AssetActions({
  asset,
  isViewerAnOwner,
}: {
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  }
  isViewerAnOwner: boolean
}) {
  const isAsset1155 = useAssetIs1155(asset)

  let button = undefined
  let buttonText = ""
  if (asset.orderbookStats.lowestListingPrice && !isViewerAnOwner) {
    buttonText = "Buy now "
    if (!isAsset1155) {
      button = <BuyAssetButton asset={asset} />
    } else {
      button = <AssetListingsButton asset={asset} />
    }
  } else if (!isViewerAnOwner) {
    button = <MakeBuyOfferButton asset={asset} />
    buttonText = "Make an offer"
  } else if (!asset.orderbookStats.lowestListingPrice || isAsset1155) {
    if (isAsset1155 && asset.orderbookStats.lowestListingPrice) {
      button = (
        <div className='flex flex-col items-center justify-center gap-2'>
          <SellAssetButton asset={asset} />
          <AssetListingsButton asset={asset} />
        </div>
      )
    } else {
      button = <SellAssetButton asset={asset} />
      buttonText = "Sell now"
    }
  } else {
    button = <CancelListingButton asset={asset} />
    buttonText = "Cancel listing"
  }

  if (button) {
    return (
      <div className="hidden sm:block">
        <AuthenticationButton customText={buttonText}>
          <SwitchNetwork>{button}</SwitchNetwork>
        </AuthenticationButton>
      </div>
    )
  }
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const isViewerAnOwner = useIsViewerAnOwner(asset)

  return (
    <AssetCardBase
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      isViewerAnOwner={isViewerAnOwner}
      asset={asset}
    >
      <div className="p-3">
        <span className="inline-block max-w-[100%_-_80px] truncate text-base">
          {asset.metadata.name ? asset.metadata.name : "Unknown NFT"}
        </span>
        {/* <div className="mb-2">#{shortenTokenId(asset.tokenId, 5)}</div> */}

        <div className="w-full rounded-lg">
          <div className="flex flex-col items-start justify-between gap-1 sm:flex-row">
            <div>
              <div className="text-sm font-medium">Price</div>
              {asset.orderbookStats.lowestListingPrice ? (
                <Price
                  size="sm"
                  amount={asset.orderbookStats.lowestListingPrice}
                  shouldDisplayFiatPrice={true}
                  fiatPriceNewLine={true}
                />
              ) : (
                "Not for sale"
              )}
            </div>
            <div>
              {asset.orderbookStats.highestOfferPrice && (
                <>
                  <div className="text-sm font-medium">Best offer</div>
                  <Price
                    size="sm"
                    amount={asset.orderbookStats.highestOfferPrice}
                    shouldDisplayFiatPrice={true}
                    fiatPriceNewLine={true}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </AssetCardBase>
  )
}
