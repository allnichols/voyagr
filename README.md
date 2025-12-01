# Voyagr 🌍

An AI-powered travel planning app that helps users create personalized itineraries. Built with Next.js, TypeScript, and Google AI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)
- [Known Issues & Roadmap](#known-issues--roadmap)
- [Development Decisions](#development-decisions)

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

## Known Issues & Roadmap

- [ ] **Finish Details Panel** - Display extra details about a place [branch](https://github.com/allnichols/voyagr/tree/feature-details)
- [ ] **Better Sidebar Layout** - Use the sidebar from [daisy ui]([http://localhost:3000](https://daisyui.com/components/drawer/#responsive-collapsible-icon-only-drawer-sidebar-using-is-drawer-close-and-is-drawer-open)) 
- [ ] **Add Budget** - Ability for users to set a budget for their trip
- [ ] **Export Features** - Export itinerary to PDF or calendar
- [ ] **Improve Mobile Experience** - Polish the mobile experience for the web.
- [ ] **Book Flights, Hotels, and Tours** - Use external providers to book flights, hotels and tours and add them to the itinerary
- [ ] **Test Coverage** - Increase test coverage
- [ ] **Make an API** - Develop an API to handle web and mobile.
- [ ] **Make Mobile app** - ... 

## Development Decisions

**Why Next.js App Router?** 
- Server-side rendering for better SEO and performance
- Built-in API routes for full-stack development
- Excellent TypeScript support and file-based routing
- Easier to get a MVP out there.

**Why Zustand over Redux?** 
- Lighter weight and simpler state management
- Less boilerplate code

**Why React Query?**
- Intelligent caching and background updates
- Optimistic updates for better UX
- Built-in error handling and loading states


---

⭐ If you found this project interesting, please consider giving it a star!
