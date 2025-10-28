'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchHistory {
  id: string
  keyword: string
  status: string
  createdAt: string
  _count: {
    twitterResults: number
    redditResults: number
    tiktokResults: number
  }
}

interface HistoryPanelProps {
  onSelectSearch: (searchId: string, keyword: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function HistoryPanel({ onSelectSearch, isOpen, onClose }: HistoryPanelProps) {
  const router = useRouter()
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      
      if (response.ok) {
        setHistory(data.searches)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'running': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search History</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No search history</h3>
              <p className="text-gray-500">Your previous searches will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((search) => (
                <div
                  key={search.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      "{search.keyword}"
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(search.status)}`}>
                      {search.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <span>🐦</span>
                        <span>{search._count.twitterResults}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>🔴</span>
                        <span>{search._count.redditResults}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>🎵</span>
                        <span>{search._count.tiktokResults}</span>
                      </span>
                    </div>
                    <span>{formatDate(search.createdAt)}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        router.push(`/search/${search.id}`)
                        onClose()
                      }}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-colors"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => {
                        onSelectSearch(search.id, search.keyword)
                        onClose()
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                    >
                      Re-run Search
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
