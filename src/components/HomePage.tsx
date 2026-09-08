import React, { useState } from 'react';
import { BookProject, TemplatePreset } from '../types/flipbook';
import { FLIPBOOK_TEMPLATE_PRESETS } from '../constants/presetTemplates';
import { INITIAL_BOOK_PROJECT } from '../constants/templates';
import { FlipbookPreview } from './FlipbookPreview';
import { TemplateCardVisual } from './TemplateCardVisual';
import {
  Sparkles,
  Zap,
  LockOpen,
  CheckCircle2,
  Download,
  BookOpen,
  ArrowRight,
  MousePointerClick,
  Smartphone,
  Share2,
  Palette,
  Volume2,
  Code2,
  FileCode,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Layers,
  Award,
  Eye,
  Rocket,
  Check,
  Star,
  Globe,
  Flame,
  Layout,
  Sliders,
  Printer,
  UploadCloud,
  FileCheck2,
  Tv,
  CheckCheck,
  Monitor,
  FolderPlus,
  RefreshCw,
  Users,
  Compass,
  TrendingUp,
  HeartHandshake,
  FileText,
  Crown,
  ExternalLink,
  Key,
} from 'lucide-react';

interface HomePageProps {
  onStartCreating: () => void;
  onOpenTemplates: () => void;
  onOpenBookshelf?: () => void;
  onSelectTemplate: (project: BookProject) => void;
  onPreviewTemplate: (template: TemplatePreset) => void;
  onOpenUploadModal?: () => void;
  onOpenInstallModal?: () => void;
  onOpenPdfModal?: () => void;
  onOpenLicenseModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartCreating,
  onOpenTemplates,
  onOpenBookshelf,
  onSelectTemplate,
  onPreviewTemplate,
  onOpenUploadModal,
  onOpenInstallModal,
  onOpenPdfModal,
  onOpenLicenseModal,
}) => {
  // Live Demo Book Selector on Homepage
  const demoPresets = [
    {
      id: 'luxury-mag',
      label: '👑 Luxury Magazine',
      project: FLIPBOOK_TEMPLATE_PRESETS[0]?.project || INITIAL_BOOK_PROJECT,
    },
    {
      id: 'gourmet-menu',
      label: '🍷 Gourmet Bistro Menu',
      project: FLIPBOOK_TEMPLATE_PRESETS[2]?.project || INITIAL_BOOK_PROJECT,
    },
    {
      id: 'tech-pitch',
      label: '🚀 Tech Pitch Deck',
      project: FLIPBOOK_TEMPLATE_PRESETS[4]?.project || INITIAL_BOOK_PROJECT,
    },
    {
      id: 'kids-story',
      label: '✨ Kids Storybook',
      project: FLIPBOOK_TEMPLATE_PRESETS[3]?.project || INITIAL_BOOK_PROJECT,
    },
    {
      id: 'newspaper',
      label: '📰 Vintage Broadsheet',
      project: FLIPBOOK_TEMPLATE_PRESETS[7]?.project || INITIAL_BOOK_PROJECT,
    },
  ];

  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeDemoBook = demoPresets[selectedDemoIndex]?.project || INITIAL_BOOK_PROJECT;

  // Filter templates for the home gallery showcase
  const categoryFilters = [
    { id: 'all', label: 'All Templates' },
    { id: 'magazine', label: 'Magazines' },
    { id: 'menu', label: 'Restaurant & Menus' },
    { id: 'storybook', label: 'Storybooks & Comics' },
    { id: 'business', label: 'Business & Pitch' },
    { id: 'portfolio', label: 'Portfolios' },
  ];

  const filteredTemplates =
    activeCategoryFilter === 'all'
      ? FLIPBOOK_TEMPLATE_PRESETS.slice(0, 6)
      : FLIPBOOK_TEMPLATE_PRESETS.filter((t) => {
          if (activeCategoryFilter === 'magazine') return t.category === 'magazine' || t.category === 'lookbook';
          if (activeCategoryFilter === 'menu') return t.category === 'menu' || t.category === 'restaurant' || t.category === 'recipe';
          if (activeCategoryFilter === 'storybook') return t.category === 'storybook' || t.category === 'comic';
          if (activeCategoryFilter === 'business') return t.category === 'business' || t.category === 'pitch-deck' || t.category === 'handbook';
          if (activeCategoryFilter === 'portfolio') return t.category === 'portfolio' || t.category === 'photo-album';
          return true;
        }).slice(0, 6);

  const faqs = [
    {
      q: 'Can I truly create and export publications without creating an account or signing in?',
      a: 'Yes, 100%. Our platform operates on a strict Zero-Cloud, Client-Side Privacy architecture. You do not need to register an account, verify an email, or enter credentials. Open the studio directly in your browser, craft your publication, and export your production files instantly.',
    },
    {
      q: 'Does this require any coding, technical setup, or command-line knowledge?',
      a: 'Not at all. The studio features a complete no-code visual drag-and-drop workflow. Easily customize typography, images, headers, multi-column articles, price tables, and luxury cover textures in real time with intuitive visual controls.',
    },
    {
      q: 'How does the Standalone Offline HTML export work?',
      a: 'Clicking "Download Standalone HTML" compiles your entire publication into a single, self-contained `.html` file. All 3D page-flip physics, shaders, embedded assets, and synthesized paper acoustics are bundled directly within the file. It opens instantly in any browser—even without an active internet connection—and can be embedded via iframe on any CMS (WordPress, Webflow, Squarespace, Shopify).',
    },
    {
      q: 'Are my confidential documents, PDFs, and assets kept private?',
      a: 'Absolutely. All processing—including PDF page rendering and image conversion—runs entirely on your local machine using client-side WebAssembly and HTML5 Canvas. Your proprietary documents are never uploaded to or stored on third-party servers.',
    },
    {
      q: 'How does the responsive reader behave on mobile devices and tablets?',
      a: 'The reader automatically switches to a high-speed, single-page touch-swipe mode optimized for iOS Safari and Android Chrome. Readers can also install the publication as a standalone Progressive Web App (PWA) on their home screen for a distraction-free, app-like reading experience.',
    },
    {
      q: 'What types of publications can I create with this studio?',
      a: 'The studio includes 24+ domain-specific presets for Editorial Magazines, High-Converting Product Catalogs, Fine Dining Menus, Investor Pitch Decks, Corporate Annual Reports, Real Estate Lookbooks, Photography Portfolios, Children’s Storybooks, and Broadsheet Press.',
    },
    {
      q: 'Can I convert existing multi-page PDF documents into interactive 3D books?',
      a: 'Yes! Simply drag and drop any multi-page PDF file into the PDF Importer. The engine automatically renders high-resolution vector page spreads with dual-page 3D turning physics in seconds.',
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 text-slate-900 scroll-smooth selection:bg-emerald-600 selection:text-white">
      {/* TOP NOTIFICATION BANNER */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-3 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
        <span>Enterprise-Grade 3D Flipbook Studio • Zero Sign-In • 100% Client-Side Privacy</span>
        <button
          onClick={onStartCreating}
          className="hidden sm:inline-flex items-center gap-1 underline font-bold hover:text-emerald-200 ml-1 cursor-pointer"
        >
          <span>Launch Studio</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-emerald-200/35 via-teal-100/25 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-7">
          {/* Main Hero Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs">
            <Rocket className="w-4 h-4 text-emerald-700" />
            <span>Next-Generation 3D Digital Publication Engine</span>
            <span className="hidden sm:inline text-emerald-600">• Zero Cloud Latency • Self-Hosted</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Transform PDFs & Content Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600">
              Interactive 3D Digital Flipbooks
            </span>
          </h1>

          {/* Subtitle / Explainer */}
          <p className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto font-normal sm:font-medium leading-relaxed">
            Convert static magazines, product catalogs, pitch decks, and PDF documents into tactile 3D publications with authentic double-sided physics, synthesized paper audio, and single-file offline HTML export.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-2xl mx-auto">
            {onOpenPdfModal && (
              <button
                onClick={onOpenPdfModal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-rose-900/20 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2.5"
              >
                <FileText className="w-5 h-5 text-white" />
                <span>Import PDF Document</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 uppercase font-black tracking-wide">
                  Instant
                </span>
              </button>
            )}

            <button
              onClick={onStartCreating}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:shadow-emerald-700/30 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Rocket className="w-5 h-5" />
              <span>Open Studio Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTemplates}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-950 text-sm sm:text-base font-bold border border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Explore 24+ Presets</span>
            </button>
          </div>

          {/* Fast Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-slate-600">
            {onOpenPdfModal && (
              <button
                onClick={onOpenPdfModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold shadow-xs cursor-pointer transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>Drag & Drop PDF (.pdf)</span>
              </button>
            )}

            {onOpenBookshelf && (
              <button
                onClick={onOpenBookshelf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold shadow-xs cursor-pointer transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>My Bookshelf (Local Storage)</span>
              </button>
            )}

            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-800 font-semibold shadow-xs cursor-pointer transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Batch Image Import</span>
              </button>
            )}

            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-800 font-semibold shadow-xs cursor-pointer transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Install Standalone PWA</span>
              </button>
            )}
          </div>

          {/* Key Feature Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 max-w-5xl mx-auto text-xs font-semibold text-slate-700">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Private</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 shadow-xs">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Zero-Cloud Cost</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 shadow-xs">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Realistic 3D Physics</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 shadow-xs">
              <Volume2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Paper Audio FX</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 shadow-xs">
              <Download className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Self-Hosted HTML</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 shadow-xs">
              <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Mobile Touch Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE LIVE 3D FLIPBOOK HERO PLAYGROUND */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
              <span>INTERACTIVE LIVE 3D PLAYGROUND</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Try the Live 3D Flipbook Below
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click on page corners, swipe on touch screens, or use the sample switcher to test different publication genres in real time.
            </p>
          </div>

          {/* Live Demo Genre Switcher Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-3xl mx-auto">
            {demoPresets.map((preset, index) => (
              <button
                key={preset.id}
                onClick={() => setSelectedDemoIndex(index)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDemoIndex === index
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Interactive Flipbook Stage Frame */}
          <div className="w-full h-[460px] sm:h-[580px] lg:h-[640px] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative bg-slate-100">
            <FlipbookPreview
              book={activeDemoBook}
              onExportHtml={() => {}}
              onEditPage={() => onSelectTemplate(activeDemoBook)}
              isMobileLayoutProp={false}
              readOnly={false}
            />
          </div>

          {/* Stage Controls & Jump to Studio */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">
                  Currently Previewing: {activeDemoBook.title}
                </p>
                <p className="text-[11px] text-slate-500">
                  {activeDemoBook.pages.length} Pages • Real Paper Acoustics • Double-Sided Turn
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => onSelectTemplate(activeDemoBook)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Customize This Book in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3D FLIPBOOK VS FLAT PDF COMPARISON */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              WHY CHOOSE 3D DIGITAL FLIPBOOKS?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              3D Flipbook vs Boring Flat PDF
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Discover why interactive 3D digital publications achieve 4x higher reader engagement and zero reader fatigue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Flat PDF (Old) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xs opacity-85">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  TRADITIONAL FORMAT
                </span>
                <span className="text-xs text-red-500 font-bold">❌ Outdated & Clunky</span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">Traditional Static PDF Document</h3>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Requires heavy downloads and external PDF viewer plugins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Flat vertical scrolling leads to quick reader fatigue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Zero realistic physical book feeling or interactive page audio.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Awkward pinch-to-zoom on mobile phone screens.</span>
                </li>
              </ul>
            </div>

            {/* 3D Flipbook (New) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border-2 border-emerald-400 space-y-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                RECOMMENDED
              </div>

              <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  OUR 3D DIGITAL ENGINE
                </span>
                <span className="text-xs text-emerald-700 font-bold">✓ Modern & Engaging</span>
              </div>

              <h3 className="text-lg font-bold text-slate-950">Interactive 3D Digital Flipbook</h3>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Instant browser rendering with zero plugins or downloads required.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Realistic 3D leaf bending, double-sided physics, and authentic paper acoustics.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% Free & No Sign-In — export as a single standalone offline HTML file.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mobile touch swipe optimized + PWA install without browser URL bar.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES GRID (6 PILLARS) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              ENTERPRISE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for High-Conversion Digital Publishing
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Tailored for marketing agencies, publishers, creators, educators, and enterprises demanding uncompromising visual craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero document uploads to remote servers. All rendering, vector parsing, and asset encoding stay strictly inside your local browser sandbox.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 group-hover:bg-teal-200 text-teal-700 flex items-center justify-center transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                True 3D Dual-Page Physics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Authentic spine binding, dynamic lighting gradients, realistic paper curvature, and smooth 60 FPS double-sided leaf transitions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center transition-colors">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Synthesized Paper Acoustics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero-latency procedural Web Audio engine generating realistic paper friction sound effects on every page turn without external MP3 dependencies.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 text-indigo-700 flex items-center justify-center transition-colors">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Single-File Standalone HTML
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Export self-contained `.html` files ready to host anywhere or open offline on any computer or mobile device with zero server overhead.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 group-hover:bg-rose-200 text-rose-700 flex items-center justify-center transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Responsive Touch & PWA Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fluid swipe gestures for mobile phones with full Progressive Web App support for installation directly to the home screen.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 group-hover:bg-sky-200 text-sky-700 flex items-center justify-center transition-colors">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                24+ Luxury Presets & 25+ Blocks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gold foil emboss, rich leather binding, modern editorial columns, multi-card grids, testimonial blocks, and pricing tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR TEMPLATES GALLERY PREVIEW */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                CURATED PRESETS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Turnkey Publication Templates
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Select any professionally crafted preset below, customize content in seconds, or build from scratch.
              </p>
            </div>

            <button
              onClick={onOpenTemplates}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              <span>View All 24+ Presets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCardVisual
                key={template.id}
                template={template}
                onPreview={onPreviewTemplate}
                onSelect={(tpl) => onSelectTemplate(tpl.project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              STREAMLINED WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Three Steps to Production-Ready 3D Books
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Design, customize, and distribute interactive digital publications with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Choose Preset or Import PDF
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Select from 24+ domain templates, import an existing multi-page PDF, or begin with a clean blank canvas.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Visual Studio Customization
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tailor typography, 2-column articles, imagery, pricing tables, and luxury binding covers in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Export Standalone HTML
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Download a self-contained offline `.html` package or generate embed codes for seamless website integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. USE CASES / WHO IS THIS FOR */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              VERSATILE USE CASES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Crafted for Every Digital Publication Genre
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              From business decks to culinary menus, give your audience an unforgettable tactile reading journey.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">📖</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Digital Magazines</h4>
              <p className="text-[11px] text-slate-500">Fashion, editorial & culture lookbooks</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">🛍️</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Product Catalogs</h4>
              <p className="text-[11px] text-slate-500">E-commerce brochures with price tags</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">🍽️</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Restaurant Menus</h4>
              <p className="text-[11px] text-slate-500">Wine lists, cafe specials & bistro courses</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">🎨</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Photo Portfolios</h4>
              <p className="text-[11px] text-slate-500">Wedding albums & creative galleries</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">💼</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Corporate Decks</h4>
              <p className="text-[11px] text-slate-500">Investor pitch decks & annual reports</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">🌟</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Storybooks & Comics</h4>
              <p className="text-[11px] text-slate-500">Kids illustrated stories & manga panels</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">📰</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Broadsheet Press</h4>
              <p className="text-[11px] text-slate-500">Vintage column newspapers & journals</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
              <span className="text-2xl">💌</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Luxury Invitations</h4>
              <p className="text-[11px] text-slate-500">Royal wedding cards & gala programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GEO & AEO COMPARISON: 3D FLIPBOOK MAKER VS TRADITIONAL PLATFORMS */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>THE BETTER ALTERNATIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              3D Flipbook Maker vs Traditional Flipbook Platforms
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Why marketing teams, publishers, and educators choose 3D Flipbook Maker over expensive monthly subscriptions like Flipsnack, Issuu, or PubHTML5.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-5 font-bold text-slate-900">Key Feature & Capability</th>
                  <th className="p-4 sm:p-5 font-extrabold text-emerald-900 bg-emerald-50/80 border-x border-emerald-200">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>3D Flipbook Maker</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600">Flipsnack / Issuu</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600">Standard PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Standalone Offline HTML Export
                    <span className="block text-[11px] font-normal text-slate-500">Single self-contained .html file</span>
                  </td>
                  <td className="p-4 sm:p-5 bg-emerald-50/30 border-x border-emerald-100 text-emerald-800 font-bold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold">
                      <Check className="w-4 h-4 stroke-[3]" /> Yes (100% Offline)
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">❌ Cloud Hosted Only</td>
                  <td className="p-4 sm:p-5 text-slate-500">❌ Static File Only</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Pricing Model
                    <span className="block text-[11px] font-normal text-slate-500">No recurring traps</span>
                  </td>
                  <td className="p-4 sm:p-5 bg-emerald-50/30 border-x border-emerald-100 text-emerald-800 font-bold">
                    <span className="text-emerald-700 font-extrabold">Free / Lifetime Deal ($29)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-rose-600 font-medium">$24 – $96 / Month</td>
                  <td className="p-4 sm:p-5 text-slate-500">Free</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Client-Side Data Privacy
                    <span className="block text-[11px] font-normal text-slate-500">Zero cloud document storage</span>
                  </td>
                  <td className="p-4 sm:p-5 bg-emerald-50/30 border-x border-emerald-100 text-emerald-800 font-bold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold">
                      <Check className="w-4 h-4 stroke-[3]" /> 100% Private (Device Only)
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Uploaded to remote cloud</td>
                  <td className="p-4 sm:p-5 text-slate-700">Local file</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Interactive 3D Dual-Page Physics
                    <span className="block text-[11px] font-normal text-slate-500">Realistic sheet flex & corner drags</span>
                  </td>
                  <td className="p-4 sm:p-5 bg-emerald-50/30 border-x border-emerald-100 text-emerald-800 font-bold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold">
                      <Check className="w-4 h-4 stroke-[3]" /> Real 3D Curvature
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Flat 2D Slide Simulation</td>
                  <td className="p-4 sm:p-5 text-slate-500">None (Vertical Scroll)</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Synthesized Page Acoustics
                    <span className="block text-[11px] font-normal text-slate-500">Natural paper rustling sound</span>
                  </td>
                  <td className="p-4 sm:p-5 bg-emerald-50/30 border-x border-emerald-100 text-emerald-800 font-bold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold">
                      <Check className="w-4 h-4 stroke-[3]" /> Web Audio Synthesizer
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Basic MP3 Audio</td>
                  <td className="p-4 sm:p-5 text-slate-500">Silent</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Mandatory Sign-Up / Account
                    <span className="block text-[11px] font-normal text-slate-500">Instant accessibility</span>
                  </td>
                  <td className="p-4 sm:p-5 bg-emerald-50/30 border-x border-emerald-100 text-emerald-800 font-bold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold">
                      <Check className="w-4 h-4 stroke-[3]" /> No Sign-In Needed
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Mandatory Account</td>
                  <td className="p-4 sm:p-5 text-slate-700">No</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AEO Direct Answer Block for AI Overviews / Answer Engines */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                AEO Direct Answer
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                What is 3D Flipbook Maker?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>3D Flipbook Maker</strong> is a free, web-based digital publication studio that converts multi-page PDF documents, catalogs, magazines, brochures, and menus into interactive 3D flipbooks. Operating with a zero-cloud client-side privacy architecture, it provides realistic double-sided paper physics, synthesized paper turning sound, and single-click standalone HTML export that runs anywhere offline without recurring monthly subscription fees.
            </p>
          </div>

          {/* High-Converting Lifetime Deal Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>SPECIAL LAUNCH DEAL • PAY ONCE, USE FOREVER</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Unlock 3D Flipbook Pro for Just <span className="text-emerald-400">$29</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Say goodbye to expensive monthly subscriptions like Flipsnack or Issuu. Get lifetime commercial access, up to 150 pages per PDF, 100% white-label exports, and standalone single-file HTML downloads.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> 150 Pages per PDF
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> 100% White-Label
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Commercial Client Rights
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 shrink-0 w-full lg:w-auto">
                <a
                  href="https://tabrej6.gumroad.com/l/3d-flipbook-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto lg:w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2.5 group"
                >
                  <Crown className="w-5 h-5 text-slate-950" />
                  <span>Get Lifetime Access ($29)</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {onOpenLicenseModal && (
                  <button
                    onClick={onOpenLicenseModal}
                    className="w-full sm:w-auto lg:w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Already have a key? Redeem here</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about self-hosting, client-side privacy, and standalone HTML export.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-emerald-700 text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ready to Create Your First 3D Publication?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Build Interactive Digital Publications —{' '}
            <span className="text-emerald-400">Zero Sign-In Required</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Drag-and-drop visual blocks to craft magazines, catalogs, menus, or pitch decks and export standalone production files instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartCreating}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Rocket className="w-5 h-5" />
              <span>Launch Studio Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Install Standalone PWA</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 10. CLEAN PROFESSIONAL FOOTER */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">FlipApp 3D Publication Studio</span>
            <span className="text-slate-500">• 100% Client-Side Privacy</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenTemplates} className="hover:text-white transition-colors cursor-pointer">
              Templates (24+)
            </button>
            <button onClick={onStartCreating} className="hover:text-white transition-colors cursor-pointer">
              Studio Editor
            </button>
            {onOpenUploadModal && (
              <button onClick={onOpenUploadModal} className="hover:text-white transition-colors cursor-pointer">
                Batch Image Import
              </button>
            )}
            {onOpenInstallModal && (
              <button onClick={onOpenInstallModal} className="hover:text-white transition-colors cursor-pointer">
                Install WebApp
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
