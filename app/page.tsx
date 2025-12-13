import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, Zap, Trophy, Weight, Wand } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(3)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop"
            alt="Gym background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="container relative z-20 px-4 mx-auto">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Don't know where to start on your Fitness journey? <br /> <br />
              <span className="text-emerald-500">
                Start here.
              </span>
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed">
              Premium digital training programs backed by research to reach your fitness goals.<br />
              <span className="text-emerald-500">
                Download instantly and start your journey today.
              </span>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full">
                  Browse Programs <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-800 px-8 py-6 text-lg rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-950">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Programs</h2>
            <Link href="/products" className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <p className="text-zinc-500 col-span-3 text-center">No products available yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
