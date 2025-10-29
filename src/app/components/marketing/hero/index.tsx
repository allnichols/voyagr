import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <div className="hero min-h-screen container-custom">
        <div className="hero-content text-center flex-col md:flex-row-reverse md:px-0 md:justify-between">
          <Image
            alt="Hero Image"
            width={500}
            height={500}
            layout="responsive"
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="hidden md:inline-flex max-w-sm rounded-lg shadow-2xl"
          />
          <div className="max-w-[100%] md:w-[50%] md:text-left">
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
    )
}