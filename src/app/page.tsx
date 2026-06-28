import { HomeClient } from "@/components/home-client"
import { LazyShowcaseScene } from "@/components/three/three-scene-loader"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl">
        <LazyShowcaseScene />
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-5xl lg:text-6xl">
            Το trading card game κατάστημά σου
          </h1>
          <p className="mt-4 text-lg text-stone-200 drop-shadow md:text-xl">
            One Piece TCG • Pokemon • Riftbound • Singles • Booster Boxes
          </p>
        </div>
      </section>
      <HomeClient />
    </div>
  )
}
