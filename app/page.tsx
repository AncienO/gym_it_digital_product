import Link from "next/link"
import { ArrowRight, Dumbbell, Wand, Trophy, GraduationCap } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { TestimonialsSection } from "@/components/TestimonialsSection"
import { HeroSection } from "@/components/HeroSection"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(6)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-zinc-950">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <Wand className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Expert Design</h3>
              <p className="text-zinc-400">Programs backed by research to ensure maximum results.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <Dumbbell className="h-12 w-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Strength Training</h3>
              <p className="text-zinc-400">Available programs for building your physique.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <Trophy className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Athletic Performance</h3>
              <p className="text-zinc-400">Move better and prevent injury.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <GraduationCap className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Beginner-Friendly</h3>
              <p className="text-zinc-400">Perfect for those just starting their fitness journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Programs</h2>
            <Link href="/products" className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts?.map((product) => (
              <div key={product.id} className="w-full max-w-[340px] mx-auto">
                <ProductCard product={product} />
              </div>
            ))}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <p className="text-zinc-500 col-span-full text-center">No products available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  )
}
