# Voyagr

An AI-powered travel planning app that helps users create personalized itineraries. Built with Next.js, Typescript, and Google AI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#️tech-stack)
- [Architecture](#️architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)

---

## Features 
- **AI-Powered Itinerary Generation** - Uses Google Gemini AI to generate personalized trips
- **Interactive Trip Planning** - Drag-and-drop interface for organizing activities and days
- **Real-time Map Integration** - Interactive maps with activity markers using Leaflet
- **Google Places Integration** - Search and add real places with ratings, photos, and details
- **User Authentication** - Secure login with NextAuth.js (Google OAuth, more to come...)
- **Real-time Updates** - React Query for efficient data fetching and caching

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- React Query (TanStack)
- Tailwind CSS + DaisyUI
- React Leaflet (Maps)
- Zustand (State Management)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

**External APIs:**
- Google Gemini AI
- Google Places API
- Google Maps API

**Testing & Quality:**
- Jest + React Testing Library
- Biome (Linting & Formatting)

## Architecture

**Features based structure**
```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable UI components
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   ├── dashboard/        # Main dashboard
│   └── trips/           # Trip management
├── lib/                  # Utilities and configurations
└── types/               # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud API keys (Places, Maps, Gemini AI)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/voyagr.git
cd voyagr
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Required environment variables:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_MAPS_API_KEY="your-maps-api-key"
GOOGLE_GENAI_API_KEY="your-gemini-api-key"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```
