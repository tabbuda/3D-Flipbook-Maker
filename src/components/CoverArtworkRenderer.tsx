import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export const TEMPLATE_COVER_MAP: Record<string, string> = {
  // Primary Template IDs (1 to 19) — Verified 1-to-1 with /public/covers/*.webp artwork
  'tpl-digital-mastery': '/covers/1.webp',       // 1.webp: THE ART OF DIGITAL MASTERY
  'tpl-vintage-newspaper': '/covers/2.webp',     // 2.webp: The Chronicle (London, May 18, 1920)
  'tpl-scandi-catalog': '/covers/3.webp',        // 3.webp: NORDIC ESSENTIALS 2024 Collection
  'tpl-corporate-brochure': '/covers/4.webp',    // 4.webp: METROPOLIS ENTERPRISES Annual Report
  'tpl-artisan-cookbook': '/covers/5.webp',      // 5.webp: Il FORNO della TOSCANA Cucina Autentica
  'tpl-amalfi-guide': '/covers/6.webp',          // 6.webp: AMALFI COAST & CAPRI Luxury Travel Guide
  'tpl-venture-pitch': '/covers/7.webp',         // 7.webp: NEXUS COGNITION Series-A Pitch Deck
  'tpl-company-handbook': '/covers/8.webp',      // 8.webp: VERIDIAN ENTERPRISES Security & Culture
  'tpl-royal-invitation': '/covers/9.webp',      // 9.webp: VILLA BALBIANELLO Summer Gala
  'tpl-theatre-playbill': '/covers/10.webp',     // 10.webp: ROYAL PHILHARMONIC CONCERT Albert Hall
  'tpl-manga-shonen': '/covers/11.webp',         // 11.webp: CYBER BLADE Shonen Next Vol. 01
  'tpl-supercar-apex': '/covers/12.webp',        // 12.webp: APEX GT-R Performance Catalog
  'tpl-vogue-fashion': '/covers/13.webp',        // 13.webp: L'ATELIER Haute Couture N° 28
  'tpl-ai-tech': '/covers/14.webp',              // 14.webp: AUTONOMOUS SPATIAL SYSTEMS Whitepaper
  'tpl-gourmet-menu': '/covers/15.webp',         // 15.webp: L'ÉTOILE Bistro & Wine Degustation Menu
  'tpl-architectural-digest': '/covers/16.webp', // 16.webp: HAVEN Luxury Residences Portfolio
  'tpl-creative-agency': '/covers/17.webp',      // 17.webp: WILD HORIZONS Wildlife Photography Journal
  'tpl-sakura-wedding': '/covers/18.webp',       // 18.webp: VERTEX SAAS METRICS Q3 Performance
  'tpl-vertex-saas': '/covers/18.webp',          // Alias for Vertex SaaS Metrics Q3 Report
  'tpl-mystic-storybook': '/covers/19.webp',     // 19.webp: ENCHANTED TALES Stories Grow Where Magic Lives

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
  'newspaper-broadsheet': '/covers/2.webp',
  'catalog-minimal': '/covers/3.webp',
  'brochure-corporate': '/covers/4.webp',
  'recipe-artisan': '/covers/5.webp',
  'cookbook-rustic': '/covers/5.webp',
  'cookbook-terracotta': '/covers/5.webp',
  'guidebook-travel': '/covers/6.webp',
  'travel-mediterranean': '/covers/6.webp',
  'presentation-pitch': '/covers/7.webp',
  'deck-pitch': '/covers/7.webp',
  'handbook-slate': '/covers/8.webp',
  'invitation-luxury': '/covers/9.webp',
  'booklet-theatre': '/covers/10.webp',
  'manga-popart': '/covers/11.webp',
  'supercar-carbon': '/covers/12.webp',
  'editorial-ivory': '/covers/13.webp',
  'cyber-matrix': '/covers/14.webp',
  'gourmet-bistro': '/covers/15.webp',
  'nordic-sage': '/covers/16.webp',
  'midnight-sapphire': '/covers/17.webp',
  'minimal-slate': '/covers/18.webp',
  'sakura-blush': '/covers/18.webp',
  'vintage-leather': '/covers/19.webp',
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
}) => {
  const [imageError, setImageError] = useState(false);
  const resolvedCoverSrc = getCoverImageForTemplate(templateId, coverImageUrl);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center select-none pointer-events-none">
      {!imageError ? (
        <img
          src={resolvedCoverSrc}
          alt={title || 'Book Cover'}
          className="w-full h-full object-cover select-none pointer-events-none block"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Luxury Hardcover Fallback if image fails to load */
        <div className="w-full h-full bg-gradient-to-br from-[#072b1f] via-[#0c3c2c] to-[#041711] p-7 flex flex-col justify-between text-white border border-amber-500/30">
          <div className="flex items-center justify-between text-amber-300/90 font-mono text-[10px] uppercase tracking-[2.5px] border-b border-amber-400/25 pb-2.5">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Collector&apos;s Edition</span>
            </span>
            <span>2026</span>
          </div>
          <div className="my-auto text-center space-y-3 px-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white leading-tight drop-shadow-md">
              {title || 'Untitled Flipbook'}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-emerald-100/80 italic font-serif line-clamp-3">
                {subtitle}
              </p>
            )}
          </div>
          <div className="pt-3 border-t border-amber-400/25 flex items-center justify-between text-[10px] text-amber-200/75 font-mono uppercase tracking-widest">
            <span>{author || 'Lumina Press'}</span>
            <span>Hardcover</span>
          </div>
        </div>
      )}

      {/* 1. Realistic 3D Hardcover Spine Binding & French Hinge Groove (Left Edge) */}
      <div
        className="absolute inset-y-0 left-0 w-[24px] pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(255,255,255,0.22) 18%, rgba(255,255,255,0.05) 38%, rgba(0,0,0,0.58) 68%, rgba(0,0,0,0.28) 76%, rgba(255,255,255,0.18) 84%, transparent 100%)',
        }}
      />

      {/* 2. Classic Raised Spine Binding Cords (Subtle Horizontal Ribs on Spine) */}
      <div
        className="absolute inset-y-0 left-0 w-[15px] pointer-events-none z-10 opacity-45"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0%, transparent 16%, rgba(0,0,0,0.55) 16.8%, rgba(255,255,255,0.28) 17.5%, rgba(0,0,0,0.4) 18.2%, transparent 19%)',
        }}
      />

      {/* 3. Studio Ambient Key-Light Specular Sheen & Fine Linen Micro-Grain */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(130deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.24) 100%)',
        }}
      />

      {/* 4. 3D Beveled Hardcover Board Rim & Inner Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow:
            'inset 0 1.5px 1px rgba(255,255,255,0.32), inset -1.5px 0 2px rgba(255,255,255,0.15), inset 0 -2px 3px rgba(0,0,0,0.55), inset 0 0 28px rgba(0,0,0,0.32)',
        }}
      />
    </div>
  );
};
