'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (keyword: string) => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim() && !isLoading) {
      onSearch(keyword.trim())
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
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
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          Search across Twitter, Reddit, and TikTok • Results may take 5-15 minutes
        </p>
      </div>
    </div>
  )
}

