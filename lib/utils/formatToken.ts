export const shortenTokenId = (tokenId: string, chars: number): string => {
  if (tokenId.length <= chars) {
    return tokenId
  }

  const ellipsis = "..."
  const charsToShow = chars - ellipsis.length
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return (
    tokenId.slice(0, frontChars) +
    ellipsis +
    tokenId.slice(tokenId.length - backChars)
  )
}
