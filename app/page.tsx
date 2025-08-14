import { Header } from "@/components/header"
import { QuoteForm } from "@/components/quote-form"
import { DimensionsInfo } from "@/components/dimensions-info"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <QuoteForm />
          <DimensionsInfo />
        </div>
      </main>
      <Footer />
    </div>
  )
}
