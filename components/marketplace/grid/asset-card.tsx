"use client"

import { AssetWithTradeData, SearchAssetWithTradeData } from "@alembic/nft-api-sdk"
import { cn } from "@/lib/utils/utils"
import { AssetImage } from "@/components/ui/asset-image"
import { Card } from "@/components/ui/card"

import { Price } from "../../ui/price"

import { animated, config, useSpring } from 'react-spring'

import { useBoolean } from 'usehooks-ts'
import { Appear } from "@/components/ui/appear"
import { getRandomArrayElement } from "@/lib/utils/arrays"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useMemo } from "react"
import { MakeBuyOfferButton } from "@/components/asset-actions/buttons/make-buy-offer"
import { SellAssetButton } from "@/components/asset-actions/buttons/sell"
import Link from "next/link"
import { shortenTokenId } from "@/lib/utils/token"

export type AssetCardProps = {
  asset: SearchAssetWithTradeData
  children?: React.ReactNode | React.ReactNode[]
}

export type AssetCardBaseProps = {
  src?: string | null
  color?: string
  owner?: boolean
  children?: React.ReactNode | React.ReactNode[]
  fallback?: string | null
  asset: SearchAssetWithTradeData
}

export type AssetImageContainerProps = {
  children?: React.ReactNode | React.ReactNode[]
  color?: string | null
  className?: string
}

export function AssetImageContainer({
  children,
  color,
  className
}: AssetImageContainerProps) {
  const active = useBoolean(false)
  const hover = useBoolean(false)

  const style = useSpring({
    to: {
      transform: hover.value
        ? `rotateX(2deg) rotateY(0deg) rotateZ(0deg) translateY(-8px) scale(${
            active.value ? 0.95 : 1.01
          })`
        : `rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0px) scale(${
            active.value ? 0.95 : 1
          })`,
    },
    config: config.gentle,
  })

  return (
    <animated.div
      className="z-10"
      onMouseEnter={hover.setTrue}
      onMouseLeave={hover.setFalse}
      onMouseDown={active.setTrue}
      onMouseUp={active.setFalse}
      style={style}
    >
      <div
        className={cn(
          "relative h-auto w-[84px] overflow-hidden rounded-xl p-2 sm:p-4 sm:h-[380px] sm:w-full transition-all ease-in-out duration-200",
          !color && "bg-muted max-sm:rounded-md",
          className
        )}
        style={
          color
            ? {
                backgroundColor: color,
              }
            : {}
        }
      >
        {children}
      </div>
    </animated.div>
  )
}

export function AssetCardBase({
  src,
  fallback,
  children,
  color,
  owner,
  asset
}: AssetCardBaseProps) {
  return (
    <Appear
      enabled={true}
      condition={!!true}
      delay={getRandomArrayElement([0, 50, 100, 150, 200])}
      className="relative cursor-pointer justify-self-center w-full"
    >
        <Card
          className={cn(
            "flex w-full flex-1 flex-row items-center gap-3 sm:inline-flex sm:flex-col sm:items-start sm:border-2 border-transparent bg-transparent p-0 shadow-none transition-all ease-in-out duration-200",
          )}
        >
          <Link href={`/marketplace/${asset.tokenId}`}>
            <AssetImageContainer color={color} className={cn(owner && "bg-[#f4f2e8]")}>
              <AssetImage
                src={src}
                fallback={fallback}
                height={380}
                width={320}
                className="z-20 h-full w-full rounded-lg object-contain"
              />
            </AssetImageContainer>
          </Link>
          <div className="w-full">{children}</div>
        </Card>
    </Appear>
  )
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const viewerAddress = useCurrentViewerAddress()

  const owner = useMemo(() => {
    return asset.owner === viewerAddress
  }, [viewerAddress, asset.owner])

  if (!asset.metadata.name) {
    return null
  }

  return (
    <AssetCardBase
      // color={color}
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      owner={owner}
      asset={asset}
    >
      <div>
        <Link
          href={`/marketplace/${asset.tokenId}`}
          className={cn("flex items-center flex-nowrap text-base leading-tight font-semibold text-primary mb-4 sm:mb-2")}>
          <span className="inline-block max-w-[100%_-_80px] truncate">{asset.metadata.name}</span>
          <span>&nbsp;#{shortenTokenId(asset.tokenId, 2)}</span>
        </Link>
        <div className="bg-muted/80 rounded-lg p-3 w-full">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="text-[12px] font-medium">Price</div>
              {
                asset.orderbookStats.lowestSalePrice 
                  ? <Price amount={asset.orderbookStats.lowestSalePrice} />
                  : (owner ? <SellAssetButton asset={asset as unknown as AssetWithTradeData} isVariantLink /> : 'Not listed yet')
              }
            </div>
            <div className="text-sm">
              <div className="text-[12px] font-medium">Highest bid</div>
              <div className="text-end">
                {
                  asset.orderbookStats.lowestSalePrice 
                    ? <Price amount={asset.orderbookStats.lowestSalePrice} />
                    : (!owner ? <MakeBuyOfferButton asset={asset as unknown as AssetWithTradeData} isVariantLink /> : 'No offers yet')
                }
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </AssetCardBase>
  )
}