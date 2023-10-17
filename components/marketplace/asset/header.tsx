import { useMemo } from "react"
import { manifest } from "@/manifests"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"

import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/ui/share-button"
import { ProductBlock } from "@/components/asset-actions/product-blocks"
import {
  BreadcrumbContainer,
  BreadcrumbElement,
} from "@/components/bread-crumb"

import Link from "next/link"
import qs from 'qs'
import { shortenTokenId } from "@/lib/utils/token"
import { useNFTFilters } from "@/lib/utils/nft-filters"

export type AssetDetailsProps = {
  asset: AssetWithTradeData
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const attributes = useMemo(() => {
    const mainAttributes = manifest.pages?.asset?.mainAttributes ?? []
    return asset.metadata.attributes?.reduce((p, c) => {
      if (mainAttributes.includes(c.trait_type)) {
        p.push({ trait_type: c.trait_type, value: c.value })
      }
      return p
    }, [] as { trait_type: string, value: string | number | boolean }[])
  }, [asset])

  const links = useMemo(() => {
    return attributes?.map((attribute, index) => {
      const property = attribute.trait_type
      const value = `${attribute.value}`
      const href = `/marketplace?${qs.stringify({
        [property as string]: `${value}`,
      })}`

      return (
        <Link
          key={index}
          href={href}
        >
          <Badge variant="secondary" size="xs">
            {value}
          </Badge>
        </Link>
      )
    })
  }, [attributes, asset])

  return (
    <div className="flex-1 lg:w-[45%] lg:pt-[100px] lg:sticky lg:top-[5%] lg:left-0">
      <div className="flex items-center justify-between mb-2">
        <BreadcrumbContainer>
          <BreadcrumbElement href="/marketplace">
            Marketplace
          </BreadcrumbElement>
          /
          <BreadcrumbElement href={`/marketplace/${asset.metadata.name}`}>
            {asset.metadata.name}
          </BreadcrumbElement>
        </BreadcrumbContainer>
        <ShareButton />
      </div>
      <div className="text-2xl font-bold opacity-90">#{shortenTokenId(asset.tokenId, 2)}</div>
      <h1 className="text-3xl md:text-[48px] leading-[1.15] font-extrabold">
        {asset.metadata.name}
      </h1>
      <div className="mt-2 mb-8 flex flex-wrap items-center gap-2">
        {links}
      </div>
      <ProductBlock asset={asset} />
      <p className="max-md:pb-0 py-6 text-base font-medium text-muted-foreground">{asset.metadata.description}</p>
    </div>
  )
}
