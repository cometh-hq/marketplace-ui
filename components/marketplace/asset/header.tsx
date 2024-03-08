import { useMemo } from "react"
import Link from "next/link"
import { manifest } from "@/manifests"
import { useGetCollection } from "@/services/cometh-marketplace/collection"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import qs from "qs"
import { Address } from "viem"

import { shortenTokenId } from "@/lib/utils/token"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/ui/share-button"
import { ProductBlock } from "@/components/asset-actions/product-blocks"
import {
  BreadcrumbContainer,
  BreadcrumbElement,
} from "@/components/bread-crumb"

export type AssetDetailsProps = {
  asset: AssetWithTradeData
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const { data: collection } = useGetCollection(
    asset.contractAddress as Address
  )
  const attributes = useMemo(() => {
    const mainAttributes = manifest.pages?.asset?.mainAttributes ?? []
    return asset.metadata.attributes?.reduce(
      (p, c) => {
        if (mainAttributes.includes(c.trait_type)) {
          p.push({ trait_type: c.trait_type, value: c.value || "null" })
        }
        return p
      },
      [] as { trait_type: string; value: string | number | boolean }[]
    )
  }, [asset])

  const links = useMemo(() => {
    return attributes?.map((attribute, index) => {
      const property = attribute.trait_type
      const value = `${attribute.value}`
      const href = `/nfts/${asset.contractAddress}?${qs.stringify({
        [property as string]: `${value}`,
      })}`

      return (
        <Link key={index} href={href}>
          <Badge variant="outline" size="default">
            <span className="mr-1 opacity-60">{property}:</span> {value}
          </Badge>
        </Link>
      )
    })
  }, [attributes, asset.contractAddress])

  return (
    <div className="flex-1 lg:sticky lg:left-0 lg:top-[5%] lg:w-[35%] lg:pt-[100px]">
      <div className="mb-2 flex items-center justify-between">
        <BreadcrumbContainer>
          <BreadcrumbElement href={"/nfts/" + collection?.address}>
            {collection ? collection.name : "Marketplace"}
          </BreadcrumbElement>
          /
          <BreadcrumbElement
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
          >
            {asset.metadata.name}
          </BreadcrumbElement>
        </BreadcrumbContainer>
        <ShareButton />
      </div>
      <div className="text-2xl font-bold opacity-90">
        #{shortenTokenId(asset.tokenId, 7)}
      </div>
      <h1 className="text-3xl font-bold leading-[1.15] md:text-[48px]">
        {asset.metadata.name}
      </h1>
      <div className="mb-8 mt-2 flex flex-wrap items-center gap-2">{links}</div>
      <ProductBlock asset={asset} />
      <p className="text-muted-foreground py-6 text-base font-medium max-md:pb-0">
        {asset.metadata.description}
      </p>
    </div>
  )
}
