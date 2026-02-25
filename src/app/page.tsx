import TokenGallery from "@/components/TokenGallery";
import Bridge from "@/components/Bridge";
import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">
                BOSHI BOARD
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#gallery" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide uppercase">Gallery</a>
              <a href="#bridge" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide uppercase">Bridge</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Cross-Chain Counterparty Bridge Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Future of <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-fuchsia-500 to-accent">BOSHI</span> Tokens
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Explore the gallery of MIKA & BOSHI assets, track real-time DEX liquidity, and seamlessly bridge your Ethereum BOSHICASH to Counterparty.
          </p>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="scroll-mt-24">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                Token Gallery
              </h2>
              <p className="text-slate-400">
                Real-time data for BOSHI & MIKA assets on Counterparty.
              </p>
            </div>
          </div>
          <TokenGallery />
        </section>

        {/* Bridge Section */}
        <section id="bridge" className="scroll-mt-24 max-w-xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Cross-Chain Bridge
            </h2>
            <p className="text-slate-400">
              Wrap and swap BOSHICASH (Ethereum) to DANKROSECASH (Bitcoin) via Emblem Vault.
            </p>
          </div>
          <Bridge />
        </section>

      </main>
    </div>
  );
}
