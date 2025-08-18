"use client"

import { Header } from "@/components/header"
import { QuoteForm } from "@/components/quote-form"
import { DimensionsInfo } from "@/components/dimensions-info"
import { Footer } from "@/components/footer"
import { QuoteResult } from "@/components/quote-result"
import { useState } from "react"

export default function Home() {
  const [quote, setQuote] = useState<null | {
    match: { origen: string; destino: string; pesoSolicitado: number; bucketSeleccionado: number }
    resultado: any
  }>(null)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <QuoteForm onQuote={setQuote} />
          {/* Reemplaza el card de dimensiones con el resultado cuando exista */}
          {quote ? <QuoteResult quote={quote} /> : <DimensionsInfo />}
        </div>
      </main>
      <Footer />
    </div>
  )
}
