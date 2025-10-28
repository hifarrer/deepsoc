import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN

export async function POST(request: NextRequest) {
  try {
    if (!APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: 'APIFY_API_TOKEN environment variable is required' },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { keyword } = await request.json()

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    // Create search record
    const search = await prisma.search.create({
      data: {
        keyword,
        status: 'running',
        userId: session.user.id
      }
    })

    // Start Twitter scraper (sync)
    console.log('Starting Twitter scraper (sync)...')
    let twitterData = []
    let twitterRunId = null
    
    try {
      const twitterResponse = await axios.post(
        `https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          maxItems: 200,
          searchTerms: [`${keyword} min_replies: 10 lang:en -filter: links`],
          sort: "Latest",
          startUrls: [`https://twitter.com/search?q=${encodeURIComponent(keyword)}&src=typed_query&f=live`]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      twitterData = twitterResponse.data || []
      twitterRunId = 'sync-twitter-' + search.id
      console.log('Twitter sync completed, got', twitterData.length, 'tweets')
    } catch (error) {
      console.error('Twitter sync failed, falling back to async:', error.response?.data || error.message)
      // Fallback to async
      const twitterAsyncResponse = await axios.post(
        'https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs',
        {
          maxItems: 200,
          searchTerms: [`${keyword} min_replies: 10 lang:en -filter: links`],
          sort: "Latest",
          startUrls: [`https://twitter.com/search?q=${encodeURIComponent(keyword)}&src=typed_query&f=live`]
        },
        {
          headers: {
            'Authorization': `Bearer ${APIFY_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      )
      twitterRunId = twitterAsyncResponse.data.data.id
      console.log('Twitter async fallback started, run ID:', twitterRunId)
    }

    // Start Reddit scraper (sync)
    console.log('Starting Reddit scraper (sync)...')
    let redditData = []
    let redditRunId = null
    
    try {
      const redditResponse = await axios.post(
        `https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          debugMode: false,
          ignoreStartUrls: false,
          includeNSFW: false,
          maxComments: 1,
          maxCommunitiesCount: 2,
          maxItems: 20,
          maxPostCount: 50,
          maxUserCount: 2,
          proxy: {
            useApifyProxy: true,
            apifyProxyGroups: ["RESIDENTIAL"]
          },
          scrollTimeout: 40,
          searchComments: false,
          searchCommunities: false,
          searchPosts: true,
          searchUsers: false,
          skipComments: true,
          skipCommunity: false,
          skipUserPosts: false,
          sort: "new",
          startUrls: [{
            url: `https://www.reddit.com/search/?q=${encodeURIComponent(keyword)}&sort=new`,
            method: "GET"
          }],
          time: "week"
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      redditData = redditResponse.data || []
      redditRunId = 'sync-reddit-' + search.id
      console.log('Reddit sync completed, got', redditData.length, 'posts')
    } catch (error) {
      console.error('Reddit sync failed, falling back to async:', error.response?.data || error.message)
      // Fallback to async
      const redditAsyncResponse = await axios.post(
        'https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/runs',
        {
          debugMode: false,
          ignoreStartUrls: false,
          includeNSFW: false,
          maxComments: 1,
          maxCommunitiesCount: 2,
          maxItems: 20,
          maxPostCount: 50,
          maxUserCount: 2,
          proxy: {
            useApifyProxy: true,
            apifyProxyGroups: ["RESIDENTIAL"]
          },
          scrollTimeout: 40,
          searchComments: false,
          searchCommunities: false,
          searchPosts: true,
          searchUsers: false,
          skipComments: true,
          skipCommunity: false,
          skipUserPosts: false,
          sort: "new",
          startUrls: [{
            url: `https://www.reddit.com/search/?q=${encodeURIComponent(keyword)}&sort=new`,
            method: "GET"
          }],
          time: "week"
        },
        {
          headers: {
            'Authorization': `Bearer ${APIFY_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      )
      redditRunId = redditAsyncResponse.data.data.id
      console.log('Reddit async fallback started, run ID:', redditRunId)
    }

    // Start Social Media Hashtag Research scraper (TikTok, Facebook, Instagram, YouTube)
    // Use run-sync-get-dataset-items endpoint with token parameter
    let socialMediaResponse
    console.log('Starting social media hashtag research for keyword:', keyword)

    try {
      socialMediaResponse = await axios.post(
        `https://api.apify.com/v2/acts/apify~social-media-hashtag-research/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          hashtags: [keyword],
          socials: ["facebook", "instagram", "tiktok", "youtube"]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log('Sync API call successful, response type:', typeof socialMediaResponse.data)
    } catch (error) {
      console.error('Social Media API Error:', error.response?.data || error.message)
      console.log('Attempting fallback async API call...')
      
      try {
        socialMediaResponse = await axios.post(
          'https://api.apify.com/v2/acts/apify~social-media-hashtag-research/runs',
          {
            hashtags: [keyword],
            socials: ["facebook", "instagram", "tiktok", "youtube"]
          },
          {
            headers: {
              'Authorization': `Bearer ${APIFY_API_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log('Fallback API call successful, response type:', typeof socialMediaResponse.data)
      } catch (fallbackError: any) {
        console.error('Fallback Social Media API Error:', fallbackError.response?.data || fallbackError.message)
        throw fallbackError
      }
    }

    // Check if we got sync results or run ID
    let socialMediaRunId
    let socialMediaData = []
    
    console.log('Processing social media response...')
    console.log('Response data:', JSON.stringify(socialMediaResponse.data, null, 2))
    
    if (socialMediaResponse.data && Array.isArray(socialMediaResponse.data)) {
      // Sync response - data is directly in response
      socialMediaData = socialMediaResponse.data
      socialMediaRunId = 'sync-' + search.id
      console.log('Sync response detected, data length:', socialMediaData.length)
    } else if (socialMediaResponse.data?.data?.id) {
      // Async response - we got a run ID
      socialMediaRunId = socialMediaResponse.data.data.id
      console.log('Async response detected, run ID:', socialMediaRunId)
    } else {
      console.error('Unexpected response format:', socialMediaResponse.data)
      throw new Error('Unexpected response format from social media API')
    }

    // Separate results by fromSocial field
    const tiktokPosts = socialMediaData.filter((item: any) => item.fromSocial === 'tiktok')
    const facebookPosts = socialMediaData.filter((item: any) => item.fromSocial === 'facebook')
    const instagramPosts = socialMediaData.filter((item: any) => item.fromSocial === 'instagram')
    const youtubePosts = socialMediaData.filter((item: any) => item.fromSocial === 'youtube')
    
    console.log('Separated results:')
    console.log('- TikTok posts:', tiktokPosts.length)
    console.log('- Facebook posts:', facebookPosts.length)
    console.log('- Instagram posts:', instagramPosts.length)
    console.log('- YouTube posts:', youtubePosts.length)

    // Store TikTok results in database if we have sync data
    for (const video of tiktokPosts.slice(0, 30)) {
      try {
        if (!video.id) continue
        
        await prisma.tikTokResult.create({
          data: {
            searchId: search.id,
            videoId: video.id,
            text: video.text || '',
            textLanguage: video.textLanguage || null,
            url: video.postUrl || '',
            authorId: video.authorMeta?.id || '',
            authorName: video.authorMeta?.name || 'Unknown',
            authorNickname: video.authorMeta?.nickName || null,
            authorVerified: video.authorMeta?.verified || false,
            authorAvatar: video.authorMeta?.avatar || null,
            authorFollowers: video.authorMeta?.followers || null,
            authorFollowing: video.authorMeta?.following || null,
            authorFans: video.authorMeta?.fans || null,
            authorHeart: video.authorMeta?.heart || null,
            playCount: video.viewsCount || null,
            diggCount: video.likesCount || null,
            shareCount: video.shareCount || null,
            commentCount: video.commentsCount || null,
            coverUrl: video.thumbnailUrl || null,
            videoUrl: video.postUrl || null,
            createTime: null,
            createTimeISO: video.creationDate || null,
            isAd: video.isSponsored || false
          }
        })
      } catch (error) {
        console.error('Error storing TikTok result:', error)
      }
    }

    // Store Facebook results in database if we have sync data
    for (const post of facebookPosts.slice(0, 30)) {
      try {
        if (!post.id) continue
        
        await prisma.facebookResult.create({
          data: {
            searchId: search.id,
            postId: post.id,
            text: post.text || '',
            url: post.postUrl || '',
            hashtags: post.hashtags || [],
            authorId: post.authorMeta?.id || null,
            authorName: post.authorMeta?.name || null,
            authorUrl: post.authorMeta?.url || null,
            viewsCount: post.viewsCount || null,
            likesCount: post.likesCount || null,
            commentsCount: post.commentsCount || null,
            shareCount: post.shareCount || null,
            thumbnailUrl: post.thumbnailUrl || null
          }
        })
      } catch (error) {
        console.error('Error storing Facebook result:', error)
      }
    }

    // Store Instagram results in database if we have sync data
    for (const post of instagramPosts.slice(0, 30)) {
      try {
        if (!post.id) continue
        
        await prisma.instagramResult.create({
          data: {
            searchId: search.id,
            postId: post.id,
            text: post.text || '',
            url: post.postUrl || '',
            hashtags: post.hashtags || [],
            authorId: post.authorMeta?.id || null,
            authorName: post.authorMeta?.name || null,
            authorUrl: post.authorMeta?.url || null,
            viewsCount: post.viewsCount || null,
            likesCount: post.likesCount || null,
            commentsCount: post.commentsCount || null,
            shareCount: post.shareCount || null,
            thumbnailUrl: post.thumbnailUrl || null
          }
        })
      } catch (error) {
        console.error('Error storing Instagram result:', error)
      }
    }

    // Store YouTube results in database if we have sync data
    for (const video of youtubePosts.slice(0, 30)) {
      try {
        if (!video.id) continue
        
        await prisma.youtubeResult.create({
          data: {
            searchId: search.id,
            videoId: video.id,
            title: video.text || '',
            text: video.text || '',
            url: video.postUrl || '',
            hashtags: video.hashtags || [],
            authorId: video.authorMeta?.id || null,
            authorName: video.authorMeta?.name || null,
            authorUrl: video.authorMeta?.url || null,
            viewsCount: video.viewsCount || null,
            likesCount: video.likesCount || null,
            commentsCount: video.commentsCount || null,
            thumbnailUrl: video.thumbnailUrl || null
          }
        })
      } catch (error) {
        console.error('Error storing YouTube result:', error)
      }
    }

    // Update search with run IDs
    await prisma.search.update({
      where: { id: search.id },
      data: {
        twitterRunId: twitterRunId,
        redditRunId: redditRunId,
        tiktokRunId: socialMediaRunId,
        status: socialMediaData.length > 0 ? 'completed' : 'running'
      }
    })

    return NextResponse.json({
      searchId: search.id,
      twitterRunId: twitterRunId,
      redditRunId: redditRunId,
      socialMediaRunId: socialMediaRunId,
      socialMediaData: socialMediaData.length > 0 ? {
        tiktok: tiktokPosts,
        facebook: facebookPosts,
        instagram: instagramPosts,
        youtube: youtubePosts
      } : undefined,
      // Include sync data in response for immediate display
      syncResults: socialMediaData.length > 0 ? {
        tiktok: tiktokPosts,
        facebook: facebookPosts,
        instagram: instagramPosts,
        youtube: youtubePosts
      } : undefined,
      // Include Reddit and Twitter sync data
      redditData: redditData.length > 0 ? redditData : undefined,
      twitterData: twitterData.length > 0 ? twitterData : undefined
    })

  } catch (error) {
    console.error('Error starting search:', error)
    return NextResponse.json(
      { error: 'Failed to start search' },
      { status: 500 }
    )
  }
}
