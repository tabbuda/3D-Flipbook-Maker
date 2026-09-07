import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { BookProject, StageBackdrop } from '../types/flipbook';
import { COVER_THEMES } from '../constants/templates';
import { PageRenderer } from './PageRenderer';
import { playPageTurnSound } from '../utils/audio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Palette,
  Eye,
} from 'lucide-react';

interface FlipbookPreviewProps {
  book: BookProject;
  activePageIndex: number;
  onPageSelect?: (index: number) => void;
  isMobilePreviewMode?: boolean;
}

export const BASE_A4_WIDTH = 480;
export const BASE_A4_HEIGHT = 679; // Math.round(480 * Math.SQRT2)

export const FlipbookPreview: React.FC<FlipbookPreviewProps> = ({
  book,
  activePageIndex,
  onPageSelect,
  isMobilePreviewMode = false,
}) => {
  const theme = COVER_THEMES[book.themeId] || COVER_THEMES['emerald-gold'];
  const [currentLeafIndex, setCurrentLeafIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(book.soundEnabled !== false);
  const [flippingLeafIndex, setFlippingLeafIndex] = useState<number | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pageScale, setPageScale] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(5); // in seconds
  const [stageBackdrop, setStageBackdrop] = useState<StageBackdrop>('studio');
  const [showBackdropPicker, setShowBackdropPicker] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bookStageRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFlipTimeRef = useRef<number>(0);
  const lastTouchTimeRef = useRef<number>(0);

  // Dynamic leaf pairing:
  // On desktop: ensures Back Cover is always on the back face of the last leaf
  // On mobile: uses original pages directly for 1-to-1 single-leaf navigation
  const pages = useMemo(() => {
    const list = [...(book.pages || [])];
    if (!isMobileLayout) {
      const lastPage = list[list.length - 1];
      if (list.length > 1 && list.length % 2 !== 0 && lastPage?.template === 'cover-back') {
        list.splice(list.length - 1, 0, {
          id: 'p-inside-back-blank',
          template: 'blank' as any,
          title: '',
          subtitle: '',
          headerTag: '',
          footerNote: '',
        });
      }
    }
    return list;
  }, [book.pages, isMobileLayout]);

  const leafPairs = useMemo(() => {
    if (isMobileLayout) {
      if (pages.length <= 1) {
        return [{ front: 0, back: -1, isMobileSingleLeaf: true }];
      }
      const pairs: { front: number; back: number; isMobileSingleLeaf?: boolean }[] = [];
      const numLeaves = pages.length - 1;
      for (let i = 0; i < numLeaves; i++) {
        if (i === numLeaves - 1) {
          pairs.push({
            front: i,
            back: pages.length - 1,
            isMobileSingleLeaf: false,
          });
        } else {
          pairs.push({
            front: i,
            back: -1,
            isMobileSingleLeaf: true,
          });
        }
      }
      return pairs;
    }

    const pairs: { front: number; back: number; isMobileSingleLeaf?: boolean }[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      pairs.push({
        front: i,
        back: i + 1 < pages.length ? i + 1 : -1,
        isMobileSingleLeaf: false,
      });
    }
    return pairs;
  }, [pages, isMobileLayout]);

  const totalLeaves = isMobileLayout ? Math.max(0, pages.length - 1) : leafPairs.length;

  // Sound handler
  const triggerAudio = useCallback(() => {
    if (soundEnabled) {
      playPageTurnSound();
    }
  }, [soundEnabled]);

  const notifyPageSelectForLeaf = useCallback(
    (leafIdx: number) => {
      if (!onPageSelect) return;
      const actualTotalPages = book.pages?.length || pages.length;
      if (isMobileLayout) {
        if (leafIdx <= 0) {
          onPageSelect(0);
        } else if (leafIdx >= totalLeaves) {
          onPageSelect(actualTotalPages - 1);
        } else {
          onPageSelect(Math.min(actualTotalPages - 1, leafIdx));
        }
        return;
      }
      if (leafIdx <= 0) {
        onPageSelect(0);
      } else if (leafIdx >= totalLeaves) {
        onPageSelect(actualTotalPages - 1);
      } else {
        const leftPage = (leafIdx - 1) * 2 + 1;
        onPageSelect(Math.min(actualTotalPages - 1, leftPage));
      }
    },
    [onPageSelect, totalLeaves, book.pages, pages.length, isMobileLayout]
  );

  // Turn forward action
  const flipNext = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipTimeRef.current < 450) {
      return;
    }
    if (currentLeafIndex >= totalLeaves) {
      if (isAutoPlaying) {
        // Loop back to beginning in slideshow mode
        lastFlipTimeRef.current = now;
        setCurrentLeafIndex(0);
        notifyPageSelectForLeaf(0);
      }
      return;
    }
    lastFlipTimeRef.current = now;
    setFlippingLeafIndex(currentLeafIndex);
    triggerAudio();
    const nextLeaf = currentLeafIndex + 1;
    setCurrentLeafIndex(nextLeaf);
    notifyPageSelectForLeaf(nextLeaf);

    setTimeout(() => {
      setFlippingLeafIndex(null);
    }, 650);
  }, [currentLeafIndex, totalLeaves, triggerAudio, notifyPageSelectForLeaf, isAutoPlaying]);

  // Turn backward action
  const flipPrev = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipTimeRef.current < 450) {
      return;
    }
    if (currentLeafIndex <= 0) return;
    lastFlipTimeRef.current = now;
    const target = currentLeafIndex - 1;
    setFlippingLeafIndex(target);
    triggerAudio();
    setCurrentLeafIndex(target);
    notifyPageSelectForLeaf(target);

    setTimeout(() => {
      setFlippingLeafIndex(null);
    }, 650);
  }, [currentLeafIndex, triggerAudio, notifyPageSelectForLeaf]);

  // Direct jump to a specific leaf
  const goToLeaf = useCallback(
    (targetLeaf: number) => {
      const clamped = Math.max(0, Math.min(totalLeaves, targetLeaf));
      if (clamped !== currentLeafIndex) {
        lastFlipTimeRef.current = Date.now();
        triggerAudio();
        setCurrentLeafIndex(clamped);
        notifyPageSelectForLeaf(clamped);
      }
    },
    [currentLeafIndex, totalLeaves, triggerAudio, notifyPageSelectForLeaf]
  );

  // Auto-play slideshow effect
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      flipNext();
    }, autoPlayInterval * 1000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, autoPlayInterval, flipNext]);

  // Auto-sync when user selects or edits a page in the sidebar
  useEffect(() => {
    if (activePageIndex >= 0) {
      const actualTotalPages = book.pages?.length || pages.length;
      let targetLeaf = 0;
      if (isMobileLayout) {
        targetLeaf = Math.min(totalLeaves, activePageIndex);
      } else {
        if (activePageIndex === 0) {
          targetLeaf = 0;
        } else if (activePageIndex >= actualTotalPages - 1) {
          targetLeaf = totalLeaves;
        } else {
          targetLeaf = Math.ceil(activePageIndex / 2);
        }
      }
      targetLeaf = Math.max(0, Math.min(totalLeaves, targetLeaf));
      if (targetLeaf !== currentLeafIndex) {
        setCurrentLeafIndex(targetLeaf);
      }
    }
  }, [activePageIndex, book.pages, pages.length, totalLeaves, isMobileLayout]);

  // Dynamic A4 Standard Sizing (1 : Math.SQRT2)
  const updateBookDimensions = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const vw = wrapper.clientWidth || window.innerWidth || 800;
    const vh = wrapper.clientHeight || window.innerHeight || 600;

    const isMobile = isMobilePreviewMode || vw < 768 || (vw < 900 && vh > vw);
    setIsMobileLayout(isMobile);
    const A4_RATIO = Math.SQRT2;

    let pageW: number, pageH: number;
    if (isMobile) {
      const maxAvailW = Math.min(vw - 20, 600);
      const maxAvailH = vh - 64;

      if (maxAvailW * A4_RATIO <= maxAvailH) {
        pageW = Math.max(240, maxAvailW);
        pageH = Math.round(pageW * A4_RATIO);
      } else {
        pageH = Math.max(340, maxAvailH);
        pageW = Math.round(pageH / A4_RATIO);
      }
    } else {
      const maxBookTotalW = Math.min(vw - 36, 1800);
      const maxAvailHDesktop = vh - 60;

      if ((maxBookTotalW / 2) * A4_RATIO <= maxAvailHDesktop) {
        pageW = Math.max(260, Math.floor(maxBookTotalW / 2));
        pageH = Math.round(pageW * A4_RATIO);
      } else {
        pageH = Math.max(360, Math.floor(maxAvailHDesktop));
        pageW = Math.round(pageH / A4_RATIO);
      }
    }

    // Apply zoom
    pageW = pageW * zoomLevel;
    pageH = pageH * zoomLevel;

    const scale = pageW / BASE_A4_WIDTH;
    setPageScale(scale);

    wrapper.style.setProperty('--page-w', `${Math.round(pageW)}px`);
    wrapper.style.setProperty('--page-h', `${Math.round(pageH)}px`);
    wrapper.style.setProperty('--page-scale', scale.toFixed(4));
    wrapper.style.setProperty('--a4-scale', scale.toFixed(4));
  }, [isMobilePreviewMode, zoomLevel]);

  useEffect(() => {
    updateBookDimensions();
    const observer = new ResizeObserver(updateBookDimensions);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    window.addEventListener('resize', updateBookDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBookDimensions);
    };
  }, [updateBookDimensions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = (e.target || document.activeElement) as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          tagName === 'BUTTON' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('[contenteditable="true"]') ||
          target.closest('aside') ||
          target.closest('[role="dialog"]') ||
          target.closest('.block-editor-card') ||
          target.closest('.studio-sidebar')
        ) {
          return;
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipPrev();
      } else if (e.key === 'Home') {
        goToLeaf(0);
      } else if (e.key === 'End') {
        goToLeaf(totalLeaves);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev, goToLeaf, totalLeaves]);

  // Natural Wheel / Trackpad Page Flip (Replaces all vertical scrolling with real physical page turns)
  const lastWheelTimeRef = useRef<number>(0);
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      // Ignore if user is inside an editor modal or sidebar dialog
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('aside') ||
          target.closest('.studio-sidebar') ||
          target.closest('[role="dialog"]') ||
          target.closest('.modal-content') ||
          target.closest('.block-editor-card'))
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelTimeRef.current < 380) {
        return;
      }

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) > 18) {
        lastWheelTimeRef.current = now;
        if (delta > 0) {
          flipNext();
        } else {
          flipPrev();
        }
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
    };
  }, [flipNext, flipPrev]);

  // Touch handlers
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    lastTouchTimeRef.current = Date.now();
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    lastTouchTimeRef.current = Date.now();
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartRef.current.x;
    const diffY = Math.abs(touchEndY - touchStartRef.current.y);
    const duration = Date.now() - touchStartRef.current.time;

    // Swipe navigation
    if (Math.abs(diffX) > 40 && diffY < 100) {
      if (diffX < 0) {
        flipNext();
      } else {
        flipPrev();
      }
      return;
    }

    // Tap navigation
    if (Math.abs(diffX) < 15 && diffY < 15 && duration < 400) {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('.mockup-toggle-pill') ||
        target.closest('.toc-item') ||
        target.closest('.cover-open-action') ||
        target.closest('.top-floating-controls') ||
        target.closest('.bottom-stage-toolbar') ||
        target.closest('.corner-nav-btn')
      ) {
        return;
      }

      if (bookStageRef.current) {
        const rect = bookStageRef.current.getBoundingClientRect();
        const tapX = touchEndX - rect.left;
        const stageMidX = rect.width / 2;

        if (tapX > stageMidX) {
          if (currentLeafIndex >= totalLeaves) {
            flipPrev();
          } else {
            flipNext();
          }
        } else {
          flipPrev();
        }
      }
    }
  };

  const handleStageClick = (e: React.MouseEvent) => {
    // If a touch event just finished within 650ms, ignore this synthetic click
    if (Date.now() - lastTouchTimeRef.current < 650) {
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('.mockup-toggle-pill') ||
      target.closest('.toc-item') ||
      target.closest('.cover-open-action') ||
      target.closest('.top-floating-controls') ||
      target.closest('.bottom-stage-toolbar') ||
      target.closest('.corner-nav-btn')
    ) {
      return;
    }

    if (bookStageRef.current) {
      const rect = bookStageRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const stageMidX = rect.width / 2;

      if (clickX > stageMidX) {
        if (currentLeafIndex >= totalLeaves) {
          flipPrev();
        } else {
          flipNext();
        }
      } else {
        flipPrev();
      }
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (!document.fullscreenElement) {
      wrapper
        .requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isMobile =
    isMobilePreviewMode ||
    (typeof window !== 'undefined' &&
      (window.innerWidth < 768 || (window.innerWidth < 900 && window.innerHeight > window.innerWidth)));

  // Backdrop gradient styles
  const getBackdropClass = () => {
    switch (stageBackdrop) {
      case 'dark':
        return 'bg-gradient-to-b from-slate-950 via-neutral-900 to-black';
      case 'wood':
        return 'bg-gradient-to-b from-[#2d1b14] via-[#1f120c] to-[#120a06]';
      case 'marble':
        return 'bg-gradient-to-b from-[#f8f9fa] via-[#e9ecef] to-[#dee2e6]';
      case 'linen':
        return 'bg-gradient-to-b from-[#2b303a] via-[#1e2229] to-[#12151a]';
      case 'studio':
      default:
        return 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300';
    }
  };

  return (
    <div
      id="flipbook-wrapper"
      ref={wrapperRef}
      className={`${isFullscreen ? 'is-pseudo-fullscreen' : ''} ${
        isMobile ? 'is-mobile' : ''
      } ${getBackdropClass()}`}
    >
      {/* Top Floating Studio Toolbar */}
      <div className="top-floating-controls" id="top-controls">
        {/* Slideshow Presentation Mode Button */}
        <button
          className={`float-icon-btn ${isAutoPlaying ? 'bg-emerald-500 text-white!' : ''}`}
          title={isAutoPlaying ? 'Pause Presentation Slideshow' : 'Start Auto-Play Presentation'}
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 text-emerald-600" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center bg-white/70 backdrop-blur-md rounded-full border border-slate-200/80 p-0.5 shadow-sm">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, +(z - 0.1).toFixed(1)))}
            className="p-2 text-slate-700 hover:text-emerald-700 hover:bg-white rounded-full transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold px-1.5 text-slate-700">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.3, +(z + 0.1).toFixed(1)))}
            className="p-2 text-slate-700 hover:text-emerald-700 hover:bg-white rounded-full transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sound FX Toggle */}
        <button
          className="float-icon-btn"
          id="btn-sound"
          title={soundEnabled ? 'Mute Page Turn Sound' : 'Enable Page Turn Sound'}
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{ opacity: soundEnabled ? 1 : 0.4 }}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          className="float-icon-btn"
          id="btn-fullscreen"
          title="Toggle Fullscreen"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Auto-Play Active Badge */}
      {isAutoPlaying && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-emerald-500/50 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Presentation Mode ({autoPlayInterval}s interval)</span>
        </div>
      )}

      {/* Center 3D Book Stage */}
      <div
        className="book-stage"
        id="book-stage"
        ref={bookStageRef}
        onClick={handleStageClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flipbook-container ${isMobileLayout ? 'is-mobile' : ''} ${
            currentLeafIndex === 0
              ? 'is-cover-closed'
              : currentLeafIndex >= totalLeaves
              ? 'is-back-closed'
              : ''
          }`}
          id="book-container"
        >
          {/* Subtle physical book thickness block edges */}
          {!isMobileLayout && currentLeafIndex > 0 && (
            <div
              className="absolute top-[2px] bottom-[2px] left-[-3px] w-[3px] rounded-l-[4px] pointer-events-none z-0"
              style={{
                background: 'linear-gradient(to left, rgba(0,0,0,0.06), rgba(255,255,255,0.9))',
                borderLeft: '1px solid rgba(0,0,0,0.05)',
              }}
            />
          )}
          {!isMobileLayout && currentLeafIndex < totalLeaves && (
            <div
              className="absolute top-[2px] bottom-[2px] right-[-3px] w-[3px] rounded-r-[4px] pointer-events-none z-0"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.06), rgba(255,255,255,0.9))',
                borderRight: '1px solid rgba(0,0,0,0.05)',
              }}
            />
          )}

          <div className="book-spine-shadow" />

          {/* 3D Sheets */}
          {leafPairs.map((pair, leafIdx) => {
            const isFlipped = leafIdx < currentLeafIndex;
            const isFlipping = flippingLeafIndex === leafIdx;
            const zIndex = isFlipped ? leafIdx + 1 : totalLeaves - leafIdx + 10;

            // DOM Virtualization: Only render expensive canvas React trees for visible & adjacent leaves
            const dist = Math.abs(leafIdx - currentLeafIndex);
            const isNearActive =
              dist <= 2 ||
              isFlipping ||
              leafIdx === 0 ||
              leafIdx === totalLeaves - 1 ||
              leafIdx === currentLeafIndex - 1 ||
              leafIdx === currentLeafIndex;

            const frontPage = pages[pair.front];
            const backPage = pair.back !== -1 ? pages[pair.back] : undefined;

            const isFrontCoverFront = frontPage?.template === 'cover-front';
            const isBackCoverFront = frontPage?.template === 'cover-back';
            const isFrontFaceCover = isFrontCoverFront || isBackCoverFront;

            const isFrontCoverBack = backPage?.template === 'cover-front';
            const isBackCoverBack = backPage?.template === 'cover-back';
            const isBackFaceCover = isFrontCoverBack || isBackCoverBack;

            return (
              <div
                key={leafIdx}
                className={`book-leaf ${isFlipped ? 'flipped' : ''} ${
                  isFlipping ? 'is-flipping' : ''
                }`}
                style={{ zIndex }}
                data-leaf-index={leafIdx}
              >
                {/* Front Face (Odd Page or Single Leaf Page) */}
                <div
                  className={`leaf-face face-front ${
                    isFrontCoverFront
                      ? 'cover-front is-cover'
                      : isBackCoverFront
                      ? 'cover-back-outer is-cover'
                      : ''
                  }`}
                  style={
                    isFrontFaceCover
                      ? {
                          background: theme.bgGradient,
                          color: theme.textColor || '#ffffff',
                          border: `2px solid ${theme.borderColor || 'rgba(201,168,78,0.4)'}`,
                        }
                      : undefined
                  }
                >
                  {isNearActive ? (
                    <div
                      className="a4-page-canvas"
                      style={{
                        width: `${BASE_A4_WIDTH}px`,
                        height: `${BASE_A4_HEIGHT}px`,
                        transform: `scale(${pageScale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <PageRenderer
                        page={frontPage}
                        theme={theme}
                        bookTitle={book.title}
                        bookAuthor={book.author}
                        pageNumber={pair.front + 1}
                        coverImageUrl={book.coverImageUrl}
                        onNavigateToPage={(num) => {
                          const pageIdx = num - 1;
                          const targetLeaf = isMobileLayout
                            ? pageIdx
                            : pageIdx <= 0
                            ? 0
                            : pageIdx >= pages.length - 1
                            ? totalLeaves
                            : Math.ceil(pageIdx / 2);
                          goToLeaf(targetLeaf);
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: theme.pageBg || '#ffffff' }}
                    />
                  )}
                  <div className="leaf-lighting-overlay" />
                </div>

                {/* Back Face (Even Page on desktop OR clean Blank Parchment on mobile) */}
                <div
                  className={`leaf-face face-back ${
                    isBackFaceCover && !pair.isMobileSingleLeaf
                      ? isBackCoverBack
                        ? 'cover-back-outer is-cover'
                        : 'cover-front is-cover'
                      : ''
                  }`}
                  style={
                    isBackFaceCover && !pair.isMobileSingleLeaf
                      ? {
                          background: theme.bgGradient,
                          color: theme.textColor || '#ffffff',
                          border: `2px solid ${theme.borderColor || 'rgba(201,168,78,0.4)'}`,
                        }
                      : undefined
                  }
                >
                  {isNearActive ? (
                    <div
                      className="a4-page-canvas"
                      style={{
                        width: `${BASE_A4_WIDTH}px`,
                        height: `${BASE_A4_HEIGHT}px`,
                        transform: `scale(${pageScale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {pair.isMobileSingleLeaf || pair.back === -1 ? (
                        <div
                          className="page-content-wrapper flex flex-col justify-between items-center text-center p-8 select-none h-full"
                          style={{ backgroundColor: theme.pageBg, color: theme.pageTextColor }}
                        >
                          <div className="text-[11px] font-mono tracking-[0.2em] opacity-40 uppercase">
                            {book.title}
                          </div>
                          <div className="my-auto opacity-20 flex flex-col items-center">
                            <Sparkles className="w-12 h-12" style={{ color: theme.accentColor }} />
                          </div>
                          <div className="text-[11px] font-mono tracking-[0.2em] opacity-40 uppercase">
                            {book.author}
                          </div>
                        </div>
                      ) : (
                        <PageRenderer
                          page={backPage}
                          theme={theme}
                          bookTitle={book.title}
                          bookAuthor={book.author}
                          pageNumber={pair.back + 1}
                          coverImageUrl={book.coverImageUrl}
                          onNavigateToPage={(num) => {
                            const pageIdx = num - 1;
                            const targetLeaf = isMobileLayout
                              ? pageIdx
                              : pageIdx <= 0
                              ? 0
                              : pageIdx >= pages.length - 1
                              ? totalLeaves
                              : Math.ceil(pageIdx / 2);
                            goToLeaf(targetLeaf);
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: theme.pageBg || '#ffffff' }}
                    />
                  )}
                  <div className="leaf-lighting-overlay" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation Curved Arrows */}
      <button
        className="corner-nav-btn btn-prev-corner"
        id="btn-prev-corner"
        title="Previous Page (Left Arrow)"
        onClick={flipPrev}
        disabled={currentLeafIndex <= 0}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      </button>

      <button
        className="corner-nav-btn btn-next-corner"
        id="btn-next-corner"
        title="Next Page (Right Arrow)"
        onClick={flipNext}
        disabled={currentLeafIndex >= totalLeaves}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="15 14 20 9 15 4" />
          <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
        </svg>
      </button>
    </div>
  );
};
