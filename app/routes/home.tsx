import type { Route } from "./+types/home";
import { HomeHero } from "../components/HomeHero/HomeHero";
import { HomeMapPreview } from "../components/HomeMapPreview/HomeMapPreview";
import "./home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Electric City Aquarium & Reptile Den" },
    { name: "description", content: "Explore the animals of Electric City Aquarium & Reptile Den." },
  ];
}

export default function Home() {
  return (
    <div className="home-screen">
      <HomeHero />
      <HomeMapPreview />
    </div>
  );
}