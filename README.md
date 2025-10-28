# DeepSocial - Social Media Scraper

A modern web application that searches across Twitter, Reddit, and TikTok using Apify scraping services. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Multi-Platform Search**: Search across Twitter, Reddit, and TikTok simultaneously
- **Real-time Progress Tracking**: Live progress updates with platform-specific status indicators
- **Modern UI**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **Rich Media Display**: Shows images, avatars, and media content from all platforms
- **Search History**: View and revisit previous searches
- **Database Storage**: Persistent storage of search results in PostgreSQL

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **External APIs**: Apify scraping services

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Apify account with API token

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/deepsocial"
APIFY_API_TOKEN="your_apify_api_token_here"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Search**: Enter a keyword in the search bar to start scraping across all platforms
2. **Progress**: Monitor real-time progress with platform-specific status indicators
3. **Results**: View results in organized tabs for each platform
4. **History**: Access previous searches through the History button

## API Endpoints

- `POST /api/search` - Initiate new search across all platforms
- `GET /api/search/[id]/status` - Check search progress
- `GET /api/search/[id]/results` - Fetch search results
- `GET /api/history` - Get search history

## Database Schema

The application uses four main models:

- **Search**: Tracks search queries and their status
- **TwitterResult**: Stores Twitter tweet data with metrics and media
- **RedditResult**: Stores Reddit post/community data
- **TikTokResult**: Stores TikTok video data with engagement metrics

## Apify Integration

The application integrates with three Apify actors:

- **Twitter**: `apidojo~tweet-scraper`
- **Reddit**: `trudax~reddit-scraper-lite`  
- **TikTok**: `clockworks~tiktok-scraper`

## Features in Detail

### Search Process
1. User enters search keyword
2. API initiates scraping on all three platforms simultaneously
3. Frontend polls for progress updates every 3 seconds
4. Results are fetched and stored in database when complete
5. Results displayed in tabbed interface

### Progress Tracking
- Real-time status updates for each platform
- Visual progress bar with percentage completion
- Platform-specific status indicators (Ready, Running, Succeeded, Failed)
- Automatic result fetching when all platforms complete

### Results Display
- **Twitter**: Tweet cards with author info, engagement metrics, and media
- **Reddit**: Post/community cards with upvote ratios and comment counts
- **TikTok**: Video cards with creator info, view counts, and cover images
- Responsive grid layouts optimized for each platform's content type

## Development

### Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
├── components/
│   ├── cards/         # Platform-specific result cards
│   ├── SearchBar.tsx
│   ├── ProgressTracker.tsx
│   ├── ResultsTabs.tsx
│   └── HistoryPanel.tsx
└── lib/
    └── prisma.ts      # Prisma client
```

### Key Components

- **SearchBar**: Input validation and search initiation
- **ProgressTracker**: Real-time progress monitoring with polling
- **ResultsTabs**: Tabbed interface for platform results
- **Platform Cards**: Specialized components for each platform's data display
- **HistoryPanel**: Modal for viewing and accessing previous searches

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

Make sure to:
1. Set environment variables in your deployment platform
2. Run database migrations
3. Ensure your PostgreSQL database is accessible from the deployment environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the GitHub issues page
2. Review the Apify documentation for API-related questions
3. Ensure your database connection and environment variables are properly configured


