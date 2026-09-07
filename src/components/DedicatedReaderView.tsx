import React, { useState, useEffect, useRef } from 'react';
import { BookProject } from '../types/flipbook';
import { FlipbookPreview } from './FlipbookPreview';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Grid,
  Share2,
  Sparkles,
  Download,
  Printer,
  X,
  Copy,
  Check,
  QrCode,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { playFlipSound } from '../utils/audio';
import { createInstantSharePackage, PublishResult } from '../utils/cloudPublisher';
import { generateStandaloneFlipbookHtml } from '../utils/exportHtml';

interface DedicatedReaderViewProps {
  book: BookProject;
  initialPageIndex?: number;
  onExitReader?: () => void;
  onOpenStudio?: () => void;
}

export const DedicatedReaderView: React.FC<DedicatedReaderViewProps> = ({
  book,
  initialPageIndex = 0,
  onExitReader,
  onOpenStudio,
}) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(initialPageIndex);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(book.soundEnabled ?? true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(5000);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareData, setShareData] = useState<PublishResult | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [sliderVal, setSliderVal] = useState<number>(initialPageIndex);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<any>(null);

  const totalPages = book.pages.length;

  // Sync slider with active page
  useEffect(() => {
    setSliderVal(activePageIndex);
  }, [activePageIndex]);

  // Handle Keyboard Arrow Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleJumpToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleJumpToPage(totalPages - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (showThumbnails) setShowThumbnails(false);
        if (showShareModal) setShowShareModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageIndex, totalPages, showThumbnails, showShareModal]);

  // Auto-play slideshow timer
  useEffect(() => {
    if (isPlayingAuto) {
      autoPlayTimerRef.current = setInterval(() => {
        setActivePageIndex((prev) => {
          if (prev >= totalPages - 2) {
            setIsPlayingAuto(false);
            return prev;
          }
          if (soundEnabled) playFlipSound('paper');
          return Math.min(totalPages - 1, prev + 2);
        });
      }, autoPlayInterval);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlayingAuto, autoPlayInterval, totalPages, soundEnabled]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleNextPage = () => {
    if (activePageIndex < totalPages - 1) {
      const nextIdx = Math.min(totalPages - 1, activePageIndex + (activePageIndex === 0 ? 1 : 2));
      setActivePageIndex(nextIdx);
      if (soundEnabled) playFlipSound('paper');
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      const prevIdx = Math.max(0, activePageIndex - (activePageIndex === 1 ? 1 : 2));
      setActivePageIndex(prevIdx);
      if (soundEnabled) playFlipSound('paper');
    }
  };

  const handleJumpToPage = (index: number) => {
    const safeIdx = Math.max(0, Math.min(totalPages - 1, index));
    setActivePageIndex(safeIdx);
    if (soundEnabled) playFlipSound('paper');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleOpenShare = async () => {
    try {
      const result = await createInstantSharePackage(book);
      setShareData(result);
      setShowShareModal(true);
    } catch (err) {
      console.warn('Failed to create share package:', err);
    }
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneFlipbookHtml(book);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'flipbook'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine displayed spread numbers
  const isCover = activePageIndex === 0;
  const isBackCover = activePageIndex >= totalPages - 1;
  const displayPageStr = isCover
    ? 'Cover'
    : isBackCover
    ? `Page ${totalPages} (Back)`
    : `Pages ${activePageIndex}–${Math.min(totalPages, activePageIndex + 1)} of ${totalPages}`;

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 1) 100%)',
      }}
    >
      {/* 1. TOP READER BAR */}
      <header className="h-14 shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between z-30 shadow-md">
        {/* Left: Book Meta & Back button */}
        <div className="flex items-center gap-3 min-w-0">
          {onExitReader && (
            <button
              onClick={onExitReader}
              title="Back to Studio / Bookshelf"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-100 truncate tracking-tight">
              {book.title || 'Untitled Publication'}
            </h1>
            <p className="text-[11px] text-slate-400 truncate hidden md:block">
              {book.subtitle || `${book.pages.length} Pages • 3D Digital Edition`}
            </p>
          </div>
        </div>

        {/* Center: Page Counter Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 shadow-inner">
          <span>{displayPageStr}</span>
        </div>

        {/* Right: Quick Actions & Viral CTA */}
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleOpenShare}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-700/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Download Standalone HTML */}
          <button
            onClick={handleDownloadHtml}
            title="Download Offline HTML"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer hidden md:flex"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Open in Editor / Create Your Own Flipbook CTA */}
          {onOpenStudio ? (
            <button
              onClick={onOpenStudio}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Edit in Studio</span>
            </button>
          ) : (
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Create 3D Flipbook</span>
            </a>
          )}
        </div>
      </header>

      {/* 2. MAIN 3D FLIPBOOK STAGE (with Zoom support) */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Previous page arrow button overlay */}
        <button
          onClick={handlePrevPage}
          disabled={activePageIndex <= 0}
          title="Previous Page (Left Arrow)"
          className={`absolute left-2 sm:left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer ${
            activePageIndex <= 0 ? 'opacity-20 pointer-events-none' : 'opacity-90 hover:opacity-100'
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-emerald-400" />
        </button>

        {/* 3D Flipbook Viewer */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          <FlipbookPreview
            book={book}
            activePageIndex={activePageIndex}
            onPageSelect={setActivePageIndex}
            isMobilePreviewMode={false}
          />
        </div>

        {/* Next page arrow button overlay */}
        <button
          onClick={handleNextPage}
          disabled={activePageIndex >= totalPages - 1}
          title="Next Page (Right Arrow)"
          className={`absolute right-2 sm:right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer ${
            activePageIndex >= totalPages - 1
              ? 'opacity-20 pointer-events-none'
              : 'opacity-90 hover:opacity-100'
          }`}
        >
          <ChevronRight className="w-6 h-6 text-emerald-400" />
        </button>
      </main>

      {/* 3. THUMBNAIL FILMSTRIP DRAWER (Collapsible) */}
      {showThumbnails && (
        <div className="h-28 shrink-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 flex items-center gap-3 overflow-x-auto z-30 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5 h-full">
            {book.pages.map((p, idx) => {
              const isSelected =
                idx === activePageIndex ||
                (activePageIndex > 0 && idx === activePageIndex + 1 && idx % 2 === 0);

              return (
                <button
                  key={p.id || idx}
                  onClick={() => handleJumpToPage(idx)}
                  className={`h-full aspect-3/4 rounded-lg overflow-hidden border-2 transition-all shrink-0 relative bg-white flex items-center justify-center cursor-pointer shadow-md ${
                    isSelected
                      ? 'border-emerald-500 scale-105 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                      : 'border-slate-700 hover:border-slate-500 opacity-75 hover:opacity-100'
                  }`}
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title || `Page ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-[10px] font-bold text-slate-800 text-center p-1 leading-tight">
                      {p.template === 'cover-front'
                        ? 'Cover'
                        : p.template === 'cover-back'
                        ? 'Back'
                        : `P.${idx + 1}`}
                    </div>
                  )}

                  <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1 rounded">
                    {idx === 0 ? 'C' : idx === totalPages - 1 ? 'B' : idx}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. BOTTOM FLOATING PRO READER TOOLBAR */}
      <footer className="h-16 shrink-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-3 sm:px-6 flex items-center justify-between z-30 shadow-2xl">
        {/* Left: Page Scrubber Slider (Crucial for 250-500 pages!) */}
        <div className="flex items-center gap-2.5 flex-1 max-w-xs sm:max-w-md mr-4">
          <button
            onClick={() => handleJumpToPage(0)}
            title="First Page"
            className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            1
          </button>

          <input
            type="range"
            min={0}
            max={totalPages - 1}
            value={sliderVal}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setSliderVal(val);
              handleJumpToPage(val);
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <button
            onClick={() => handleJumpToPage(totalPages - 1)}
            title="Last Page"
            className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            {totalPages}
          </button>
        </div>

        {/* Center/Right Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Page Turn Sound' : 'Enable Page Turn Sound'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto-Play Slideshow */}
          <button
            onClick={() => setIsPlayingAuto(!isPlayingAuto)}
            title={isPlayingAuto ? 'Pause Auto-Play' : 'Start Auto-Play (5s interval)'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isPlayingAuto
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isPlayingAuto ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Thumbnails Drawer Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            title="Show Page Thumbnails"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showThumbnails
                ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Zoom In & Out */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
              disabled={zoomLevel <= 0.7}
              title="Zoom Out"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom (100%)"
              className="px-1.5 text-[11px] font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, +(z + 0.15).toFixed(2)))}
              disabled={zoomLevel >= 2.0}
              title="Zoom In"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </footer>

      {/* 5. INSTANT SHARE & QR POPUP MODAL */}
      {showShareModal && shareData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Share 3D Flipbook</h3>
                  <p className="text-[11px] text-slate-400">Anyone with this link can read online</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
              {/* Direct Share Link Bar */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Public Reader Link</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={shareData.shareUrl}
                    className="flex-1 bg-transparent px-2.5 text-xs text-emerald-400 font-mono focus:outline-none select-all"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareData.shareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code & 1-Click Social Sharing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* QR Code Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                  <img
                    src={shareData.qrCodeDataUrl}
                    alt="Scan QR Code"
                    className="w-32 h-32 rounded-lg bg-white p-1 border border-slate-700 shadow-md"
                  />
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-emerald-400" />
                    <span>Scan on Mobile</span>
                  </div>
                </div>

                {/* 1-Click Social Channels */}
                <div className="flex flex-col justify-between space-y-2">
                  <a
                    href={shareData.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <span>💬 Share via WhatsApp</span>
                  </a>

                  <a
                    href={shareData.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>✈️ Telegram</span>
                  </a>

                  <a
                    href={shareData.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>✖️ Post to X (Twitter)</span>
                  </a>

                  <a
                    href={shareData.emailUrl}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>✉️ Send by Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
