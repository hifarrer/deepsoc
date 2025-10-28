'use client'
import Image from 'next/image'

interface FacebookCardProps {
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

export default function FacebookCard({ post }: FacebookCardProps) {
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

  // Helper functions to get data from either structure
  const getAuthorName = () => post.authorMeta?.name || 'Facebook User'
  const getAuthorAvatar = () => post.authorMeta?.avatar
  const getAuthorVerified = () => post.authorMeta?.verified || false
  const getThumbnailUrl = () => post.thumbnailUrl || ''
  const getPostUrl = () => post.postUrl || ''
  const getLikesCount = () => post.likesCount || 0
  const getShareCount = () => post.shareCount || 0
  const getCommentsCount = () => post.commentsCount || 0
  const getViewsCount = () => post.viewsCount || 0
  const getCreationDate = () => post.creationDate || ''
  const getHashtags = () => post.hashtags || []

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Post Thumbnail */}
      {getThumbnailUrl() && (
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={getThumbnailUrl()}
            alt="Facebook post thumbnail"
            fill
            className="object-cover"
          />
          {post.isSponsored && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                Sponsored
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            {getAuthorAvatar() ? (
              <Image
                src={getAuthorAvatar()!}
                alt={getAuthorName()}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {getAuthorName().charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {getAuthorName()}
              </h3>
              {getAuthorVerified() && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
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
                <span key={index} className="text-blue-600 text-sm">
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            {getLikesCount() > 0 && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span>{formatNumber(getLikesCount())}</span>
              </div>
            )}
            {getCommentsCount() > 0 && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>{formatNumber(getCommentsCount())}</span>
              </div>
            )}
            {getShareCount() > 0 && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                <span>{formatNumber(getShareCount())}</span>
              </div>
            )}
          </div>
          {getCreationDate() && (
            <span className="text-xs">{formatDate(getCreationDate())}</span>
          )}
        </div>

        {/* Action Button */}
        {getPostUrl() && (
          <a
            href={getPostUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>View on Facebook</span>
          </a>
        )}
      </div>
    </div>
  )
}
