'use client'
import Image from 'next/image'

interface YouTubeCardProps {
  video: any
}

export default function YouTubeCard({ video }: YouTubeCardProps) {
  // Helper functions to safely access nested properties
  const getTitle = () => video.title || video.text || 'Untitled Video'
  const getDescription = () => video.description || video.text || ''
  const getChannelName = () => video['authorMeta.name'] || video.channelName || video.authorMeta?.name || video.authorName || 'Unknown Channel'
  const getChannelUrl = () => video.channelUrl || video['authorMeta.url'] || video.authorMeta?.url || ''
  const getThumbnailUrl = () => video.thumbnailUrl || video.thumbnail || ''
  const getVideoUrl = () => video.postUrl || video.videoUrl || video.url || ''
  const getViewsCount = () => video.viewsCount || video.viewCount || video.views || 0
  const getLikesCount = () => video.likesCount || video.likeCount || video.likes || 0
  const getCommentsCount = () => video.commentsCount || video.commentCount || video.comments || 0
  const getCreationDate = () => video.creationDate || video.publishedAt || video.createdAt || ''
  const getDuration = () => video.duration || video.lengthSeconds || ''
  const getHashtags = () => video.hashtags || []

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const formatDuration = (seconds: string | number) => {
    if (!seconds) return ''
    const totalSeconds = typeof seconds === 'string' ? parseInt(seconds) : seconds
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        {getThumbnailUrl() ? (
          <Image
            src={getThumbnailUrl()!}
            alt={getTitle()}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        )}
        
        {/* Duration overlay */}
        {getDuration() && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(getDuration())}
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={getVideoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform duration-200"
            title="Watch on YouTube"
          >
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {getTitle()}
        </h3>

        {/* Channel */}
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            {getChannelUrl() ? (
              <a
                href={getChannelUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 truncate hover:text-red-600 transition-colors"
              >
                {getChannelName()}
              </a>
            ) : (
              <p className="text-sm text-gray-600 truncate">
                {getChannelName()}
              </p>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              {formatNumber(getViewsCount())} views
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              {formatNumber(getLikesCount())}
            </span>
          </div>
          {getCreationDate() && (
            <span>{formatDate(getCreationDate())}</span>
          )}
        </div>

        {/* Description */}
        {getDescription() && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {getDescription()}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <a
            href={getVideoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
          
          {getChannelUrl() && (
            <a
              href={getChannelUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
