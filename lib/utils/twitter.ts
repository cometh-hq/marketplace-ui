import { useCallback } from "react"

const buildTweet = ({
  pageUrl,
  tweetContent,
}: {
  tweetContent: string | undefined
  pageUrl: string
}) => {
  if (tweetContent !== undefined) {
    const characterTotal = tweetContent.length + pageUrl.length
    if (characterTotal + 19 < 280) {
      return encodeURIComponent(`${tweetContent} – `)
    }
    const amountToTrim = 280 - (pageUrl.length + 19)
    return encodeURIComponent(`"${tweetContent.slice(0, amountToTrim)}..." – `)
  }
  return ""
}

const buildTargetLink = (quote: string) => {
  const pageUrl = encodeURIComponent(window.location.href)
  const twitterLink = (tweetContent: string) =>
    `https://twitter.com/intent/tweet?text=${tweetContent}&url=${pageUrl}`
  const tweet = buildTweet({
    pageUrl,
    tweetContent: quote,
  })
  return twitterLink(tweet)
}

export const useTwitterShare = () => {
  const shareOnTwitter = useCallback((quote: string) => {
    const twitterURL = buildTargetLink(quote)
    window.open(twitterURL, "_blank")
  }, [])

  return { shareOnTwitter }
}
