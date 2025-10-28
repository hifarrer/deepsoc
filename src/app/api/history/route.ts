import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const searches = await prisma.search.findMany({
      where: {
        userId: userId
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to last 20 searches
      include: {
        _count: {
          select: {
            twitterResults: true,
            redditResults: true,
            tikTokResults: true,
            facebookResults: true,
            instagramResults: true,
            youtubeResults: true
          }
        }
      }
    })

    return NextResponse.json({ searches })

  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
