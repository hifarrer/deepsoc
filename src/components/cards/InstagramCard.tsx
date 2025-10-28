'use client'

interface InstagramCardProps {
  post: {
    id: string
    text?: string
    postUrl?: string
    authorMeta?: {
      name: string
      avatar?: string
      verified?: boolean
      followers?: number
    }
    likesCount?: number
    shareCount?: number
    commentsCount?: number
    viewsCount?: number
    creationDate?: string
    thumbnailUrl?: string
    hashtags?: string[]
    mentions?: string[]
    isSponsored?: boolean
  }
}

export default function InstagramCard({ post }: InstagramCardProps) {
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Post Thumbnail */}
      {post.thumbnailUrl && (
        <div className="relative aspect-square bg-gray-100">
          <img
            src={post.thumbnailUrl}
            alt="Instagram post thumbnail"
            className="w-full h-full object-cover"
          />
          {post.isSponsored && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
                Sponsored
              </span>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            {post.authorMeta?.avatar ? (
              <img
                src={post.authorMeta.avatar}
                alt={post.authorMeta.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {post.authorMeta?.name ? post.authorMeta.name.charAt(0).toUpperCase() : 'I'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {post.authorMeta?.name || 'Instagram User'}
              </h3>
              {post.authorMeta?.verified && (
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
            {post.authorMeta?.followers && (
              <p className="text-gray-500 text-sm">
                {formatNumber(post.authorMeta.followers)} followers
              </p>
            )}
          </div>
        </div>

        {/* Post Text */}
        {post.text && (
          <div className="mb-3">
            <p className="text-gray-800 text-sm leading-relaxed">
              {post.text}
            </p>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((hashtag, index) => (
                <span key={index} className="text-purple-600 text-sm">
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            {post.likesCount && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span>{formatNumber(post.likesCount)}</span>
              </div>
            )}
            {post.commentsCount && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>{formatNumber(post.commentsCount)}</span>
              </div>
            )}
            {post.shareCount && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                <span>{formatNumber(post.shareCount)}</span>
              </div>
            )}
          </div>
          {post.creationDate && (
            <span className="text-xs">{formatDate(post.creationDate)}</span>
          )}
        </div>

        {/* Action Button */}
        {post.postUrl && (
          <a
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>View on Instagram</span>
          </a>
        )}
      </div>
    </div>
  )
}
