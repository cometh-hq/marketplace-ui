import { useCallback, useRef, useState } from "react"
import Image, { ImageProps } from "next/image"

export const getImageURL = (src?: string | null) => {
  if (!src) return null
  return src.startsWith("ipfs")
    ? `https://ipfs.io/ipfs/${src.replace("ipfs://", "")}`
    : src
}

export type AssetImageProps = {
  src?: string | null
  fallback?: string | null
  imageData?: string | null
  name?: string
} & Omit<ImageProps, "src" | "alt" | "onError" | "quality">

export function AssetImage({
  src,
  name,
  imageData,
  fallback,
  ...props
}: AssetImageProps) {
  const [_src, setSrc] = useState(getImageURL(src ?? fallback ?? null))

  const tried = useRef(false)
  const onError = useCallback(() => {
    if (tried.current || _src === fallback) return
    tried.current = true
    setSrc(getImageURL(fallback) ?? null)
  }, [_src, fallback])

  if (imageData && imageData.startsWith("<svg")) {
    return (
      <div
        className="z-20 h-full w-full bg-background"
        dangerouslySetInnerHTML={{ __html: imageData }}
      />
    )
  }

  if (!_src) {
    return <div className="z-20 h-full w-full bg-background" />
  }

  return (
    <Image
      src={_src}
      alt={name ?? "Asset image"}
      onError={onError}
      quality={80}
      onLoad={props.onLoad}
      {...props}
    />
  )
}
