import Image from "next/image";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <PopularDestinations/>
      <Footer/>
    </div>
  );
}
