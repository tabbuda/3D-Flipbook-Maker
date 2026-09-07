import React, { useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';

export const TEMPLATE_COVER_MAP: Record<string, string> = {
  // Primary Template IDs (1 to 19)
  'tpl-digital-mastery': '/covers/1.webp',
  'tpl-vogue-fashion': '/covers/2.webp',
  'tpl-ai-tech': '/covers/3.webp',
  'tpl-gourmet-menu': '/covers/4.webp',
  'tpl-architectural-digest': '/covers/5.webp',
  'tpl-mystic-storybook': '/covers/6.webp',
  'tpl-creative-agency': '/covers/7.webp',
  'tpl-sakura-wedding': '/covers/8.webp',
  'tpl-vintage-newspaper': '/covers/9.webp',
  'tpl-scandi-catalog': '/covers/10.webp',
  'tpl-corporate-brochure': '/covers/11.webp',
  'tpl-artisan-cookbook': '/covers/12.webp',
  'tpl-amalfi-guide': '/covers/13.webp',
  'tpl-venture-pitch': '/covers/14.webp',
  'tpl-company-handbook': '/covers/15.webp',
  'tpl-royal-invitation': '/covers/16.webp',
  'tpl-theatre-playbill': '/covers/17.webp',
  'tpl-manga-shonen': '/covers/18.webp',
  'tpl-supercar-apex': '/covers/19.webp',

  // Numeric String Aliases
  '1': '/covers/1.webp',
  '2': '/covers/2.webp',
  '3': '/covers/3.webp',
  '4': '/covers/4.webp',
  '5': '/covers/5.webp',
  '6': '/covers/6.webp',
  '7': '/covers/7.webp',
  '8': '/covers/8.webp',
  '9': '/covers/9.webp',
  '10': '/covers/10.webp',
  '11': '/covers/11.webp',
  '12': '/covers/12.webp',
  '13': '/covers/13.webp',
  '14': '/covers/14.webp',
  '15': '/covers/15.webp',
  '16': '/covers/16.webp',
  '17': '/covers/17.webp',
  '18': '/covers/18.webp',
  '19': '/covers/19.webp',

  // Theme ID Aliases
  'emerald-gold': '/covers/1.webp',
  'editorial-ivory': '/covers/2.webp',
  'cyber-matrix': '/covers/3.webp',
  'gourmet-bistro': '/covers/4.webp',
  'nordic-sage': '/covers/5.webp',
  'vintage-leather': '/covers/6.webp',
  'midnight-sapphire': '/covers/7.webp',
  'sakura-blush': '/covers/8.webp',
  'newspaper-broadsheet': '/covers/9.webp',
  'catalog-minimal': '/covers/10.webp',
  'brochure-corporate': '/covers/11.webp',
  'cookbook-terracotta': '/covers/12.webp',
  'travel-mediterranean': '/covers/13.webp',
  'deck-pitch': '/covers/14.webp',
  'handbook-slate': '/covers/15.webp',
  'invitation-luxury': '/covers/16.webp',
  'booklet-theatre': '/covers/17.webp',
  'manga-popart': '/covers/18.webp',
  'supercar-carbon': '/covers/19.webp',
};

/**
 * Resolves the appropriate cover image URL for a given template ID or custom cover URL
 */
export function getCoverImageForTemplate(templateId?: string, customCoverUrl?: string): string {
  if (customCoverUrl && customCoverUrl.trim() !== '') {
    return customCoverUrl;
  }
  if (templateId && TEMPLATE_COVER_MAP[templateId]) {
    return TEMPLATE_COVER_MAP[templateId];
  }
  return '/covers/1.webp';
}

interface CoverArtworkRendererProps {
  templateId?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  headerTag?: string;
  footerNote?: string;
  coverImageUrl?: string;
  onOpenBook?: () => void;
  isInteractiveCover?: boolean;
}

export const CoverArtworkRenderer: React.FC<CoverArtworkRendererProps> = ({
  templateId = 'tpl-digital-mastery',
  title,
  subtitle,
  author,
  coverImageUrl,
  onOpenBook,
  isInteractiveCover = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const resolvedCoverSrc = getCoverImageForTemplate(templateId, coverImageUrl);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center select-none group">
      {!imageError ? (
        <img
          src={resolvedCoverSrc}
          alt={title || 'Book Cover'}
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Fallback if image fails to load */
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 flex flex-col justify-between text-white border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Digital Edition</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {title || 'Untitled Flipbook'}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 line-clamp-3">
                {subtitle}
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{author || 'Author'}</span>
            <span>2026</span>
          </div>
        </div>
      )}

      {/* Realistic 3D Book Lighting & Spine Shadow Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/40 via-black/5 to-transparent w-[8%]" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_25px_rgba(0,0,0,0.3)]" />
      <div className="absolute inset-0 pointer-events-none border border-black/15" />

      {/* Interactive Open CTA for 3D Book Flip Stage */}
      {isInteractiveCover && onOpenBook && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 hover:scale-105">
          <button
            onClick={onOpenBook}
            className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold tracking-widest uppercase shadow-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 border border-white/20 hover:border-emerald-500/50 hover:shadow-emerald-500/20"
          >
            <span>OPEN BOOK</span>
            <ChevronRight className="w-4 h-4 text-emerald-400 animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );
};
