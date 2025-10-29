import Link from "next/link";
import Image from "next/image";
import NavBar from "@/app/components/marketing/navbar";
import Hero from "@/app/components/marketing/hero";
import Features from "./components/marketing/features";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Features />

      {/* Call to Action */}

      {/* Footer  */}
    </>
  );
}
