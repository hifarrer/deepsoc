'use client'

import { useState } from 'react'
import TwitterCard from '@/components/cards/TwitterCard'
import RedditCard from '@/components/cards/RedditCard'
import TikTokCard from '@/components/cards/TikTokCard'
import FacebookCard from '@/components/cards/FacebookCard'
import InstagramCard from '@/components/cards/InstagramCard'
import YouTubeCard from '@/components/cards/YouTubeCard'

interface ResultsTabsProps {
  results: {
    tiktok?: any[]
    facebook?: any[]
    instagram?: any[]
    twitter?: any[]
    reddit?: any[]
    youtube?: any[]
  }
  keyword: string
}

export default function ResultsTabs({ results, keyword }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<'reddit' | 'twitter' | 'tiktok' | 'facebook' | 'instagram' | 'youtube'>('reddit')

  // Helper function to safely get array length
  const getArrayLength = (arr: any[] | undefined) => arr?.length || 0

  const tabs = [
    {
      id: 'reddit' as const,
      name: 'Reddit',
      count: getArrayLength(results.reddit),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      color: 'orange'
    },
    {
      id: 'twitter' as const,
      name: 'Twitter',
      count: getArrayLength(results.twitter),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'tiktok' as const,
      name: 'TikTok',
      count: getArrayLength(results.tiktok),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: 'pink'
    },
    {
      id: 'facebook' as const,
      name: 'Facebook',
      count: getArrayLength(results.facebook),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'instagram' as const,
      name: 'Instagram',
      count: getArrayLength(results.instagram),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 'youtube' as const,
      name: 'YouTube',
      count: getArrayLength(results.youtube),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: 'red'
    }
  ]

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      orange: isActive 
        ? 'bg-orange-500 text-white' 
        : 'text-orange-600 hover:bg-orange-50',
      blue: isActive 
        ? 'bg-blue-500 text-white' 
        : 'text-blue-600 hover:bg-blue-50',
      pink: isActive 
        ? 'bg-pink-500 text-white' 
        : 'text-pink-600 hover:bg-pink-50',
      purple: isActive 
        ? 'bg-purple-500 text-white' 
        : 'text-purple-600 hover:bg-purple-50',
      red: isActive 
        ? 'bg-red-500 text-white' 
        : 'text-red-600 hover:bg-red-50'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.orange
  }

  const renderResults = () => {
    const currentResults = results[activeTab] || []
    
    if (!currentResults || currentResults.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600">No {activeTab} results found for &quot;{keyword}&quot;</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResults.map((item, index) => {
          switch (activeTab) {
            case 'reddit':
              return <RedditCard key={item.id || index} post={item} />
            case 'twitter':
              return <TwitterCard key={item.id || index} tweet={item} />
            case 'tiktok':
              return <TikTokCard key={item.id || index} video={item} />
            case 'facebook':
              return <FacebookCard key={item.id || index} post={item} />
            case 'instagram':
              return <InstagramCard key={item.id || index} post={item} />
            case 'youtube':
              return <YouTubeCard key={item.id || index} video={item} />
            default:
              return null
          }
        })}
      </div>
    )
  }

  const totalResults = getArrayLength(results.reddit) + getArrayLength(results.twitter) + getArrayLength(results.tiktok) + getArrayLength(results.facebook) + getArrayLength(results.instagram) + getArrayLength(results.youtube)

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Search Results for &quot;{keyword}&quot;
            </h2>
            <p className="text-gray-600">
              Found {totalResults} results across all platforms
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Results</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {totalResults}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? `border-${tab.color}-500 ${getTabColorClasses(tab.color, true)}`
                  : `border-transparent ${getTabColorClasses(tab.color, false)}`
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-white bg-opacity-20'
                  : `bg-${tab.color}-100 text-${tab.color}-600`
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Results Content */}
      <div className="p-6">
        {renderResults()}
      </div>
    </div>
  )
}
