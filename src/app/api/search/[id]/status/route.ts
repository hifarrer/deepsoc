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
      where: { id: searchId }
    })

    if (!search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    // Check status of all runs
    const statusChecks = await Promise.allSettled([
      // Handle sync results for TikTok (social media hashtag research)
      search.tiktokRunId?.startsWith('sync-')
        ? Promise.resolve({ data: { data: { status: 'SUCCEEDED' } } })
        : axios.get(`https://api.apify.com/v2/actor-runs/${search.tiktokRunId}`, {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }).catch(() => ({ data: { data: { status: 'FAILED' } } })),
      
      // Handle sync results for Twitter
      search.twitterRunId?.startsWith('sync-')
        ? Promise.resolve({ data: { data: { status: 'SUCCEEDED' } } })
        : axios.get(`https://api.apify.com/v2/actor-runs/${search.twitterRunId}`, {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }).catch(() => ({ data: { data: { status: 'FAILED' } } })),
      
      // Handle sync results for Reddit
      search.redditRunId?.startsWith('sync-')
        ? Promise.resolve({ data: { data: { status: 'SUCCEEDED' } } })
        : axios.get(`https://api.apify.com/v2/actor-runs/${search.redditRunId}`, {
            headers: { 'Authorization': `Bearer ${APIFY_API_TOKEN}` }
          }).catch(() => ({ data: { data: { status: 'FAILED' } } }))
    ])

    const [tiktokStatus, twitterStatus, redditStatus] = statusChecks.map(
      (result) => result.status === 'fulfilled' ? result.value.data.data.status : 'FAILED'
    )

    // Determine overall status
    const allStatuses = [tiktokStatus, twitterStatus, redditStatus]
    const isComplete = allStatuses.every(status => status === 'SUCCEEDED')
    const hasFailed = allStatuses.some(status => status === 'FAILED')

    let overallStatus = 'RUNNING'
    if (isComplete) {
      overallStatus = 'COMPLETED'
    } else if (hasFailed) {
      overallStatus = 'FAILED'
    }

    // Update search status if completed
    if (overallStatus === 'COMPLETED' && search.status !== 'completed') {
      await prisma.search.update({
        where: { id: searchId },
        data: { status: 'completed' }
      })
    }

    return NextResponse.json({
      searchId,
      status: overallStatus,
      platforms: {
        tiktok: tiktokStatus,
        twitter: twitterStatus,
        reddit: redditStatus
      },
      progress: {
        completed: allStatuses.filter(status => status === 'SUCCEEDED').length,
        total: allStatuses.length,
        percentage: Math.round((allStatuses.filter(status => status === 'SUCCEEDED').length / allStatuses.length) * 100)
      }
    })

  } catch (error) {
    console.error('Error checking status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
