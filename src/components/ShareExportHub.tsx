import React, { useState, useEffect } from 'react';
import { BookProject } from '../types/flipbook';
import {
  Download,
  Code,
  Copy,
  Check,
  Printer,
  FileJson,
  Upload,
  Share2,
  QrCode,
  Sparkles,
  ExternalLink,
  X,
  Smartphone,
  ArrowDownToLine,
  Globe,
  MessageCircle,
  Send,
  Eye,
  Zap,
  Crown,
} from 'lucide-react';
import { createInstantSharePackage, PublishResult } from '../utils/cloudPublisher';
import { getLicenseInfo, onLicenseChange, canExportHtml, onUsageChange } from '../utils/licenseManager';

interface ShareExportHubProps {
  book: BookProject;
  isOpen: boolean;
  onClose: () => void;
  onExportHtml: () => void;
  onLoadProjectJson: (project: BookProject) => void;
  onOpenInstallModal?: () => void;
  onOpenReader?: () => void;
  onOpenLicenseModal?: () => void;
}

type TabType = 'html' | 'online' | 'embed' | 'backup';

export const ShareExportHub: React.FC<ShareExportHubProps> = ({
  book,
  isOpen,
  onClose,
  onExportHtml,
  onLoadProjectJson,
  onOpenInstallModal,
  onOpenReader,
  onOpenLicenseModal,
}) => {
  const [license, setLicense] = useState(() => getLicenseInfo());
  const [exportStatus, setExportStatus] = useState(() => canExportHtml());

  useEffect(() => {
    const unsubLicense = onLicenseChange((info) => {
      setLicense(info);
      setExportStatus(canExportHtml());
    });
    const unsubUsage = onUsageChange(() => {
      setExportStatus(canExportHtml());
    });
    return () => {
      unsubLicense();
      unsubUsage();
    };
  }, []);

  const isPro = license.tier === 'pro';
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [shareData, setShareData] = useState<PublishResult | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const [embedWidth, setEmbedWidth] = useState<string>('100%');
  const [embedHeight, setEmbedHeight] = useState<string>('640px');

  // Auto-generate share package when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPublishing(true);
      createInstantSharePackage(book)
        .then((result) => {
          setShareData(result);
          setIsPublishing(false);
        })
        .catch(() => setIsPublishing(false));
    }
  }, [isOpen, book]);

  if (!isOpen) return null;

  const currentShareUrl = shareData?.shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/?read=${book.id}` : '');

  const dynamicEmbedCode = `<iframe src="${currentShareUrl}" width="${embedWidth}" height="${embedHeight}" style="border:none; border-radius:12px; box-shadow:0 12px 36px rgba(0,0,0,0.18);" allowfullscreen allow="clipboard-write; fullscreen"></iframe>`;

  // Download project JSON
  const handleSaveJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(book, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-project.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.pages && Array.isArray(parsed.pages)) {
            onLoadProjectJson(parsed);
            onClose();
          }
        } catch {
          alert('Invalid project JSON format.');
        }
      };
    }
  };

  // Download QR Code image
  const handleDownloadQr = () => {
    if (!shareData?.qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = shareData.qrCodeDataUrl;
    a.download = `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 text-slate-800">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">Publish & Share Hub</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                100% Free Lifetime Sharing • {book.pages.length} Pages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation - Responsive 2x2 on mobile, 4-column on desktop */}
        <div className="p-2 sm:p-2.5 bg-slate-100/90 border-b border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {/* 1. Offline HTML (Highlighted with Thunder Tag) */}
            <button
              onClick={() => setActiveTab('html')}
              className={`relative px-2.5 sm:px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'html'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/40'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 shadow-xs'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0 ${activeTab === 'html' ? 'animate-pulse' : ''}`} />
              <span className="truncate">Offline HTML</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold tracking-wider shrink-0 flex items-center gap-0.5 ${
                  activeTab === 'html'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                ⚡ TOP
              </span>
            </button>

            {/* 2. Online Share Link & QR */}
            <button
              onClick={() => setActiveTab('online')}
              className={`px-2.5 sm:px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'online'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Online & QR</span>
              <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] rounded font-mono font-bold shrink-0">
                FREE
              </span>
            </button>

            {/* 3. Embed Code */}
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-2.5 sm:px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'embed'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Embed Code</span>
            </button>

            {/* 4. Backup & Print */}
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-2.5 sm:px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Backup & Print</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: ONLINE SHARE LINK & QR */}
          {activeTab === 'online' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Direct Reader Link Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase shadow-xs">
                      1-CLICK SHARE
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">Direct 3D Reader Link</h4>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold font-mono">
                    Zero-Config • 100% Free Lifetime
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Send this link to anyone on WhatsApp, Telegram, or Email. They can open and flip through
                  all {book.pages.length} pages in realistic 3D without installing any app.
                </p>

                {/* Copy Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white border border-emerald-300 rounded-xl p-1.5 shadow-xs">
                  <input
                    type="text"
                    readOnly
                    value={currentShareUrl}
                    className="flex-1 bg-transparent px-3 py-1 text-xs text-slate-800 font-mono focus:outline-none select-all min-w-0"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentShareUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-xs"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>

                    {onOpenReader && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenReader();
                        }}
                        className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open Reader</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code & 1-Click Social Sharing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* QR Code Generator */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Instant Scannable QR Code</span>
                  </h4>

                  {shareData?.qrCodeDataUrl ? (
                    <img
                      src={shareData.qrCodeDataUrl}
                      alt="3D Book QR Code"
                      className="w-36 h-36 rounded-xl bg-white p-2 border border-slate-300 shadow-md"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-xl bg-slate-200 animate-pulse flex items-center justify-center text-xs text-slate-500">
                      Generating QR...
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 max-w-[200px]">
                    Print on flyers, menus, or business cards for mobile camera scan.
                  </p>

                  <button
                    onClick={handleDownloadQr}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Download QR PNG</span>
                  </button>
                </div>

                {/* 1-Click Social Channels */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Quick Send to Channels</span>
                  </h4>

                  <a
                    href={shareData?.whatsAppUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </a>

                  <a
                    href={shareData?.telegramUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Share on Telegram</span>
                  </a>

                  <a
                    href={shareData?.twitterUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Post to X (Twitter)</span>
                  </a>

                  <a
                    href={shareData?.emailUrl || '#'}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Send via Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STANDALONE HTML (TOP RECOMMENDED) */}
          {activeTab === 'html' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {!isPro && !exportStatus.allowed ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/90 border-2 border-amber-300 relative overflow-hidden space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-200 text-amber-900 uppercase">
                        LIMIT REACHED
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">1 of 1 Free HTML Export Used</h4>
                    </div>
                    <span className="text-xs text-amber-900 font-bold bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300 self-start sm:self-auto">
                      Free Plan Limit Reached
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl">
                    You have already downloaded your <strong>1 free standalone HTML export</strong>. Upgrade to <strong>Pro Lifetime ($29)</strong> to download unlimited self-contained 3D flipbooks, 100% white-label with zero watermarks!
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <a
                      href="https://tabrej6.gumroad.com/l/3d-flipbook-pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer group"
                    >
                      <Crown className="w-4 h-4 text-slate-950" />
                      <span>Unlock Unlimited Exports ($29)</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    {onOpenLicenseModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenLicenseModal();
                        }}
                        className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        Redeem Pro Key
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-400 relative overflow-hidden space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 uppercase shadow-xs flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-950 text-amber-950" />
                        TOP RECOMMENDED
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">Standalone Single-File 3D Flipbook</h4>
                    </div>
                    <span className="text-xs text-emerald-800 font-mono font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md self-start sm:self-auto">
                      100% Self-Contained
                    </span>
                  </div>

                  {!isPro && (
                    <div className="p-2.5 px-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>Free Starter: <strong>0 of 1 Export Used</strong> (1 Free Download Available)</span>
                      </div>
                      {onOpenLicenseModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenLicenseModal();
                          }}
                          className="font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer shrink-0"
                        >
                          Go Unlimited
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                    Bundles all book pages, sound effects, 3D turning physics, and mobile touch mechanics into a single lightweight <code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold text-xs">.html</code> file. 
                    Zero setup or servers needed — just double-click to open & read on any phone, tablet, or PC!
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <button
                      onClick={onExportHtml}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Download className="w-4 h-4 animate-bounce" />
                      <span>{isPro ? 'Download Standalone .HTML File' : 'Download Standalone .HTML (1 Free Export)'}</span>
                    </button>

                    {isPro ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>100% White-Label (No Watermarks)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          Free includes watermark & 1 export limit.
                        </span>
                        {onOpenLicenseModal && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenLicenseModal();
                            }}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                          >
                            Remove with Pro
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WebApp / PWA Install Option */}
              {onOpenInstallModal && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                      <ArrowDownToLine className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Install as Mobile & Desktop App</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          PWA
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Runs standalone without browser URL bar on Android, Windows, Mac & iOS.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenInstallModal();
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Open Install Guide</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMBED ON WEBSITE */}
          {activeTab === 'embed' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Website Embed Code (iFrame)
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(dynamicEmbedCode);
                      setCopiedEmbed(true);
                      setTimeout(() => setCopiedEmbed(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    {copiedEmbed ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap select-all">
                  {dynamicEmbedCode}
                </pre>

                <p className="text-[11px] text-slate-500">
                  Paste this code into your WordPress, Shopify, Wix, Webflow, or custom website HTML.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & PRINT */}
          {activeTab === 'backup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
              {/* Print / PDF */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Printer className="w-4 h-4 text-emerald-700" />
                  <span>Print & PDF Export</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trigger clean browser layout print formatted specifically for A4 spreads.
                </p>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Open Print / PDF Dialog</span>
                </button>
              </div>

              {/* Project Backup & Restore */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <FileJson className="w-4 h-4 text-emerald-700" />
                  <span>Project JSON Backup</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Save your editable book configuration to disk or load an existing project.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSaveJson}
                    className="py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save JSON</span>
                  </button>
                  <label className="py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-center gap-1 transition-colors cursor-pointer text-center shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Load JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>FlipStudio Pro • 100% Free Lifetime Infrastructure</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
