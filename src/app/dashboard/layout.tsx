import Head from "next/head";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/app/features/dashboard/sidebar";
import ReactQueryProvider from "../ReactQueryProvider";

export default function ItineraryDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <title>Itinerary Dashboard - Voyagr</title>
        <meta
          name="description"
          content="Manage your travel itineraries with Voyagr."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      />
      <SessionProvider>
        <ReactQueryProvider>
          <Sidebar>{children}</Sidebar>
        </ReactQueryProvider>
      </SessionProvider>
    </>
  );
}
