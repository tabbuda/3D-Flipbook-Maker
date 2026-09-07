import React, { useState, useEffect } from 'react';
import { BookProject, AppNavView } from '../types/flipbook';
import {
  BookOpen,
  Smartphone,
  Monitor,
  LayoutGrid,
  Layers,
  ArrowDownToLine,
  Home,
  BookMarked,
  Download,
  HardDrive,
  FileText,
  Share2,
  Eye,
  Crown,
  Sparkles,
} from 'lucide-react';
import { exportBookAsFlipbookFile } from '../utils/bookStorage';
import { getLicenseInfo, onLicenseChange } from '../utils/licenseManager';

interface HeaderProps {
  book: BookProject;
  activeNavView: AppNavView;
  setActiveNavView: (view: AppNavView) => void;
  isMobilePreviewMode: boolean;
  setIsMobilePreviewMode: (val: boolean) => void;
  mobileViewTab: 'editor' | 'preview';
  setMobileViewTab: (tab: 'editor' | 'preview') => void;
  onOpenShareModal?: () => void;
  onExportHtml?: () => void;
  onOpenInstallModal?: () => void;
  onOpenPdfModal?: () => void;
  onOpenLicenseModal?: () => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
  libraryCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  book,
  activeNavView,
  setActiveNavView,
  isMobilePreviewMode,
  setIsMobilePreviewMode,
  mobileViewTab,
  setMobileViewTab,
  onOpenShareModal,
  onExportHtml,
  onOpenInstallModal,
  onOpenPdfModal,
  onOpenLicenseModal,
  isInstallable,
  isInstalled,
  libraryCount = 0,
}) => {
  const [license, setLicense] = useState(() => getLicenseInfo());

  useEffect(() => {
    return onLicenseChange((newInfo) => {
      setLicense(newInfo);
    });
  }, []);

  const isPro = license.tier === 'pro';
  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md px-2 sm:px-4 lg:px-5 flex items-center justify-between shrink-0 z-40 select-none text-slate-800 gap-1.5 sm:gap-3 shadow-xs">
      {/* Left: Brand & Main Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
        <button
          onClick={() => setActiveNavView('home')}
          className="flex items-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity text-left cursor-pointer group shrink-0"
          title="Go to Homepage"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="hidden xs:block">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
                FlipApp
              </span>
              <span className="px-1 py-0.2 rounded text-[8.5px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                3D
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden md:block truncate max-w-[120px] lg:max-w-[180px]">
              {book.title}
            </p>
          </div>
        </button>

        {/* View Switcher Tabs (Shown on non-studio on all screens, or md+ on studio) */}
        <div className={`items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0 ${activeNavView === 'studio' ? 'hidden md:flex' : 'flex'}`}>
          <button
            onClick={() => setActiveNavView('home')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeNavView === 'home'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setActiveNavView('templates')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeNavView === 'templates'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          <button
            onClick={() => setActiveNavView('studio')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeNavView === 'studio'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio</span>
          </button>

          {/* My Books Tab */}
          <button
            onClick={() => setActiveNavView('bookshelf')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeNavView === 'bookshelf'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="My Bookshelf (Saved drafts on this device)"
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">My Books</span>
            {libraryCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {libraryCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Center: Mobile Switcher [Edit vs 3D Book] or Desktop Dual/Single Switcher */}
      {activeNavView === 'studio' && (
        <div className="flex items-center justify-center">
          {/* Desktop Dual Spread vs Single Leaf */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsMobilePreviewMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isMobilePreviewMode
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Desktop Dual-Page Spread"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dual Spread</span>
            </button>
            <button
              onClick={() => setIsMobilePreviewMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isMobilePreviewMode
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mobile Single-Leaf View"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Single Leaf</span>
            </button>
          </div>

          {/* Mobile/Tablet Clean Segmented Switcher [Edit vs 3D Book] */}
          <div className="flex lg:hidden items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-xs shrink-0">
            <button
              onClick={() => setMobileViewTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileViewTab === 'editor'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileViewTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileViewTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D Book
            </button>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Live Reader Mode View */}
        {activeNavView === 'studio' && (
          <button
            onClick={() => setActiveNavView('reader')}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Open full-screen reader view"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Reader</span>
          </button>
        )}

        {/* Quick .flipbook Backup Button when in Studio */}
        {activeNavView === 'studio' && (
          <button
            onClick={() => exportBookAsFlipbookFile(book)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Download .flipbook project backup to your computer or phone"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Save Backup</span>
          </button>
        )}

        {/* PDF to 3D Converter Button */}
        {onOpenPdfModal && (
          <button
            onClick={onOpenPdfModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
            title="Convert any PDF into interactive 3D Flipbook"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Import PDF</span>
            <span className="md:hidden text-[11px]">PDF</span>
          </button>
        )}

        {/* Pro Lifetime / Redeem Code Button */}
        {onOpenLicenseModal && (
          <button
            onClick={onOpenLicenseModal}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer ${
              isPro
                ? 'bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-300 text-emerald-900 hover:bg-emerald-100/60'
                : 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-amber-600/20 hover:from-amber-600 hover:to-emerald-700'
            }`}
            title={isPro ? 'Pro Lifetime Active - View License' : 'Upgrade to Pro / Redeem AppSumo Code'}
          >
            {isPro ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">PRO Lifetime</span>
                <span className="sm:hidden">PRO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="hidden sm:inline">Get PRO</span>
                <span className="sm:hidden">PRO</span>
              </>
            )}
          </button>
        )}

        {/* Share & Publish Button */}
        {onOpenShareModal && (
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition-all hover:scale-[1.02] cursor-pointer"
            title="Get Shareable Online Link & QR Code"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        )}
      </div>
    </header>
  );
};
