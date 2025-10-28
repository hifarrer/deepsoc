'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ResultsTabs from '@/components/ResultsTabs'

interface SearchData {
  id: string
  keyword: string
  status: string
  createdAt: string
  results: {
    twitter: any[]
    reddit: any[]
    tiktok: any[]
  }
}

interface SearchPageProps {
  params: {
    id: string
  }
}

export default function SearchPage({ params }: SearchPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchData, setSearchData] = useState<SearchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchSearchData()
    }
  }, [status, params.id])

  const fetchSearchData = async () => {
    try {
      const response = await fetch(`/api/search/${params.id}/results`)
      const data = await response.json()

      if (response.ok) {
        setSearchData(data)
      } else {
        setError(data.error || 'Failed to load search results')
      }
    } catch (error) {
      setError('An error occurred while loading results')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Error Loading Results</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!searchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Not Found</h2>
          <p className="text-gray-600 mb-8">The search you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeepSocial
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome, {session?.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Search Results for "{searchData.keyword}"
              </h2>
              <p className="text-gray-600">
                Searched on {new Date(searchData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Total Results</div>
              <div className="text-2xl font-bold text-blue-600">
                {searchData.results.twitter.length + searchData.results.reddit.length + searchData.results.tiktok.length}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <ResultsTabs results={searchData.results} keyword={searchData.keyword} />
      </div>
    </div>
  )
}


