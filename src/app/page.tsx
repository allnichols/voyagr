import Link from "next/link";
import { NavBar } from "@/app/components/navbar";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <NavBar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center sm:text-left">
          Welcome to Voyagr
        </h1>
        <p className="text-lg sm:text-xl text-center sm:text-left max-w-2xl">
          Your personal AI travel assistant. Plan trips, get recommendations,
          and explore the world with ease.
        </p>
        <div className="flex gap-2">
          <Link href="/auth/signup" className="px-6 py-3 btn btn-primary rounded-2xl">
            Get Started
          </Link>
          <Link href="/auth/login" className="px-6 py-3 btn btn-secondary">
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
