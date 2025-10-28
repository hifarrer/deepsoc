'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (keyword: string, maxItems: number) => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('')
  const [maxItems, setMaxItems] = useState(50)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim() && !isLoading) {
      onSearch(keyword.trim(), maxItems)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter search keyword (e.g., 'artificial intelligence', 'cryptocurrency')"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/90 backdrop-blur-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
          
          {/* Max Items Dropdown */}
          <div className="flex-shrink-0 relative">
            <select
              value={maxItems}
              onChange={(e) => setMaxItems(Number(e.target.value))}
              disabled={isLoading}
              className="px-4 py-4 pr-10 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/90 backdrop-blur-sm appearance-none cursor-pointer min-w-[120px]"
            >
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
              <option value={200}>200 items</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          Search across Twitter, Reddit, and TikTok • Results may take 5-15 minutes
        </p>
      </div>
    </div>
  )
}

