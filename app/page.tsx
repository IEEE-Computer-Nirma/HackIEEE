import Hero from "./components/Hero";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Timeline from "./components/Timeline";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-clip">
      <Hero />
      <div className="relative z-10 w-full bg-bg">
        <About />
        <Tracks />
        <Timeline />
        <Footer />
      </div>
    </main>
  );
}
