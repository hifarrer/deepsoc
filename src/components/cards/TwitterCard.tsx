'use client'

interface TwitterCardProps {
  tweet: {
    id: string
    text: string
    fullText?: string
    url: string
    tweetCreatedAt: string
    retweetCount: number
    replyCount: number
    likeCount: number
    quoteCount: number
    viewCount?: number
    authorName: string
    authorUsername: string
    authorVerified: boolean
    authorAvatar?: string
    authorFollowers?: number
    mediaUrls: string[]
    isReply: boolean
    isRetweet: boolean
    isQuote: boolean
  }
}

export default function TwitterCard({ tweet }: TwitterCardProps) {
  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0">
          {tweet.authorAvatar ? (
            <img
              src={tweet.authorAvatar}
              alt={tweet.authorName || 'User avatar'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {tweet.authorName ? tweet.authorName.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <a 
              href={`https://x.com/${tweet.authorUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors"
            >
              {tweet.authorName || 'Unknown User'}
            </a>
            {tweet.authorVerified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            )}
          </div>
          <a 
            href={`https://x.com/${tweet.authorUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-sm hover:text-blue-600 transition-colors"
          >
            @{tweet.authorUsername}
          </a>
          {tweet.authorFollowers && (
            <p className="text-gray-400 text-xs">
              {formatNumber(tweet.authorFollowers)} followers
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <a
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Tweet Type Indicators */}
      {(tweet.isReply || tweet.isRetweet || tweet.isQuote) && (
        <div className="flex space-x-2 mb-3">
          {tweet.isReply && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              Reply
            </span>
          )}
          {tweet.isRetweet && (
            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
              Retweet
            </span>
          )}
          {tweet.isQuote && (
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              Quote Tweet
            </span>
          )}
        </div>
      )}

      {/* Tweet Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">
          {tweet.fullText || tweet.text}
        </p>
      </div>

      {/* Media */}
      {tweet.mediaUrls && tweet.mediaUrls.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${
            tweet.mediaUrls.length === 1 ? 'grid-cols-1' :
            tweet.mediaUrls.length === 2 ? 'grid-cols-2' :
            tweet.mediaUrls.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {tweet.mediaUrls.slice(0, 4).map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Tweet media ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {tweet.mediaUrls && tweet.mediaUrls.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{tweet.mediaUrls ? tweet.mediaUrls.length - 4 : 0} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>{formatNumber(tweet.replyCount)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>{formatNumber(tweet.retweetCount)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{formatNumber(tweet.likeCount)}</span>
          </div>
          {tweet.viewCount && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>{formatNumber(tweet.viewCount)}</span>
            </div>
          )}
        </div>
        <span className="text-xs">{formatDate(tweet.tweetCreatedAt)}</span>
      </div>
    </div>
  )
}
