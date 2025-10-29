'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/SearchBar'
import ProgressTracker from '@/components/ProgressTracker'
import ResultsTabs from '@/components/ResultsTabs'
import HistoryPanel from '@/components/HistoryPanel'

interface SearchState {
  status: 'idle' | 'searching' | 'progress' | 'results' | 'error'
  searchId?: string
  keyword?: string
  results?: {
    reddit?: any[]
    twitter?: any[]
    tiktok?: any[]
    instagram?: any[]
    youtube?: any[]
  }
  error?: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchState, setSearchState] = useState<SearchState>({ status: 'idle' })
  const [showHistory, setShowHistory] = useState(false)

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DeepSocial</h1>
          <p className="text-xl text-gray-600 mb-8">Search across social media platforms with advanced scraping</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/register')}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSearch = async (keyword: string, maxItems: number) => {
    setSearchState({ status: 'searching' })

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, maxItems }),
      })

      const data = await response.json()
      console.log('Search response data:', data)

      if (response.ok) {
        // Check if we have sync results (immediate data)
        if (data.syncResults || data.redditData || data.twitterData) {
          console.log('Sync results found:', data.syncResults)
          console.log('Reddit data found:', data.redditData?.length || 0, 'posts')
          console.log('Twitter data found:', data.twitterData?.length || 0, 'tweets')
          setSearchState({
            status: 'results', // Show results immediately with sync data
            searchId: data.searchId,
            keyword,
            results: {
              reddit: data.redditData || [], // Use sync Reddit data if available
              twitter: data.twitterData || [], // Use sync Twitter data if available
              tiktok: data.syncResults?.tiktok || [],
              instagram: data.syncResults?.instagram || [],
              youtube: data.syncResults?.youtube || []
            }
          })
        } else {
          console.log('No sync results, showing progress')
          setSearchState({
            status: 'progress',
            searchId: data.searchId,
            keyword,
          })
        }
      } else {
        throw new Error(data.error || 'Failed to start search')
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }

  const handleProgressComplete = async () => {
    if (!searchState.searchId) return

    try {
      const response = await fetch(`/api/search/${searchState.searchId}/results`)
      const data = await response.json()
      console.log('Progress complete - API results:', data)
      console.log('Previous state results:', searchState.results)

      if (response.ok) {
        setSearchState(prev => ({
          ...prev,
          status: 'results',
          results: {
            // Keep existing sync results (TikTok, Instagram, YouTube) - prioritize existing data
            tiktok: (prev.results?.tiktok?.length || 0) > 0 ? prev.results?.tiktok : (data.results.tiktok || []),
            instagram: (prev.results?.instagram?.length || 0) > 0 ? prev.results?.instagram : (data.results.instagram || []),
            youtube: (prev.results?.youtube?.length || 0) > 0 ? prev.results?.youtube : (data.results.youtube || []),
            // Add async results (Reddit, Twitter)
            reddit: data.results.reddit || [],
            twitter: data.results.twitter || []
          }
        }))
      } else {
        throw new Error(data.error || 'Failed to fetch results')
      }
    } catch (error) {
      console.error('Results error:', error)
      setSearchState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch results',
      }))
    }
  }

  const handleProgressError = (error: string) => {
    setSearchState(prev => ({
      ...prev,
      status: 'error',
      error,
    }))
  }

  const handleNewSearch = () => {
    setSearchState({ status: 'idle' })
  }

  const handleSelectHistorySearch = async (searchId: string, keyword: string) => {
    setSearchState({ status: 'searching' })
    
    try {
      const response = await fetch(`/api/search/${searchId}/results`)
      const data = await response.json()

      if (response.ok) {
        setSearchState({
          status: 'results',
          searchId,
          keyword,
          results: data.results,
        })
      } else {
        throw new Error(data.error || 'Failed to fetch results')
      }
    } catch (error) {
      console.error('History search error:', error)
      setSearchState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to load search results',
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeepSocial
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 text-sm hidden sm:block">
                Social Media Intelligence Platform
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowHistory(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  History
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {session?.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {searchState.status === 'idle' && (
          <div className="text-center py-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Search Across
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Social Media
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Discover trending content, analyze conversations, and track mentions across Reddit, Twitter, TikTok, Facebook, Instagram, and YouTube with our advanced scraping technology.
            </p>
            <SearchBar onSearch={handleSearch} isLoading={false} />
          </div>
        )}

        {/* Searching State */}
        {searchState.status === 'searching' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Starting Search...</h2>
            <p className="text-gray-600">Initializing scraping across all platforms</p>
          </div>
        )}

        {/* Progress State */}
        {searchState.status === 'progress' && searchState.searchId && (
          <div className="py-8">
            <ProgressTracker
              searchId={searchState.searchId}
              onComplete={handleProgressComplete}
              onError={handleProgressError}
            />
          </div>
        )}

        {/* Results State */}
        {searchState.status === 'results' && searchState.results && searchState.keyword && (
          <div className="py-8">
            <div className="mb-6 text-center">
              <button
                onClick={handleNewSearch}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Search
              </button>
            </div>
            <ResultsTabs results={searchState.results} keyword={searchState.keyword} />
          </div>
        )}

        {/* Error State */}
        {searchState.status === 'error' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Failed</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{searchState.error}</p>
            <button
              onClick={handleNewSearch}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Features Section - Only show when idle */}
        {searchState.status === 'idle' && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reddit Insights</h3>
              <p className="text-gray-600">Explore discussions, communities, and trending posts with upvote ratios and comment counts.</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Twitter Analysis</h3>
              <p className="text-gray-600">Track tweets, mentions, and trending topics with engagement metrics and media content.</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">TikTok Trends</h3>
              <p className="text-gray-600">Discover viral videos, trending hashtags, and creator content with engagement analytics.</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Facebook Posts</h3>
              <p className="text-gray-600">Track posts, shares, and engagement across Facebook with comprehensive analytics.</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Instagram Content</h3>
              <p className="text-gray-600">Explore photos, stories, and reels with detailed engagement metrics and hashtag analysis.</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">YouTube Videos</h3>
              <p className="text-gray-600">Discover trending videos, analyze engagement metrics, and track channel performance across YouTube.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 DeepSocial. Powered by Apify scraping technology.</p>
          </div>
        </div>
      </footer>

      {/* History Panel */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectSearch={handleSelectHistorySearch}
      />
    </main>
  )
}
