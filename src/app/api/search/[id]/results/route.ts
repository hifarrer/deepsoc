import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: 'APIFY_API_TOKEN environment variable is required' },
        { status: 500 }
      )
    }

    const searchId = params.id

    // Get search record
    const search = await prisma.search.findUnique({
      where: { id: searchId },
      include: {
        twitterResults: true,
        redditResults: true,
        tikTokResults: true,
        facebookResults: true,
        instagramResults: true,
        youtubeResults: true,
        truthSocialResults: true
      }
    })

    if (!search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    // If results already exist, return them
    if (search.twitterResults.length > 0 || search.redditResults.length > 0 || search.tikTokResults.length > 0 || 
        search.facebookResults.length > 0 || search.instagramResults.length > 0 || search.youtubeResults.length > 0 ||
        search.truthSocialResults.length > 0) {
      return NextResponse.json({
        searchId,
        keyword: search.keyword,
        results: {
          twitter: search.twitterResults,
          reddit: search.redditResults,
          tiktok: search.tikTokResults,
          facebook: search.facebookResults,
          instagram: search.instagramResults,
          youtube: search.youtubeResults,
          truthSocial: search.truthSocialResults
        }
      })
    }

    const results: any = {
      twitter: [],
      reddit: [],
      tiktok: [],
      facebook: [],
      instagram: [],
      youtube: [],
      truthSocial: []
    }

    // Fetch Twitter results
    if (search.twitterRunId) {
      try {
        const twitterDatasetResponse = await axios.get(
          `https://api.apify.com/v2/actor-runs/${search.twitterRunId}/dataset/items`,
          {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }
        )
        
        const twitterData = twitterDatasetResponse.data || []
        console.log('Twitter API response:', twitterData.length, 'tweets')
        
        // Store Twitter results in database
        for (const tweet of twitterData.slice(0, 50)) { // Limit to 50 tweets
          // Skip tweets without required fields
          if (!tweet.id || !tweet.text) continue
          
          const mediaUrls = tweet.media?.map((m: any) => m.url).filter((url: any) => url != null) || []
          
          await prisma.twitterResult.create({
            data: {
              searchId,
              tweetId: tweet.id,
              url: tweet.url || '',
              text: tweet.text,
              fullText: tweet.fullText || tweet.text,
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
              authorUsername: tweet.author?.userName || 'unknown',
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
        }
        
        results.twitter = twitterData.slice(0, 50)
      } catch (error) {
        console.error('Error fetching Twitter results:', error)
      }
    }

    // Fetch Reddit results
    if (search.redditRunId) {
      try {
        const redditDatasetResponse = await axios.get(
          `https://api.apify.com/v2/actor-runs/${search.redditRunId}/dataset/items`,
          {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }
        )
        
        const redditData = redditDatasetResponse.data || []
        console.log('Reddit API response:', redditData.length, 'posts')
        
        // Store Reddit results in database
        for (const post of redditData.slice(0, 50)) { // Limit to 30 posts
          // Skip posts without required fields
          if (!post.id && !post.name) continue
          
          const mediaUrls = post.media?.map((m: any) => m.url).filter((url: any) => url != null) || []
          
          await prisma.redditResult.create({
            data: {
              searchId,
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
        }
        
        results.reddit = redditData.slice(0, 50)
      } catch (error) {
        console.error('Error fetching Reddit results:', error)
      }
    }

    // Fetch Social Media results (TikTok, Facebook, YouTube)
    if (search.tiktokRunId && !search.tiktokRunId.startsWith('sync-')) {
      // Only fetch from API if it's not a sync result
      try {
        const socialMediaDatasetResponse = await axios.get(
          `https://api.apify.com/v2/actor-runs/${search.tiktokRunId}/dataset/items`,
          {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }
        )
        
        const socialMediaData = socialMediaDatasetResponse.data || []
        
        // Separate results by fromSocial field (Instagram now comes from separate endpoint)
        const tiktokPosts = socialMediaData.filter((item: any) => item.fromSocial === 'tiktok')
        const facebookPosts = socialMediaData.filter((item: any) => item.fromSocial === 'facebook')
        const youtubePosts = socialMediaData.filter((item: any) => item.fromSocial === 'youtube')
        
        // Store TikTok results in database
        for (const video of tiktokPosts.slice(0, 50)) {
          if (!video.id) continue
          
          await prisma.tikTokResult.create({
            data: {
              searchId,
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
        }

        // Store Facebook results in database
        for (const post of facebookPosts.slice(0, 50)) {
          if (!post.id) continue
          
          await prisma.facebookResult.create({
            data: {
              searchId,
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
        }


        // Store YouTube results in database
        for (const video of youtubePosts.slice(0, 50)) {
          if (!video.id) continue
          
          await prisma.youTubeResult.create({
            data: {
              searchId,
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
        }
        
        results.tiktok = tiktokPosts
        results.facebook = facebookPosts
        results.youtube = youtubePosts
      } catch (error) {
        console.error('Error fetching social media results:', error)
      }
    } else if (search.tiktokRunId?.startsWith('sync-')) {
      // For sync results, return stored results from database
      results.tiktok = search.tikTokResults || []
      results.facebook = search.facebookResults || []
      results.youtube = search.youtubeResults || []
    }

    // Fetch Instagram results separately
    if (search.instagramRunId && !search.instagramRunId.startsWith('sync-')) {
      try {
        const instagramDatasetResponse = await axios.get(
          `https://api.apify.com/v2/actor-runs/${search.instagramRunId}/dataset/items`,
          {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }
        )
        
        const instagramData = instagramDatasetResponse.data || []
        console.log('Instagram API response:', instagramData.length, 'posts')
        
        // Store Instagram results in database
        for (const post of instagramData.slice(0, 50)) {
          if (!post.id) continue
          
          // Decode HTML entities in URLs to fix corrupted image URLs
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
              searchId,
              postId: post.id,
              text: post.caption || '',
              url: post.url || '',
              hashtags: post.caption ? post.caption.match(/#\w+/g) || [] : [],
              authorId: post.owner?.id || null,
              authorName: post.owner?.username || null,
              authorUrl: post.owner?.username ? `https://www.instagram.com/${post.owner.username}/` : null,
              authorAvatar: decodeHtmlEntities(post.owner?.profilePicUrl || ''),
              viewsCount: null, // Not available in this API
              likesCount: post.likeCount || null,
              commentsCount: post.commentCount || null,
              shareCount: null, // Not available in this API
              thumbnailUrl: decodeHtmlEntities(post.image?.url || '')
            }
          })
        }
        
        results.instagram = instagramData.slice(0, 50)
      } catch (error) {
        console.error('Error fetching Instagram results:', error)
      }
    } else if (search.instagramRunId?.startsWith('sync-')) {
      // For sync results, return stored results from database
      results.instagram = search.instagramResults || []
    }

    // Get the stored results from database
    const storedResults = await prisma.search.findUnique({
      where: { id: searchId },
      include: {
        twitterResults: true,
        redditResults: true,
        tikTokResults: true,
        facebookResults: true,
        instagramResults: true,
        youtubeResults: true,
        truthSocialResults: true
      }
    })

    console.log('Stored results from database:', {
      twitterCount: storedResults?.twitterResults?.length || 0,
      redditCount: storedResults?.redditResults?.length || 0,
      tiktokCount: storedResults?.tikTokResults?.length || 0,
      facebookCount: storedResults?.facebookResults?.length || 0,
      instagramCount: storedResults?.instagramResults?.length || 0,
      youtubeCount: storedResults?.youtubeResults?.length || 0
    })

    console.log('Results from API calls:', {
      twitterCount: results.twitter?.length || 0,
      redditCount: results.reddit?.length || 0,
      tiktokCount: results.tiktok?.length || 0,
      facebookCount: results.facebook?.length || 0,
      instagramCount: results.instagram?.length || 0,
      youtubeCount: results.youtube?.length || 0
    })

    return NextResponse.json({
      searchId,
      keyword: search.keyword,
      results: {
        twitter: storedResults?.twitterResults || results.twitter,
        reddit: storedResults?.redditResults || results.reddit,
        tiktok: results.tiktok || storedResults?.tikTokResults || [],
        facebook: results.facebook || storedResults?.facebookResults || [],
        instagram: results.instagram || storedResults?.instagramResults || [],
        youtube: results.youtube || storedResults?.youtubeResults || [],
        truthSocial: results.truthSocial || storedResults?.truthSocialResults || []
      }
    })

  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
