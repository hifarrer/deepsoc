import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searches = await prisma.search.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to last 20 searches
      include: {
        _count: {
          select: {
            twitterResults: true,
            redditResults: true,
            tikTokResults: true
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
