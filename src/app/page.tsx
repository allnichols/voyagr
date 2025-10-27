import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/app/components/navbar";
import { Edu_NSW_ACT_Cursive } from "next/font/google";

const cursiveMono = Edu_NSW_ACT_Cursive({
  variable: "--font-cursive-edu_nsw_act_cursive",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="hero min-h-screen container-custom">
        <div className="hero-content text-center flex-col lg:flex-row-reverse">
          <Image
            alt="Hero Image"
            width={500}
            height={500}
            layout="responsive"
            sizes="100%"
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="hidden max-w-sm rounded-lg shadow-2xl"
          />
          <div className="max-w-[100%]">
            <h1 className="text-5xl font-bold leading-14">
              Plan your perfect journey with ease
            </h1>
            <p className="py-6 text-xl">
              Transform travel chaos into seamless adventures. Craft
              personalized itineraries that turn every trip into an
              unforgettable experience.
            </p>
            <Link href="/auth/signup" className="btn btn-primary rounded-2xl">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Hello there</h1>
      <p className="py-6">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div> */
}
