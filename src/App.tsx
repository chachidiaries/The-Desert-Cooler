/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Snowflake, RefreshCw, Shield, Droplets, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Constants for simulation
const BASE_SURVIVAL_TIME = 60; // seconds
const FOIL_MULTIPLIER = 0.65;
const FABRIC_MULTIPLIER = 0.65;
const BOTH_MULTIPLIER = 0.30;

export default function App() {
  const [isFoilOn, setIsFoilOn] = useState(false);
  const [isWetFabricOn, setIsWetFabricOn] = useState(false);
  const [health, setHealth] = useState(100); // 0 to 100
  const [isMelted, setIsMelted] = useState(false);
  
  // Calculate current melt rate (% per real-world second)
  const getMeltRate = () => {
    const baseRate = 100 / BASE_SURVIVAL_TIME;
    if (isFoilOn && isWetFabricOn) return baseRate * BOTH_MULTIPLIER;
    if (isFoilOn || isWetFabricOn) return baseRate * FOIL_MULTIPLIER;
    return baseRate;
  };

  const currentRate = getMeltRate();
  const timeLeft = Math.max(0, health / currentRate);

  // Simulation loop
  useEffect(() => {
    if (health <= 0) {
      setIsMelted(true);
      return;
    }

    const interval = setInterval(() => {
      setHealth((prev) => {
        const next = prev - (currentRate / 10); // Update every 100ms
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentRate, health]);

  const handleReset = () => {
    setHealth(100);
    setIsMelted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Status message logic
  const getStatus = () => {
    if (isMelted) return { text: "CRITICAL FAILURE: Food supply lost. System reset required.", color: "text-red-500", icon: <AlertTriangle className="w-4 h-4" /> };
    if (isFoilOn && isWetFabricOn) return { text: "OPTIMAL: Reflection + Evaporation engaged. Ice supply stable.", color: "text-green-500", icon: <CheckCircle2 className="w-4 h-4" /> };
    if (isFoilOn) return { text: "Foil ON: Reflection active. Heat partially deflected.", color: "text-amber-500", icon: <Shield className="w-4 h-4" /> };
    if (isWetFabricOn) return { text: "Fabric ON: Evaporation active. Cooling in progress.", color: "text-amber-500", icon: <Droplets className="w-4 h-4" /> };
    return { text: "WARNING: No protection active. Ice supply critical.", color: "text-red-500", icon: <AlertTriangle className="w-4 h-4" /> };
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-500 font-mono selection:bg-amber-500/30 flex flex-col overflow-hidden relative">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Header */}
      <header className="border-b border-amber-900/50 p-4 bg-[#0d0d0d] flex justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <h1 className="text-xl font-bold tracking-tighter uppercase">
            The Desert Cooler <span className="text-amber-700">—</span> Blocking Heat
          </h1>
        </div>
        <div className="text-xs text-amber-700 hidden sm:block">
          SYS_VER: 2.4.0-SCAVENGED
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Simulation Visual Panel */}
        <section id="simulation-panel" className="flex-1 bg-[#050505] border border-amber-900/30 rounded-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
          {/* Sun */}
          <div className="absolute top-8 flex flex-col items-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Sun className="w-16 h-16 text-amber-500 drop-shadow-[0_0_15px_#f59e0b]" />
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            </motion.div>
            
            {/* Heat Rays */}
            <div className="mt-4 flex gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 200, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="w-0.5 h-12 bg-gradient-to-b from-amber-500 to-transparent"
                />
              ))}
            </div>
          </div>

          {/* Roof Layer (Foil) */}
          <AnimatePresence>
            {isFoilOn && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                className="absolute top-48 w-64 h-4 bg-amber-200/20 border-y border-amber-400/50 backdrop-blur-sm z-20 flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(245,158,11,0.1)_10px,rgba(245,158,11,0.1)_20px)]" />
                {/* Reflection Rays */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -100, x: i % 2 === 0 ? 50 : -50, opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute w-0.5 h-8 bg-amber-200"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fabric Layer */}
          <AnimatePresence>
            {isWetFabricOn && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-60 w-56 h-3 bg-amber-900/40 border-x border-amber-700/30 z-10"
              >
                {/* Drip Particles */}
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: 40, opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full"
                    style={{ left: `${i * 20}%` }}
                  />
                ))}
                {/* Evaporation Mist */}
                <motion.div 
                  animate={{ opacity: [0.1, 0.3, 0.1], y: [-5, -15, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-10 inset-x-0 h-10 bg-gradient-to-t from-amber-500/10 to-transparent blur-md"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ice Cube Visual */}
          <div className="absolute bottom-20 flex flex-col items-center">
            <motion.div
              animate={{ 
                scale: health / 100,
                opacity: 0.3 + (health / 100) * 0.7,
                filter: isMelted ? 'blur(8px)' : 'blur(0px)'
              }}
              className="relative w-32 h-32 bg-amber-100/20 border-2 border-amber-200/40 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.1)]"
            >
              <Snowflake className={`w-12 h-12 text-amber-100/50 ${isMelted ? 'opacity-0' : 'opacity-100'}`} />
              {/* Cracks */}
              {health < 70 && (
                <div className="absolute inset-0 border-t border-r border-amber-200/20 rotate-45 scale-75" />
              )}
              {health < 40 && (
                <div className="absolute inset-0 border-b border-l border-amber-200/20 -rotate-12 scale-50" />
              )}
            </motion.div>
            <div className="mt-4 text-[10px] text-amber-700 uppercase tracking-widest">
              Food Supply Matrix
            </div>
          </div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {isMelted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-center p-6"
              >
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-bold text-red-500 mb-2 tracking-tighter">SIMULATION TERMINATED</h2>
                <p className="text-amber-700 max-w-md mb-8">Thermal threshold exceeded. Biological assets compromised. Immediate reset required to re-initiate cooling sequence.</p>
                <button 
                  onClick={handleReset}
                  className="px-8 py-3 bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all font-bold flex items-center gap-2 group"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  REBOOT SYSTEM
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Control Panel & Timer */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          
          {/* Live Timer Display */}
          <div className="bg-[#0d0d0d] border border-amber-900/50 rounded-lg p-6 flex flex-col items-center shadow-inner">
            <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1 self-start">Survival Window</div>
            <div className="text-6xl font-black tracking-tighter tabular-nums text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full h-1 bg-amber-900/30 mt-4 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${health}%` }}
                className={`h-full ${health > 50 ? 'bg-amber-500' : health > 20 ? 'bg-orange-500' : 'bg-red-500'}`}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 bg-[#0d0d0d] border border-amber-900/50 rounded-lg p-6 flex flex-col gap-6">
            <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-2">Cooling Modules</div>
            
            {/* Foil Toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  SHINY ROOF (FOIL)
                </label>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isFoilOn ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-transparent border-amber-900 text-amber-900'}`}>
                  {isFoilOn ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <button 
                onClick={() => !isMelted && setIsFoilOn(!isFoilOn)}
                disabled={isMelted}
                className={`h-12 border transition-all flex items-center px-4 gap-3 relative overflow-hidden group ${isFoilOn ? 'bg-amber-500/10 border-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]' : 'bg-black/40 border-amber-900/50 hover:border-amber-700'}`}
              >
                <div className={`w-4 h-4 rounded-sm border ${isFoilOn ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-amber-700'}`} />
                <span className={isFoilOn ? 'text-amber-500' : 'text-amber-800'}>ENGAGE REFLECTIVE LAYER</span>
                {isFoilOn && <motion.div layoutId="foil-glow" className="absolute inset-0 bg-amber-500/5 pointer-events-none" />}
              </button>
            </div>

            {/* Fabric Toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  WET FABRIC LAYERS
                </label>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isWetFabricOn ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-transparent border-amber-900 text-amber-900'}`}>
                  {isWetFabricOn ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <button 
                onClick={() => !isMelted && setIsWetFabricOn(!isWetFabricOn)}
                disabled={isMelted}
                className={`h-12 border transition-all flex items-center px-4 gap-3 relative overflow-hidden group ${isWetFabricOn ? 'bg-amber-500/10 border-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]' : 'bg-black/40 border-amber-900/50 hover:border-amber-700'}`}
              >
                <div className={`w-4 h-4 rounded-sm border ${isWetFabricOn ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-amber-700'}`} />
                <span className={isWetFabricOn ? 'text-amber-500' : 'text-amber-800'}>ENGAGE EVAPORATIVE LAYER</span>
                {isWetFabricOn && <motion.div layoutId="fabric-glow" className="absolute inset-0 bg-amber-500/5 pointer-events-none" />}
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-amber-900/30 flex flex-col gap-4">
              <div className="flex justify-between text-[10px] text-amber-800">
                <span>MELT RATE:</span>
                <span className="tabular-nums">{(currentRate * 10).toFixed(2)}% / SEC</span>
              </div>
              <button 
                onClick={handleReset}
                className="w-full py-3 border border-amber-700/50 text-amber-700 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" />
                RESET SIMULATION
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Status Bar */}
      <footer className="bg-[#0d0d0d] border-t border-amber-900/50 p-2 px-4 flex items-center gap-3 text-xs">
        <div className={`flex items-center gap-2 ${status.color}`}>
          {status.icon}
          <span className="font-bold uppercase tracking-wider">{status.text}</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-amber-900">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>PWR: STABLE</span>
          </div>
          <div className="hidden sm:block">
            LOC: DESERT_SECTOR_7
          </div>
        </div>
      </footer>
    </div>
  );
}
