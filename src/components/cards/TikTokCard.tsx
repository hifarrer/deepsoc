'use client'
import Image from 'next/image'

interface TikTokCardProps {
  video: {
    id: string
    text?: string
    textLanguage?: string
    postUrl?: string
    url?: string
    authorMeta?: {
      name: string
      nickName?: string
      avatar?: string
      verified?: boolean
      followers?: number
    }
    authorName?: string
    authorNickname?: string
    authorVerified?: boolean
    authorAvatar?: string
    authorFollowers?: number
    authorFans?: number
    authorHeart?: number
    playCount?: number
    viewsCount?: number
    diggCount?: number
    likesCount?: number
    shareCount?: number
    commentCount?: number
    commentsCount?: number
    coverUrl?: string
    thumbnailUrl?: string
    videoUrl?: string
    createTime?: number
    createTimeISO?: string
    creationDate?: string
    isAd?: boolean
    isSponsored?: boolean
    hashtags?: string[]
    mentions?: string[]
  }
}

export default function TikTokCard({ video }: TikTokCardProps) {
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
  const getAuthorName = () => video.authorMeta?.name || video.authorName || 'TikTok User'
  const getAuthorNickname = () => video.authorMeta?.nickName || video.authorNickname || getAuthorName()
  const getAuthorAvatar = () => video.authorMeta?.avatar || video.authorAvatar
  const getAuthorVerified = () => video.authorMeta?.verified || video.authorVerified || false
  const getAuthorFollowers = () => video.authorMeta?.followers || video.authorFollowers || video.authorFans
  const getThumbnailUrl = () => video.thumbnailUrl || video.coverUrl
  const getPostUrl = () => video.postUrl || video.url
  const getIsSponsored = () => video.isAd || video.isSponsored || false
  const getLikesCount = () => video.likesCount || video.diggCount
  const getCommentsCount = () => video.commentsCount || video.commentCount
  const getViewsCount = () => video.viewsCount || video.playCount
  const getShareCount = () => video.shareCount || 0
  const getCreationDate = () => video.creationDate || video.createTimeISO
  const getHashtags = () => video.hashtags || []

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Video Cover */}
      {getThumbnailUrl() && (
        <div className="relative aspect-[9/16] bg-gray-100">
          <Image
            src={getThumbnailUrl()!}
            alt="TikTok video cover"
            fill
            className="object-cover"
          />
          {getIsSponsored() && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                AD
              </span>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
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
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                {getAuthorName().charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {getAuthorNickname()}
              </h3>
              {getAuthorVerified() && (
                <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
            {getAuthorFollowers() && (
              <p className="text-gray-500 text-sm">
                {formatNumber(getAuthorFollowers())} followers
              </p>
            )}
          </div>
        </div>

        {/* Video Text */}
        {video.text && (
          <div className="mb-3">
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
              {video.text}
            </p>
          </div>
        )}

        {/* Hashtags */}
        {video.hashtags && video.hashtags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {video.hashtags.map((hashtag, index) => (
                <span key={index} className="text-pink-600 text-sm">
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            {getViewsCount() && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span>{formatNumber(getViewsCount())}</span>
              </div>
            )}
            {getLikesCount() && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span>{formatNumber(getLikesCount())}</span>
              </div>
            )}
            {getCommentsCount() && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>{formatNumber(getCommentsCount())}</span>
              </div>
            )}
            {video.shareCount && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                <span>{formatNumber(video.shareCount)}</span>
              </div>
            )}
          </div>
          {getCreationDate() && (
            <span className="text-xs">{formatDate(getCreationDate() || '')}</span>
          )}
        </div>

        {/* Action Button */}
        {getPostUrl() && (
          <a
            href={getPostUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <span>View on TikTok</span>
          </a>
        )}
      </div>
    </div>
  )
}
