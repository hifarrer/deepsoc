'use client'

import { useEffect, useState } from 'react'

interface ProgressData {
  searchId: string
  status: string
  progress: {
    completed: number
    total: number
    percentage: number
  }
  platforms: {
    twitter: string
    reddit: string
    tiktok: string
    instagram: string
    youtube: string
    truthSocial: string
  }
}

interface ProgressTrackerProps {
  searchId: string
  onComplete: () => void
  onError: (error: string) => void
}

export default function ProgressTracker({ searchId, onComplete, onError }: ProgressTrackerProps) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (!searchId || !isPolling) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/search/${searchId}/status`)
        const data = await response.json()

        if (response.ok) {
          setProgressData(data)
          
          if (data.status === 'COMPLETED') {
            setIsPolling(false)
            onComplete()
          } else if (data.status === 'FAILED') {
            setIsPolling(false)
            onError('Search failed. Please try again.')
          }
        } else {
          throw new Error(data.error || 'Failed to check status')
        }
      } catch (error) {
        console.error('Error polling status:', error)
        setIsPolling(false)
        onError('Failed to check search status')
      }
    }

    // Poll immediately, then every 3 seconds
    pollStatus()
    const interval = setInterval(pollStatus, 3000)

    return () => clearInterval(interval)
  }, [searchId, isPolling, onComplete, onError])

  if (!progressData) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing search...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return 'text-green-600 bg-green-100'
      case 'FAILED': return 'text-red-600 bg-red-100'
      case 'RUNNING': return 'text-blue-600 bg-blue-100'
      case 'READY': return 'text-yellow-600 bg-yellow-100'
      case 'NOT_STARTED': return 'text-gray-500 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return '✓'
      case 'FAILED': return '✗'
      case 'RUNNING': return '⟳'
      case 'READY': return '⏳'
      case 'NOT_STARTED': return '⏸'
      default: return '?'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return '✓'
      case 'FAILED': return 'Failed'
      case 'RUNNING': return 'Running'
      case 'READY': return 'Ready'
      case 'NOT_STARTED': return 'Pending'
      default: return 'Unknown'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Search in Progress</h2>
        <p className="text-gray-600">Scraping social media platforms...</p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressData.progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressData.progress.percentage}%` }}
          ></div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {progressData.progress.completed} of {progressData.progress.total} platforms completed
        </div>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Twitter */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">Twitter</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progressData.platforms.twitter)}`}>
            <span className="mr-1">{getStatusIcon(progressData.platforms.twitter)}</span>
            {getStatusText(progressData.platforms.twitter)}
          </div>
        </div>

        {/* Reddit */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">Reddit</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progressData.platforms.reddit)}`}>
            <span className="mr-1">{getStatusIcon(progressData.platforms.reddit)}</span>
            {getStatusText(progressData.platforms.reddit)}
          </div>
        </div>

        {/* TikTok */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">TikTok</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progressData.platforms.tiktok)}`}>
            <span className="mr-1">{getStatusIcon(progressData.platforms.tiktok)}</span>
            {getStatusText(progressData.platforms.tiktok)}
          </div>
        </div>

        {/* Instagram */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">Instagram</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progressData.platforms.instagram)}`}>
            <span className="mr-1">{getStatusIcon(progressData.platforms.instagram)}</span>
            {getStatusText(progressData.platforms.instagram)}
          </div>
        </div>

        {/* YouTube */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">YouTube</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progressData.platforms.youtube)}`}>
            <span className="mr-1">{getStatusIcon(progressData.platforms.youtube)}</span>
            {getStatusText(progressData.platforms.youtube)}
          </div>
        </div>

        {/* Truth Social */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">Truth Social</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progressData.platforms.truthSocial)}`}>
            <span className="mr-1">{getStatusIcon(progressData.platforms.truthSocial)}</span>
            {getStatusText(progressData.platforms.truthSocial)}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          This may take 5-15 minutes depending on the search complexity
        </p>
      </div>
    </div>
  )
}

