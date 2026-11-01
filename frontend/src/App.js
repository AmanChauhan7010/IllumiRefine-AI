import React, { useState } from 'react';
import axios from 'axios';
import {
  Upload,
  Sun,
  Sparkles,
  Loader2,
  Download,
  Image as ImageIcon,
  Github,
  Linkedin,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Layers,
  Trash2,
  SlidersHorizontal,
  Info
} from 'lucide-react';

// API URL: points to local FastAPI backend by default or environment variable
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/enhance";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side' | 'enhanced'
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'pipeline' | 'about'

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  // Load file into memory safely as persistent Data URL (prevents broken blob URLs)
  const loadFile = (file, directUrl = null) => {
    setSelectedFile(file);
    setResult(null);
    setProcessingTime(null);
    setErrorMsg(null);

    if (directUrl) {
      setPreview(directUrl);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  // Load a quick sample image
  const loadSample = async (samplePath, sampleName) => {
    try {
      setErrorMsg(null);
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: 'image/png' });
      loadFile(file, samplePath);
    } catch (err) {
      console.error("Failed to load sample:", err);
      setErrorMsg("Failed to load sample image. Please try uploading an image.");
    }
  };

  // Reset image
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setProcessingTime(null);
    setErrorMsg(null);
  };

  // Run AI enhancement API
  const processImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setErrorMsg(null);
    const startTime = performance.now();

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(API_URL, formData, {
        responseType: 'blob',
        timeout: 60000,
      });

      const endTime = performance.now();
      setProcessingTime(((endTime - startTime) / 1000).toFixed(2));

      // Read response as persistent Data URL (never gets revoked or expired)
      const reader = new FileReader();
      reader.onload = () => {
        setResult(reader.result);
      };
      reader.readAsDataURL(response.data);
    } catch (err) {
      console.error("Enhancement failed:", err);
      setErrorMsg(
        "Could not connect to backend at " +
        API_URL +
        ". Make sure 'python main.py' is running in your terminal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FAFAF9] text-slate-800 flex flex-col relative selection:bg-amber-100 selection:text-amber-900"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Warm Sunlight Glow (Top Left) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl opacity-70"></div>
        {/* Soft Azure Glow (Top Right) */}
        <div className="absolute top-10 right-0 w-[30rem] h-[30rem] bg-sky-200/30 rounded-full blur-3xl opacity-60"></div>
        {/* Soft Lavender Glow (Bottom Center) */}
        <div className="absolute bottom-0 left-1/3 w-[36rem] h-80 bg-indigo-100/30 rounded-full blur-3xl opacity-50"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      </div>

      {/* Modern Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
              <Sun size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 bg-clip-text text-transparent">
                  IllumiRefine<span className="text-amber-500 font-black">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase tracking-wider">
                  CVPR '22 SCI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Extreme Low-Light AI Enhancement & Retinex Frequency Fusion
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'studio'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Enhance Studio
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Algorithmic Pipeline
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Research & Team
            </button>
          </nav>

          {/* Creator & Links */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://www.linkedin.com/in/aman-chauhan2001/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs hover:shadow-xs transition-all"
            >
              <Linkedin size={14} className="text-[#0A66C2]" />
              <span className="hidden sm:inline text-slate-500 font-normal">By</span>
              <span className="font-bold">Aman Chauhan</span>
            </a>

            <a
              href="https://github.com/AmanChauhan7010/IllumiRefine-AI.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs hover:shadow-sm transition-all"
            >
              <Github size={14} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">

        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto mb-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 mb-4 shadow-2xs">
            <Sparkles size={13} className="text-amber-500" />
            <span>Novel Illumination-Guided Adaptive Denoising & Tone Recovery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Illuminate the Shadows. <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Reveal Hidden Clarity.
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Restore structural fidelity, suppress severe photon noise, and balance dynamic range in extreme low-light scenes with our ultra-fast deep learning framework.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-slate-200 rounded-full shadow-2xs">
              <Zap size={14} className="text-amber-500" />
              <span className="font-bold text-slate-800">&lt; 2s</span> CPU Latency
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-slate-200 rounded-full shadow-2xs">
              <Layers size={14} className="text-indigo-500" />
              <span className="font-bold text-slate-800">0.06 GFLOPs</span> Model Footprint
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-slate-200 rounded-full shadow-2xs">
              <Sun size={14} className="text-orange-500" />
              <span className="font-bold text-slate-800">1.8x Gain</span> Adaptive Gamma
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-slate-200 rounded-full shadow-2xs">
              <Shield size={14} className="text-emerald-500" />
              <span className="font-bold text-slate-800">100% In-Memory</span> Safe
            </div>
          </div>
        </section>

        {/* ERROR NOTIFICATION BANNER */}
        {errorMsg && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
            <Info size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Backend Connection Notice</p>
              <p className="text-xs text-rose-700 mt-0.5">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: ENHANCE STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* Studio Workspace Card */}
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-6 lg:p-8">

              {/* Sample Images Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quick Benchmark Samples:
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => loadSample('/samples/pool.png', 'pool_benchmark.png')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <ImageIcon size={13} className="text-amber-500" />
                    <span>Sample 1: Dark Pool</span>
                  </button>
                  <button
                    onClick={() => loadSample('/samples/night.png', 'night_street.png')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-200 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <ImageIcon size={13} className="text-indigo-500" />
                    <span>Sample 2: Night Scene</span>
                  </button>
                  {selectedFile && (
                    <button
                      onClick={handleReset}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Two Column Work Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* 1. INPUT BOX */}
                <div className="flex flex-col bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[11px]">
                        1
                      </span>
                      Source Image (Low-Light)
                    </h2>
                    {selectedFile && (
                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[180px]">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </span>
                    )}
                  </div>

                  {/* Dropzone / Preview Area */}
                  <div
                    className={`relative aspect-[4/3] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                      dragActive
                        ? 'border-amber-500 bg-amber-50/40'
                        : preview
                        ? 'border-slate-300 bg-slate-900/5'
                        : 'border-slate-300 hover:border-amber-400 bg-white'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Low Light Input Preview"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-center p-6 flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-3 shadow-2xs">
                          <Upload size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supports PNG, JPG, JPEG, WEBP up to 25MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      accept="image/*"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={processImage}
                    disabled={!selectedFile || loading}
                    className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white" />
                        <span>Enhancing Image via SCI Neural Net...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Enhance Image Now</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 2. RESULT BOX */}
                <div className="flex flex-col bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
                        2
                      </span>
                      Enhanced Clarity (Result)
                    </h2>

                    {result && (
                      <div className="flex items-center gap-2">
                        {processingTime && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ⚡ {processingTime}s
                          </span>
                        )}
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-semibold text-slate-600">
                          <button
                            onClick={() => setViewMode('slider')}
                            className={`px-2.5 py-0.5 rounded transition-colors ${
                              viewMode === 'slider' ? 'bg-slate-900 text-white font-bold' : 'hover:text-slate-900'
                            }`}
                          >
                            Split Slider
                          </button>
                          <button
                            onClick={() => setViewMode('side-by-side')}
                            className={`px-2.5 py-0.5 rounded transition-colors ${
                              viewMode === 'side-by-side' ? 'bg-slate-900 text-white font-bold' : 'hover:text-slate-900'
                            }`}
                          >
                            Side-by-Side
                          </button>
                          <button
                            onClick={() => setViewMode('enhanced')}
                            className={`px-2.5 py-0.5 rounded transition-colors ${
                              viewMode === 'enhanced' ? 'bg-slate-900 text-white font-bold' : 'hover:text-slate-900'
                            }`}
                          >
                            Enhanced Only
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display Area */}
                  <div className="relative aspect-[4/3] rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
                          <Sun size={24} className="absolute inset-0 m-auto text-amber-500 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Executing Deep Retinex...</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Estimating illumination map & applying adaptive NLM fusion
                          </p>
                        </div>
                      </div>
                    ) : result ? (
                      viewMode === 'slider' && preview ? (
                        /* Interactive Before / After Split Slider with reliable native drag */
                        <div
                          className="relative w-full h-full select-none overflow-hidden"
                        >
                          {/* Background: Original Low Light */}
                          <img
                            src={preview}
                            alt="Original Low Light"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none p-1"
                            draggable={false}
                          />
                          <span className="absolute bottom-3 left-3 px-2 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded shadow-xs z-10 pointer-events-none">
                            Original (Dark)
                          </span>

                          {/* Foreground: Enhanced Result clipped by slider */}
                          <div
                            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                          >
                            <img
                              src={result}
                              alt="Enhanced Result"
                              className="absolute inset-0 w-full h-full object-contain p-1"
                              draggable={false}
                            />
                            <span className="absolute bottom-3 right-3 px-2 py-1 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold rounded shadow-xs z-10 pointer-events-none">
                              ✨ Enhanced AI
                            </span>
                          </div>

                          {/* Divider Line & Center Pill */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)] pointer-events-none z-20"
                            style={{ left: `${sliderPosition}%` }}
                          >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-500 flex items-center justify-center text-slate-700">
                              <SlidersHorizontal size={14} className="text-amber-600" />
                            </div>
                          </div>

                          {/* Invisible native range slider for smooth, crash-proof clicking and dragging */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPosition}
                            onChange={(e) => setSliderPosition(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
                            aria-label="Before and after split slider"
                          />
                        </div>
                      ) : viewMode === 'side-by-side' && preview ? (
                        /* True Side-by-Side comparison */
                        <div className="w-full h-full grid grid-cols-2 gap-2 p-2 bg-slate-100/60">
                          <div className="relative h-full flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <img src={preview} alt="Original" className="w-full h-full object-contain p-1" draggable={false} />
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold rounded">
                              Original
                            </span>
                          </div>
                          <div className="relative h-full flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <img src={result} alt="Enhanced" className="w-full h-full object-contain p-1" draggable={false} />
                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-emerald-600/90 text-white text-[9px] font-bold rounded">
                              ✨ Enhanced
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Plain Enhanced Image Output */
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={result}
                            alt="Enhanced Result"
                            className="w-full h-full object-contain p-1"
                          />
                          <span className="absolute bottom-3 right-3 px-2 py-1 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold rounded shadow-xs">
                            ✨ Enhanced AI
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                          <Sun size={24} />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">Awaiting image</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          Upload a dark photo or select a benchmark sample above to test.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Result Controls */}
                  {result ? (
                    <div className="mt-4 flex items-center gap-3">
                      <a
                        href={result}
                        download={`illumirefine_${Date.now()}.png`}
                        className="flex-1 py-3.5 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-center cursor-pointer"
                      >
                        <Download size={18} />
                        <span>Download High-Res PNG</span>
                      </a>
                    </div>
                  ) : (
                    <div className="mt-4 py-3.5 px-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
                      Enhanced output will display here with interactive slider comparison
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scientific Pipeline Highlights 3-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3 font-extrabold text-sm">
                  01
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  Phase 1: Frequency Decomposition
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applies logarithmic transform and 2D FFT Gaussian High-Pass filtering to separate static low-frequency illumination fields from sharp high-frequency reflectance edges.
                </p>
              </div>

              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-3 font-extrabold text-sm">
                  02
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  Phase 2: Self-Calibrated Illumination
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Employs a CVPR 2022 unsupervised 3-layer convolutional network that converges without paired ground-truth images, consuming only 0.0619 GFLOPs.
                </p>
              </div>

              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 font-extrabold text-sm">
                  03
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  Phase 3: SCI-Guided Adaptive Fusion
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Novel hybrid layer: multiplies by 1.8x exposure gain with fractional gamma (0.75) and uses the AI's illumination map as an alpha mask for selective Non-Local Means denoising.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALGORITHMIC PIPELINE DETAILS */}
        {activeTab === 'pipeline' && (
          <div className="max-w-4xl mx-auto bg-white/95 border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-lg space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Algorithmic Pipeline & Methodology</h2>
              <p className="text-sm text-slate-600 mt-1">
                From Retinex mathematical fundamentals to unsupervised deep learning and adaptive denoising fusion.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-2">
                  <CheckCircle2 size={16} /> 1. Retinex Theory in Frequency Domain
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  An image \(S(x, y)\) is modelled as the product of illumination \(L(x, y)\) and reflectance \(R(x, y)\):
                  <code className="block my-2 p-2 bg-white rounded border border-slate-200 font-mono text-xs text-slate-800">
                    S(x, y) = L(x, y) × R(x, y) ⇒ ln(S) = ln(L) + ln(R)
                  </code>
                  By taking the natural logarithm, multiplication becomes addition, allowing Gaussian High-Pass filtering in the frequency domain to suppress illumination shadows while retaining sharp object details.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-2">
                  <CheckCircle2 size={16} /> 2. Self-Calibrated Illumination Architecture (SCI)
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  During inference, the complex calibration module is discarded. The operational core is a compact 3-layer sequential block:
                  <code className="block my-2 p-2 bg-white rounded border border-slate-200 font-mono text-xs text-slate-800">
                    Input(3) → Conv(3, 3) + ReLU → [Conv + BatchNorm + ReLU] → Conv(3, 3) + Sigmoid → Illumination Map
                  </code>
                  This ultra-lightweight architecture evaluates in under 2 seconds on standard CPU hardware with an operational footprint of just 0.0619 GFLOPs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-2">
                  <CheckCircle2 size={16} /> 3. Novel Adaptive Post-Processing Hybrid Layer
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To eliminate the grey mid-tone dullness and chromatic noise spikes typical of standard Retinex networks, two innovations were engineered:
                </p>
                <ul className="mt-2 space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  <li>
                    <strong>Fractional Gamma (0.75) & Exposure Boost (1.8x):</strong> Dynamically lifts deep black shadows without blowing out HDR elements like LED clocks or headlights.
                  </li>
                  <li>
                    <strong>Illumination-Guided Alpha Blend Denoising:</strong> Uses the AI's predicted illumination map to weight a Fast Non-Local Means filter: dark pixels receive full denoising, while naturally bright pixels preserve raw high-frequency edge sharpness.
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setActiveTab('studio')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all inline-flex items-center gap-2"
              >
                <span>Try the Model in Enhance Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT & RESEARCH TEAM */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white/95 border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-lg space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Research & Contributors</h2>
              <p className="text-sm text-slate-600 mt-1">
                Developed as an M.Sc. Data Science research initiative at Dhirubhai Ambani University (DA-IICT).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600">Lead Developer</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Aman Chauhan</h3>
                <p className="text-xs text-slate-500 mb-3">M.Sc. Data Science, DA-IICT</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Focused on deep learning inference optimization, the novel adaptive fusion layer, and full-stack deployment.
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/in/aman-chauhan2001/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] text-white rounded-lg text-xs font-bold hover:bg-[#084e96] transition-colors"
                  >
                    <Linkedin size={13} />
                    <span>LinkedIn Profile</span>
                  </a>
                  <a
                    href="https://github.com/AmanChauhan7010"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    <Github size={13} />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600">Co-Developer</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Kunal Pramanik</h3>
                <p className="text-xs text-slate-500 mb-3">M.Sc. Data Science, DA-IICT</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Focused on frequency-domain Homomorphic filtering experiments, dataset curation, and benchmark evaluations.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">M.Sc. Data Science Research Team</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700">Academic Guidance</span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Dr. Srimanta Mandal</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Associate Professor, Dhirubhai Ambani University (DA-IICT)
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Special thanks to the authors of the Self-Calibrated Illumination (CVPR 2022) framework for their open-source contributions.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Modern Light Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 backdrop-blur-xs py-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
              IR
            </div>
            <span>
              <strong>IllumiRefine AI</strong> &copy; {new Date().getFullYear()} — DA-IICT Research
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AmanChauhan7010/IllumiRefine-AI.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 font-semibold transition-colors flex items-center gap-1"
            >
              <Github size={13} />
              <span>Repository</span>
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/aman-chauhan2001/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A66C2] font-semibold transition-colors flex items-center gap-1"
            >
              <Linkedin size={13} />
              <span>Aman Chauhan</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
