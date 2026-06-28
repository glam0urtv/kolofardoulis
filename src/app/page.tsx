import { HomeClient } from "@/components/home-client"
import AnimatedBanner from "@/components/animated-banner"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl">
        <AnimatedBanner />
      </section>
      <HomeClient />
    </div>
  )
}
