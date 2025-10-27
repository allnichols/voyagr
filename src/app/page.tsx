import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/app/components/marketing/navbar";
import { Hero } from "@/app/components/marketing/hero";
import { Edu_NSW_ACT_Cursive } from "next/font/google";

const cursiveMono = Edu_NSW_ACT_Cursive({
  variable: "--font-cursive-edu_nsw_act_cursive",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      {/* Whats inside */}
      {/* Call to Action */}
      {/* Footer  */}
    </>
  );
}
