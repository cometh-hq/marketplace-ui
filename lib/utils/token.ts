
export const shortenTokenId = (tokenId: string, chars = 2): string => {
  if (tokenId.length <= chars) {
    return tokenId;
  }

  return `${tokenId.slice(0, 2)}...${tokenId.slice(
    tokenId.length - chars
  )}`
}
