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
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const { keyword, maxItems = 50 } = await request.json()

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    // Validate maxItems parameter
    const validMaxItems = [50, 100, 200].includes(maxItems) ? maxItems : 50

    // Create search record
    const search = await prisma.search.create({
      data: {
        keyword,
        status: 'running',
        userId: userId
      }
    })

    // Start all scrapers asynchronously
    const startScraping = async () => {
      const platformPromises = []
      
      // Twitter scraper
      platformPromises.push(
        (async () => {
          try {
            console.log('Starting Twitter scraper (sync)...')
            const twitterResponse = await axios.post(
              `https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
              {
                maxItems: validMaxItems,
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
            const twitterData = twitterResponse.data || []
            const twitterRunId = 'sync-twitter-' + search.id
            
            // Process Twitter data
            const processedTwitterData = twitterData.map((tweet: any) => ({
              ...tweet,
              authorAvatar: tweet.author?.profilePicture || tweet.authorAvatar,
              authorName: tweet.author?.name || tweet.author?.userName || 'Unknown User',
              authorUsername: tweet.author?.userName || tweet.author?.name || 'unknown',
              author: tweet.author ? {
                ...tweet.author,
                authorAvatar: tweet.author.profilePicture || tweet.author.authorAvatar,
                name: tweet.author.name || tweet.author.userName || 'Unknown User',
                userName: tweet.author.userName || tweet.author.name || 'unknown'
              } : tweet.author
            }))
            
            // Store Twitter results
            for (const tweet of processedTwitterData.slice(0, validMaxItems)) {
              try {
                if (!tweet.id) continue
                
                const mediaUrls = tweet.media?.map((m: any) => m.url).filter((url: any) => url != null) || []
                
                await prisma.twitterResult.create({
                  data: {
                    searchId: search.id,
                    tweetId: tweet.id,
                    url: tweet.url || '',
                    text: tweet.text || '',
                    fullText: tweet.fullText || tweet.text || '',
                    tweetCreatedAt: tweet.createdAt || new Date().toISOString(),
                    lang: tweet.lang || 'en',
                    retweetCount: tweet.retweetCount || 0,
                    replyCount: tweet.replyCount || 0,
                    likeCount: tweet.likeCount || 0,
                    quoteCount: tweet.quoteCount || 0,
                    viewCount: tweet.viewCount || null,
                    bookmarkCount: tweet.bookmarkCount || 0,
                    authorId: tweet.author?.id || '',
                    authorName: tweet.author?.name || tweet.author?.userName || 'Unknown User',
                    authorUsername: tweet.author?.userName || tweet.author?.name || 'unknown',
                    authorVerified: tweet.author?.isVerified || false,
                    authorAvatar: tweet.author?.profilePicture || null,
                    authorFollowers: tweet.author?.followers || null,
                    authorFollowing: tweet.author?.following || null,
                    mediaUrls,
                    isReply: tweet.isReply || false,
                    isRetweet: tweet.isRetweet || false,
                    isQuote: tweet.isQuote || false
                  }
                })
              } catch (error) {
                console.error('Error storing Twitter result:', error)
              }
            }
            
            // Update search with Twitter run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { twitterRunId: twitterRunId }
            })
            
            console.log('Twitter sync completed, got', processedTwitterData.length, 'tweets')
            return { platform: 'twitter', data: processedTwitterData, runId: twitterRunId }
          } catch (error: any) {
            console.error('Twitter sync failed, falling back to async:', error.response?.data || error.message)
            // Fallback to async
            const twitterAsyncResponse = await axios.post(
              'https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs',
              {
                maxItems: validMaxItems,
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
            const twitterRunId = twitterAsyncResponse.data.data.id
            
            // Update search with Twitter run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { twitterRunId: twitterRunId }
            })
            
            console.log('Twitter async fallback started, run ID:', twitterRunId)
            return { platform: 'twitter', data: [], runId: twitterRunId }
          }
        })()
      )
      
      // Reddit scraper
      platformPromises.push(
        (async () => {
          try {
            console.log('Starting Reddit scraper (sync)...')
            const redditResponse = await axios.post(
              `https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
              {
                debugMode: false,
                ignoreStartUrls: false,
                includeNSFW: false,
                maxComments: 1,
                maxCommunitiesCount: 2,
                maxItems: Math.min(validMaxItems, 20),
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
            const redditData = redditResponse.data || []
            const redditRunId = 'sync-reddit-' + search.id
            
            // Store Reddit results
            for (const post of redditData.slice(0, validMaxItems)) {
              try {
                if (!post.id && !post.name) continue
                
                const mediaUrls = post.media?.map((m: any) => m.url).filter((url: any) => url != null) || []
                
                await prisma.redditResult.create({
                  data: {
                    searchId: search.id,
                    redditId: post.id || post.name || '',
                    dataType: post.dataType || 'post',
                    title: post.title,
                    text: post.text || post.description,
                    url: post.url || '',
                    subreddit: post.subreddit || post.displayName,
                    authorId: post.author?.id || null,
                    authorName: post.username || post.author?.name || null,
                    authorAvatar: post.author?.avatar || null,
                    score: post.score || null,
                    upvoteRatio: post.upvoteRatio || null,
                    numComments: post.numComments || null,
                    mediaUrls,
                    createdAt: post.createdAt || post.created_utc
                  }
                })
              } catch (error) {
                console.error('Error storing Reddit result:', error)
              }
            }
            
            // Update search with Reddit run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { redditRunId: redditRunId }
            })
            
            console.log('Reddit sync completed, got', redditData.length, 'posts')
            return { platform: 'reddit', data: redditData, runId: redditRunId }
          } catch (error: any) {
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
                maxItems: Math.min(validMaxItems, 20),
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
            const redditRunId = redditAsyncResponse.data.data.id
            
            // Update search with Reddit run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { redditRunId: redditRunId }
            })
            
            console.log('Reddit async fallback started, run ID:', redditRunId)
            return { platform: 'reddit', data: [], runId: redditRunId }
          }
        })()
      )
      
      // Instagram scraper
      platformPromises.push(
        (async () => {
          try {
            console.log('Starting Instagram scraper (sync)...')
            const instagramResponse = await axios.post(
              `https://api.apify.com/v2/acts/apidojo~instagram-hashtag-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
              {
                customMapFunction: "(object) => { return {...object} }",
                getPosts: true,
                getReels: true,
                keyword: keyword,
                maxItems: validMaxItems
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            const instagramData = instagramResponse.data || []
            const instagramRunId = 'sync-instagram-' + search.id
            
            // Store Instagram results
            for (const post of instagramData.slice(0, validMaxItems)) {
              try {
                if (!post.id) continue
                
                // Decode HTML entities in URLs
                const decodeHtmlEntities = (url: string) => {
                  if (!url) return url
                  return url
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#x27;/g, "'")
                    .replace(/&#x2F;/g, '/')
                }

                await prisma.instagramResult.create({
                  data: {
                    searchId: search.id,
                    postId: post.id,
                    text: post.caption || '',
                    url: post.url || '',
                    hashtags: post.caption ? post.caption.match(/#\w+/g) || [] : [],
                    authorId: post.owner?.id || null,
                    authorName: post.owner?.username || null,
                    authorUrl: post.owner?.username ? `https://www.instagram.com/${post.owner.username}/` : null,
                    authorAvatar: decodeHtmlEntities(post.owner?.profilePicUrl || ''),
                    viewsCount: null,
                    likesCount: post.likeCount || null,
                    commentsCount: post.commentCount || null,
                    shareCount: null,
                    thumbnailUrl: decodeHtmlEntities(post.image?.url || '')
                  }
                })
              } catch (error) {
                console.error('Error storing Instagram result:', error)
              }
            }
            
            // Update search with Instagram run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { instagramRunId: instagramRunId }
            })
            
            console.log('Instagram sync completed, got', instagramData.length, 'posts')
            return { platform: 'instagram', data: instagramData, runId: instagramRunId }
          } catch (error: any) {
            console.error('Instagram sync failed, falling back to async:', error.response?.data || error.message)
            // Fallback to async
            const instagramAsyncResponse = await axios.post(
              'https://api.apify.com/v2/acts/apidojo~instagram-hashtag-scraper/runs',
              {
                customMapFunction: "(object) => { return {...object} }",
                getPosts: true,
                getReels: true,
                keyword: keyword,
                maxItems: validMaxItems
              },
              {
                headers: {
                  'Authorization': `Bearer ${APIFY_API_TOKEN}`,
                  'Content-Type': 'application/json'
                }
              }
            )
            const instagramRunId = instagramAsyncResponse.data.data.id
            
            // Update search with Instagram run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { instagramRunId: instagramRunId }
            })
            
            console.log('Instagram async fallback started, run ID:', instagramRunId)
            return { platform: 'instagram', data: [], runId: instagramRunId }
          }
        })()
      )
      
      // Social Media Hashtag Research scraper (TikTok, YouTube)
      platformPromises.push(
        (async () => {
          try {
            console.log('Starting social media hashtag research for keyword:', keyword)
            const socialMediaResponse = await axios.post(
              `https://api.apify.com/v2/acts/apify~social-media-hashtag-research/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
              {
                hashtags: [keyword],
                socials: ["tiktok", "youtube"]
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            
            const socialMediaData = socialMediaResponse.data || []
            const socialMediaRunId = 'sync-' + search.id
            
            // Separate results by fromSocial field
            const tiktokPosts = socialMediaData.filter((item: any) => item.fromSocial === 'tiktok')
            const youtubePosts = socialMediaData.filter((item: any) => item.fromSocial === 'youtube')
            
            // Store TikTok results
            for (const video of tiktokPosts.slice(0, validMaxItems)) {
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
            
            // Store YouTube results
            for (const video of youtubePosts.slice(0, validMaxItems)) {
              try {
                if (!video.id) continue
                
                await (prisma as any).youtubeResult.create({
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
            
            // Update search with social media run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { tiktokRunId: socialMediaRunId }
            })
            
            console.log('Social media sync completed:')
            console.log('- TikTok posts:', tiktokPosts.length)
            console.log('- YouTube posts:', youtubePosts.length)
            
            return { 
              platform: 'socialMedia', 
              data: { tiktok: tiktokPosts, youtube: youtubePosts }, 
              runId: socialMediaRunId 
            }
          } catch (error: any) {
            console.error('Social Media API Error:', error.response?.data || error.message)
            console.log('Attempting fallback async API call...')
            
            try {
              const socialMediaResponse = await axios.post(
                'https://api.apify.com/v2/acts/apify~social-media-hashtag-research/runs',
                {
                  hashtags: [keyword],
                  socials: ["tiktok", "youtube"]
                },
                {
                  headers: {
                    'Authorization': `Bearer ${APIFY_API_TOKEN}`,
                    'Content-Type': 'application/json'
                  }
                }
              )
              const socialMediaRunId = socialMediaResponse.data.data.id
              
              // Update search with social media run ID
              await prisma.search.update({
                where: { id: search.id },
                data: { tiktokRunId: socialMediaRunId }
              })
              
              console.log('Social media async fallback started, run ID:', socialMediaRunId)
              return { platform: 'socialMedia', data: { tiktok: [], youtube: [] }, runId: socialMediaRunId }
            } catch (fallbackError: any) {
              console.error('Fallback Social Media API Error:', fallbackError.response?.data || fallbackError.message)
              return { platform: 'socialMedia', data: { tiktok: [], youtube: [] }, runId: null }
            }
          }
        })()
      )
      
      // Truth Social scraper
      platformPromises.push(
        (async () => {
          try {
            console.log('Starting Truth Social hashtag research for keyword:', keyword)
            const truthSocialResponse = await axios.post(
              `https://api.apify.com/v2/acts/muhammetakkurtt~truthsocial-hashtag-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
              {
                cleanContent: true,
                hashtag: keyword,
                maxPosts: validMaxItems
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            
            const truthSocialData = truthSocialResponse.data || []
            const truthSocialRunId = 'sync-truthsocial-' + search.id
            
            // Store Truth Social results
            for (const post of truthSocialData.slice(0, validMaxItems)) {
              try {
                if (!post.id) continue
                
                await prisma.truthSocialResult.create({
                  data: {
                    searchId: search.id,
                    postId: post.id,
                    content: post.content || '',
                    url: post.url || '',
                    uri: post.uri || null,
                    language: post.language || null,
                    visibility: post.visibility || null,
                    authorId: null,
                    authorName: null,
                    authorUsername: null,
                    authorAvatar: null,
                    repliesCount: post.replies_count || 0,
                    reblogsCount: post.reblogs_count || 0,
                    favouritesCount: post.favourites_count || 0,
                    cardTitle: post.card?.title || null,
                    cardDescription: post.card?.description || null,
                    cardImage: post.card?.image || null,
                    cardUrl: post.card?.url || null,
                    cardType: post.card?.type || null,
                    createdAt: post.created_at || null,
                    editedAt: post.edited_at || null
                  }
                })
              } catch (error) {
                console.error('Error storing Truth Social result:', error)
              }
            }
            
            // Update search with Truth Social run ID
            await prisma.search.update({
              where: { id: search.id },
              data: { truthSocialRunId: truthSocialRunId }
            })
            
            console.log('Truth Social sync completed, got', truthSocialData.length, 'posts')
            return { platform: 'truthSocial', data: truthSocialData, runId: truthSocialRunId }
          } catch (error: any) {
            console.error('Truth Social API Error:', error.response?.data || error.message)
            return { platform: 'truthSocial', data: [], runId: null }
          }
        })()
      )
      
      // Wait for all platforms to complete
      const results = await Promise.allSettled(platformPromises)
      
      // Process results
      const platformResults = {
        twitter: { data: [], runId: null },
        reddit: { data: [], runId: null },
        instagram: { data: [], runId: null },
        tiktok: { data: [], runId: null },
        youtube: { data: [], runId: null },
        truthSocial: { data: [], runId: null }
      }
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { platform, data, runId } = result.value
          if (platform === 'socialMedia') {
            platformResults.tiktok = { data: data.tiktok, runId: runId }
            platformResults.youtube = { data: data.youtube, runId: runId }
          } else {
            platformResults[platform as keyof typeof platformResults] = { data, runId }
          }
        }
      })
      
      // Update search status to completed
      await prisma.search.update({
        where: { id: search.id },
        data: { status: 'completed' }
      })
      
      return platformResults
    }
    
    // Start scraping in background
    startScraping().catch(console.error)

    return NextResponse.json({
      searchId: search.id,
      status: 'running'
    })

  } catch (error) {
    console.error('Error starting search:', error)
    return NextResponse.json(
      { error: 'Failed to start search' },
      { status: 500 }
    )
  }
}
