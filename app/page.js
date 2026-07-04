"use client";

import React, { useState } from "react";
import { Camera, Leaf, Trash2, ShieldAlert, Sparkles, RefreshCw, ChefHat, Droplets, Info } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle image capture/file select and convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit base64 to Next API Route
  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze-waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearApp = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      {/* Top Glossy Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md shadow-emerald-200">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              RescuEats AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Powered by Gemini 1.5 Flash
          </div>
        </div>
      </nav>

      {/* Hero Header Area */}
      <header className="max-w-4xl mx-auto text-center px-6 pt-12 pb-6">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-none">
          Stop Food Waste, <span className="text-emerald-600">Instantly.</span>
        </h1>
        <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
          Snap a picture of your open fridge or your latest grocery receipt. Our smart multi-modal stack immediately calculates carbon savings, detects shelf life, and writes instant recipes.
        </p>
      </header>

      {/* Interactive Core */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Management Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-600" /> Upload Food Source
          </h2>
          
          {!image ? (
            <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl h-72 cursor-pointer transition-all bg-slate-200/20 hover:bg-emerald-50/20">
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600 group-hover:text-emerald-700">Take Photo or Upload Image</p>
              <p className="text-xs text-slate-400 mt-1">Accepts Fridge interior snaps or Receipts</p>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-100 border border-slate-100">
              <img src={image} alt="Target upload" className="w-full object-cover max-h-80" />
              <button onClick={clearApp} className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-105">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {image && !result && (
            <button 
              onClick={analyzeImage} 
              disabled={loading}
              className="mt-4 w-full bg-slate-900 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Ecological Impact
                </>
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div><span className="font-bold">Analysis Failed:</span> {error}</div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Data Output Screen */}
        <div className="lg:col-span-7">
          {/* Skeleton Load State */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="bg-white border border-slate-200 h-28 rounded-3xl p-6 flex space-x-4">
                <div className="bg-slate-200 rounded-full w-12 h-12"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white h-24 rounded-2xl border border-slate-200"></div>
                <div className="bg-white h-24 rounded-2xl border border-slate-200"></div>
              </div>
              <div className="bg-white border border-slate-200 h-48 rounded-3xl"></div>
            </div>
          )}

          {/* Fallback View */}
          {!loading && !result && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center h-80 shadow-sm border-dashed">
              <ChefHat className="w-12 h-12 text-slate-300 stroke-1 mb-3" />
              <p className="font-semibold text-slate-600 text-sm">Dashboard Awaiting Visuals</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Upload an asset on the left to fire the automated model parsing engine.</p>
            </div>
          )}

          {/* Populated Result Layout */}
          {!loading && result && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Card 1: Ecological Savings Highlight */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-emerald-50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                  <Leaf className="w-40 h-40" />
                </div>
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-800/60">
                  Calculated Ecological Impact
                </span>
                <p className="mt-4 text-lg font-medium leading-snug">{result.ecoImpact.headline}</p>
                
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-emerald-800/60 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-800/40 border border-emerald-700/40 rounded-xl">
                      <Trash2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-black tracking-tight text-white">{result.ecoImpact.carbonSavedKg} kg</div>
                      <div className="text-xs text-emerald-300">CO2 Equivalent Saved</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-800/40 border border-emerald-700/40 rounded-xl">
                      <Droplets className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-black tracking-tight text-white">{result.ecoImpact.waterSavedLiters} L</div>
                      <div className="text-xs text-emerald-300">Water Footprint Retained</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Detected Expiry Matrix */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center justify-between">
                  <span>Identified Inventory Matrix</span>
                  <span className="text-xs font-medium text-slate-500 capitalize">{result.detectedItems.length} items found</span>
                </h3>
                <div className="divide-y divide-slate-100">
                  {result.detectedItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          item.statusColor.toLowerCase() === "red" ? "bg-rose-500 shadow-sm shadow-rose-200 animate-pulse" :
                          item.statusColor.toLowerCase() === "yellow" ? "bg-amber-400" : "bg-emerald-500"
                        }`} />
                        <span className="font-semibold text-slate-800 text-sm sm:text-base">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm">
                        <span className="text-slate-400">Confidence: <b className="text-slate-600 font-semibold">{item.confidence}</b></span>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                          item.statusColor.toLowerCase() === "red" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                          item.statusColor.toLowerCase() === "yellow" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {item.shelfLifeDays <= 0 ? "Spoils Today" : `~${item.shelfLifeDays} days left`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Anti-Waste Smart Recipes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recipes.map((recipe, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-emerald-600" /> {recipe.title}
                      </h4>
                      <span className="text-xs bg-slate-100 font-medium text-slate-600 px-2 py-0.5 rounded-md">{recipe.prepTime}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Target Ingredients Used:</span>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredientsNeeded.map((ing, i) => (
                          <span key={i} className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-md border border-emerald-100">{ing}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Execution Steps:</span>
                      <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside pl-0.5">
                        {recipe.instructions.map((step, i) => (
                          <li key={i} className="leading-tight">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card 4: Micro-Upcycling Accordion */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5">
                <h4 className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Scraps Upcycling & Composting Protocol
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-white border border-emerald-100/50 p-4 rounded-xl">
                    <span className="font-bold text-emerald-900 block mb-1">Secondary Scrap Utility</span>
                    <p className="text-slate-600 leading-normal text-xs">{result.compostGuide.scrapUsage}</p>
                  </div>
                  <div className="bg-white border border-emerald-100/50 p-4 rounded-xl">
                    <span className="font-bold text-emerald-900 block mb-1">Optimal Home Composting Tip</span>
                    <p className="text-slate-600 leading-normal text-xs">{result.compostGuide.compostingTip}</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}