export const shortenTokenId = (tokenId: string, chars: number): string => {
  if (tokenId.length <= chars) {
    return tokenId;
  }

  return `${tokenId.slice(0, chars)}...${tokenId.slice(
    tokenId.length - chars
  )}`
}
  