"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Activity, ExternalLink, ArrowRightLeft } from "lucide-react";

interface MarketData {
  bestBid: number | null;
  bestAsk: number | null;
}

interface AssetData {
  asset: string;
  description: string;
  divisible: boolean;
  supply: number;
  locked: boolean;
  issuer: string;
  market?: MarketData;
}

const TARGET_ASSETS = ["MIKABOSHI", "BOSHICASH", "DANKROSECASH", "PEPECASH", "MEMETIC", "BOSHI"];

export default function TokenGallery() {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const promises = TARGET_ASSETS.map(async (asset) => {
          const [assetRes, marketRes] = await Promise.all([
            fetch(`https://tokenscan.io/api/asset/${asset}`).then(res => res.json()),
            fetch(`https://tokenscan.io/api/market/${asset}/XCP/orderbook`)
              .then(res => res.ok ? res.json() : { bids: [], asks: [] })
              .catch(() => ({ bids: [], asks: [] }))
          ]);
          
          if (!assetRes || assetRes.error || !assetRes.asset) return null;

          let bestBid = null;
          let bestAsk = null;

          if (marketRes.bids && marketRes.bids.length > 0) {
              bestBid = parseFloat(marketRes.bids[0][0]);
          }
          if (marketRes.asks && marketRes.asks.length > 0) {
              bestAsk = parseFloat(marketRes.asks[0][0]);
          }

          return {
            ...assetRes,
            market: { bestBid, bestAsk }
          };
        });

        const results = await Promise.all(promises);
        setAssets(results.filter(d => Boolean(d)) as AssetData[]);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 h-80 animate-pulse flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 rounded-full bg-slate-700/50"></div>
              <div className="w-24 h-6 rounded bg-slate-700/50"></div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-4 rounded bg-slate-700/50"></div>
              <div className="w-2/3 h-4 rounded bg-slate-700/50"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-14 rounded bg-slate-700/50"></div>
              <div className="h-14 rounded bg-slate-700/50"></div>
              <div className="h-14 rounded bg-slate-700/50"></div>
              <div className="h-14 rounded bg-slate-700/50"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.asset}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-panel rounded-2xl p-6 group relative overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-colors"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner overflow-hidden relative">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-accent z-0">
                  {asset.asset.substring(0, 2)}
                </span>
              </div>
              <a 
                href={`https://xchain.io/asset/${asset.asset}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1 truncate">{asset.asset}</h3>
            
            <p className="text-sm text-slate-400 mb-6 line-clamp-2 h-10">
              {asset.description && !asset.description.includes("http") ? asset.description : `The Counterparty asset ${asset.asset}`}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1 whitespace-nowrap font-semibold tracking-wider">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  Supply
                </div>
                <div className="text-white font-mono font-medium text-sm truncate w-full text-center">
                  {asset.divisible ? (asset.supply / 100000000).toLocaleString() : asset.supply.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1 font-semibold tracking-wider">
                  <TrendingUp className="w-3 h-3 text-fuchsia-400" />
                  Status
                </div>
                <div className="text-white font-mono font-medium text-sm truncate w-full text-center">
                  {asset.locked ? "Locked" : "Unlocked"}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase mb-1 whitespace-nowrap font-semibold tracking-wider relative z-10">
                  <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                  Ask (XCP)
                </div>
                <div className="text-emerald-400 font-mono font-medium text-sm truncate w-full text-center relative z-10">
                  {asset.market?.bestAsk ? `${asset.market.bestAsk.toFixed(6)}` : "None"}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center relative overflow-hidden group-hover:border-rose-500/30 transition-colors">
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase mb-1 whitespace-nowrap font-semibold tracking-wider relative z-10">
                  <ArrowRightLeft className="w-3 h-3 text-rose-400" />
                  Bid (XCP)
                </div>
                <div className="text-rose-400 font-mono font-medium text-sm truncate w-full text-center relative z-10">
                  {asset.market?.bestBid ? `${asset.market.bestBid.toFixed(6)}` : "None"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
