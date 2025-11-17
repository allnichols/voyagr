import Link from "next/link";
import FlightIcon from "public/icons/flight";
import GlobeIcon from "public/icons/globe";
import CompassIcon from "public/icons/compass";

export default function Features() {
  return (
    <div className="container-custom">
      <div className="text-center md:w-[70%] md:m-auto">
        <p className="mb-2 text-primary">Navigate</p>
        <h2 className="font-bold text-3xl md:text-4xl mb-4">
          Turn travel dreams into living memories
        </h2>
        <p className="text-lg">
          Design your journey with precision. Select destinations, dates, and
          preferences to build a personalized travel roadmap.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6 mt-10">
        <div className="bg-base-100 rounded-lg p-6 h-full min-h-64 flex flex-col items-center text-center gap-4">
          <FlightIcon />
          <h3 className="text-xl font-bold">Create your travel blueprint</h3>
          <p className="text-sm opacity-80">
            Itineraries are easier to create than ever. Organize activities,
            accommodations, and transportation all in one place.
          </p>
        </div>
        <div className="bg-base-100 rounded-lg p-6 h-full min-h-64 flex flex-col items-center text-center gap-4">
          <GlobeIcon />
          <h3 className="text-xl font-bold">Explore interactive mapping</h3>
          <p className="text-sm opacity-80">
            Watch your route unfold with real-time mapping and intelligent
            recommendations.
          </p>
        </div>
        <div className="bg-base-100 rounded-lg p-6 h-full min-h-64 flex flex-col items-center text-center gap-4">
          <CompassIcon />
          <h3 className="text-xl font-bold">Craft day-by-day experiences</h3>
          <p className="text-sm opacity-80">
            Build an adventure tailored precisely to your wanderlust.
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <Link href={"/auth/signup"} className="btn btn-primary rounded-2xl ">
          Get Started
        </Link>
      </div>
    </div>
  );
}
