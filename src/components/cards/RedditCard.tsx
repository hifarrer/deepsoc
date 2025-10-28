'use client'

interface RedditCardProps {
  post: {
    id: string
    dataType: string
    title?: string
    text?: string
    url: string
    subreddit?: string
    authorName?: string
    authorAvatar?: string
    score?: number
    upvoteRatio?: number
    numComments?: number
    mediaUrls: string[]
    createdAt?: string
  }
}

export default function RedditCard({ post }: RedditCardProps) {
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
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.authorName || 'Reddit user'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'R'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {post.subreddit && (
              <span className="text-orange-600 font-medium text-sm">
                r/{post.subreddit}
              </span>
            )}
            {post.authorName && (
              <a
                href={`https://www.reddit.com/user/${post.authorName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-sm hover:text-orange-600 transition-colors"
              >
                • u/{post.authorName}
              </a>
            )}
          </div>
          {post.createdAt && (
            <p className="text-gray-400 text-xs">
              {formatDate(post.createdAt)}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Content Type Indicator */}
      <div className="mb-3">
        <span className={`px-2 py-1 text-xs rounded-full ${
          post.dataType === 'community' 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {post.dataType === 'community' ? 'Community' : 'Post'}
        </span>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
          {post.title}
        </h3>
      )}

      {/* Text Content */}
      {post.text && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {post.text.length > 300 
              ? `${post.text.substring(0, 300)}...` 
              : post.text
            }
          </p>
        </div>
      )}

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${
            post.mediaUrls.length === 1 ? 'grid-cols-1' :
            post.mediaUrls.length === 2 ? 'grid-cols-2' :
            post.mediaUrls.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.mediaUrls.slice(0, 4).map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Reddit media ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {post.mediaUrls && post.mediaUrls.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{post.mediaUrls ? post.mediaUrls.length - 4 : 0} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {post.score !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14l3-3 3 3 5-5M5 7l5 5 5-5"/>
              </svg>
              <span>{formatNumber(post.score)}</span>
            </div>
          )}
          {post.numComments !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span>{formatNumber(post.numComments)} comments</span>
            </div>
          )}
          {post.upvoteRatio !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span>{Math.round(post.upvoteRatio * 100)}% upvoted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
