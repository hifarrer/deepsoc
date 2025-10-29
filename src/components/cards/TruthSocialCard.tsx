'use client'
import Image from 'next/image'

interface TruthSocialCardProps {
  post: any
}

export default function TruthSocialCard({ post }: TruthSocialCardProps) {
  // Helper functions to safely access nested properties
  const getContent = () => post.content || post.text || ''
  const getUrl = () => post.url || ''
  const getCardTitle = () => post.cardTitle || post.card?.title || ''
  const getCardDescription = () => post.cardDescription || post.card?.description || ''
  const getCardImage = () => post.cardImage || post.card?.image || ''
  const getCardUrl = () => post.cardUrl || post.card?.url || ''
  const getCardType = () => post.cardType || post.card?.type || ''
  const getRepliesCount = () => post.repliesCount || post.replies_count || 0
  const getReblogsCount = () => post.reblogsCount || post.reblogs_count || 0
  const getFavouritesCount = () => post.favouritesCount || post.favourites_count || 0
  const getCreatedAt = () => post.createdAt || post.created_at || ''
  const getLanguage = () => post.language || ''
  const getVisibility = () => post.visibility || ''
  
  // Author information
  const getAuthorName = () => post.authorName || post.account?.display_name || ''
  const getAuthorUsername = () => post.authorUsername || post.account?.username || ''
  const getAuthorAvatar = () => post.authorAvatar || post.account?.avatar || ''
  const getAuthorHeader = () => post.authorHeader || post.account?.header || ''

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

  const truncateText = (text: string, maxLength: number = 200) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Author Header Image */}
      {getAuthorHeader() && (
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={getAuthorHeader()!}
            alt={`${getAuthorName() || getAuthorUsername() || 'Truth Social'} header`}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}
      
      {/* Card Image/Media (only if no header image) */}
      {!getAuthorHeader() && getCardImage() && (
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={getCardImage()!}
            alt={getCardTitle() || 'Truth Social post'}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Author Information */}
        {(getAuthorName() || getAuthorUsername()) && (
          <div className="flex items-center space-x-3 mb-4">
            {getAuthorAvatar() && (
              <div className="flex-shrink-0">
                <Image
                  src={getAuthorAvatar()!}
                  alt={getAuthorName() || getAuthorUsername() || 'Author'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {getAuthorName() && (
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getAuthorName()}
                </p>
              )}
              {getAuthorUsername() && (
                <p className="text-xs text-gray-500 truncate">
                  @{getAuthorUsername()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 text-sm leading-relaxed">
            {truncateText(getContent())}
          </p>
        </div>

        {/* Card Preview */}
        {getCardTitle() && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-start space-x-3">
              {getCardImage() && (
                <div className="flex-shrink-0">
                  <Image
                    src={getCardImage()!}
                    alt={getCardTitle()}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {getCardTitle()}
                </h4>
                {getCardDescription() && (
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {truncateText(getCardDescription(), 100)}
                  </p>
                )}
                {getCardUrl() && (
                  <p className="text-blue-600 text-xs mt-1 truncate">
                    {getCardUrl().replace(/^https?:\/\//, '')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              {formatNumber(getRepliesCount())} replies
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              {formatNumber(getReblogsCount())} reblogs
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {formatNumber(getFavouritesCount())} favorites
            </span>
          </div>
          {getCreatedAt() && (
            <span>{formatDate(getCreatedAt())}</span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            {getLanguage() && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                {getLanguage().toUpperCase()}
              </span>
            )}
            {getVisibility() && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                {getVisibility()}
              </span>
            )}
            {getCardType() && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                {getCardType()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <a
            href={getUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
            title="View on Truth Social"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
          
          {getCardUrl() && (
            <a
              href={getCardUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-600 transition-colors"
              title="Open linked content"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
