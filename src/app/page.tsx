import NavBar from "@/app/components/marketing/navbar";
import Hero from "@/app/components/marketing/hero";
import Features from "./components/marketing/features";
import Footer from "./components/marketing/footer";
import CallToAction from "./components/marketing/call-to-action";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </>
  );
}
