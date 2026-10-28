import { BookProject, PageContent, CoverThemeId, PageBlock } from '../../types/flipbook';

export interface PresetConfig {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  edition: string;
  year: string;
  publisher: string;
  themeId: CoverThemeId;
  headerTag: string;
  footerNote: string;
  categoryLabel: string;
  isbn: string;
  priceTag: string;
  heroImage: string;
  galleryImages: string[];
  tableOfContents?: {
    title?: string;
    subtitle?: string;
    items: { id: string; title: string; description: string }[];
  };
  chapters: {
    number: string;
    tag: string;
    title: string;
    subtitle: string;
    quote: string;
    quoteAuthor: string;
    quoteRole: string;
    paragraph1: string;
    paragraph2: string;
    twoCol1: string;
    twoCol2: string;
  }[];
  specialBlocks: {
    type: string;
    title: string;
    subtitle: string;
    items: { id: string; title: string; description: string; tag?: string; highlight?: string; icon?: string; price?: string }[];
  }[];
  essay?: {
    headerTag?: string;
    title: string;
    subtitle: string;
    paragraph1: string;
    paragraph2: string;
    calloutTitle?: string;
    calloutText?: string;
  };
  specifications?: {
    headerTag?: string;
    title: string;
    subtitle: string;
    sectionTitle?: string;
    imageUrl?: string;
    imageCaption?: string;
    paragraph1?: string;
    items: { id: string; title: string; description: string }[];
  };
  philosophy?: {
    headerTag?: string;
    title: string;
    quoteText: string;
    quoteAuthor: string;
    quoteRole: string;
    description: string;
  };
  technicalMatrix?: {
    headerTag?: string;
    title: string;
    subtitle: string;
    items: { id: string; icon: string; title: string; description: string }[];
  };
  caseStudies?: {
    headerTag?: string;
    title: string;
    subtitle: string;
    items: { id: string; tag: string; title: string; description: string; highlight: string }[];
  };
  retrospective?: {
    headerTag?: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    noteTitle?: string;
    noteText?: string;
  };
  authorBio: {
    name: string;
    bio: string;
    avatar: string;
    socials: string;
    signature: string;
    colophonItems?: { id: string; title: string; description: string }[];
  };
  archivalColophon?: {
    headerTag?: string;
    title: string;
    subtitle: string;
    items: { id: string; icon: string; title: string; description: string }[];
  };
  backCover?: {
    quote: string;
    quoteAuthor: string;
  };
  customInteriorPages?: {
    tocTitle?: string;
    tocSubtitle?: string;
    tocItems?: { id?: string; title: string; description?: string; page?: string }[];
    page4?: PageBlock[];
    page8?: PageBlock[];
    page13?: PageBlock[];
    page17?: PageBlock[];
    pages?: {
      pageIndex: number; // 2 to 18
      headerTag: string;
      title?: string;
      subtitle?: string;
      blocks: PageBlock[];
    }[];
  };
}

export function build20PageBookProject(config: PresetConfig): BookProject {
  const pages: PageContent[] = [];
  const img = (idx: number) =>
    config.galleryImages[idx % Math.max(1, config.galleryImages.length)] || config.heroImage;

  const ch1 = config.chapters[0];
  const ch2 = config.chapters[1] || config.chapters[0];
  const ch3 = config.chapters[2] || config.chapters[0];
  const spec1 = config.specialBlocks[0];
  const spec2 = config.specialBlocks[1] || config.specialBlocks[0];

  // Page 0: Cover Front
  pages.push({
    id: `${config.id}-p0-cover`,
    template: 'cover-front',
    title: config.title,
    subtitle: config.subtitle,
    headerTag: config.headerTag,
    footerNote: config.footerNote,
    coverImageUrl: config.heroImage,
  });

  // Page 1: Bespoke Domain-Matched Table of Contents
  const rawToc = config.customInteriorPages?.tocItems || config.tableOfContents?.items;
  const customToc = rawToc?.map((item, idx) => ({
    id: item.id || `toc-${idx + 1}`,
    title: item.title,
    description: item.description || (item.page ? `Page ${item.page}` : `Page ${idx * 2 + 2}`),
  }));
  pages.push({
    id: `${config.id}-p1-toc`,
    template: 'table-of-contents',
    headerTag: `${config.headerTag} • INDEX`,
    title: config.customInteriorPages?.tocTitle || config.tableOfContents?.title || `${config.categoryLabel.toUpperCase()} INDEX`,
    subtitle: config.customInteriorPages?.tocSubtitle || config.tableOfContents?.subtitle || `${config.edition} • Complete Curated Contents`,
    bulletItems: customToc || [
      { id: 't1', title: `01. ${ch1?.title || 'Opening Chronicle'}`, description: 'Page 2' },
      { id: 't2', title: `02. ${ch1?.subtitle || 'Editorial Feature'}`, description: 'Page 3' },
      { id: 't3', title: `03. Photographic Plate & Visual Archive`, description: 'Page 4' },
      { id: 't4', title: `04. ${ch2?.title || 'Signature Collection'}`, description: 'Page 6' },
      { id: 't5', title: `05. ${spec1?.title || 'Domain Highlights'}`, description: 'Page 7' },
      { id: 't6', title: `06. ${spec2?.title || 'Key Metrics & Specs'}`, description: 'Page 8' },
      { id: 't7', title: `07. ${ch3?.title || 'Masterwork Study'}`, description: 'Page 9' },
      { id: 't8', title: `08. ${config.specifications?.title || 'Technical Dossier & Provenance'}`, description: 'Page 12' },
      { id: 't9', title: `09. ${config.authorBio.name} & Imprint`, description: 'Page 17' },
      { id: 't10', title: '10. Back Cover & Acclaim', description: 'Page 19' },
    ],
    footerNote: `${config.edition} • ${config.publisher}`,
  });

  // Build Default Pages 2..18 (which can be overridden per-page by config.customInteriorPages.pages)
  const defaultPagesMap: Record<number, PageContent> = {
    2: {
      id: `${config.id}-p2-ch1`,
      template: 'chapter-intro',
      headerTag: `${ch1?.tag || config.headerTag} • I`,
      title: ch1?.title,
      subtitle: ch1?.subtitle,
      blocks: [
        {
          id: 'b-ch1-head',
          type: 'chapter-header',
          chapterNumber: `PART ${ch1?.number || '01'}`,
          tag: ch1?.tag || config.categoryLabel,
          title: ch1?.title,
        },
        {
          id: 'b-ch1-img',
          type: 'image-block',
          imageUrl: img(0),
          imageCaption: `${ch1?.title} — ${ch1?.subtitle}`,
          imageHeight: '140px',
          imageFit: 'cover',
        },
        {
          id: 'b-ch1-quote',
          type: 'quote-block',
          quoteText: ch1?.quote,
          quoteAuthor: ch1?.quoteAuthor,
          quoteRole: ch1?.quoteRole,
        },
        {
          id: 'b-ch1-p1',
          type: 'dropcap-paragraph',
          paragraph1: ch1?.paragraph1,
        },
      ],
    },
    3: {
      id: `${config.id}-p3-art1`,
      template: 'story-article',
      headerTag: `${ch1?.tag || 'FEATURE'} • ANALYSIS`,
      title: ch1?.subtitle,
      blocks: [
        {
          id: 'b-art1-head',
          type: 'heading-2',
          title: ch1?.subtitle,
          align: 'left',
        },
        {
          id: 'b-art1-split',
          type: 'image-text-split',
          title: ch1?.title,
          imageUrl: img(1),
          paragraph1: ch1?.paragraph2,
        },
        {
          id: 'b-art1-twocol',
          type: 'two-column-text',
          paragraph1: ch1?.twoCol1,
          paragraph2: ch1?.twoCol2,
        },
      ],
    },
    4: {
      id: `${config.id}-p4-img1`,
      template: 'image-showcase',
      headerTag: `${config.categoryLabel.toUpperCase()} • PLATE I`,
      title: `${ch1?.title} — Visual Study`,
      blocks: [
        {
          id: 'b-img1-head',
          type: 'heading-2',
          title: `${ch1?.title} — Archival Plate`,
          align: 'left',
        },
        {
          id: 'b-img1-pic',
          type: 'image-block',
          imageUrl: img(2),
          imageCaption: `${config.title} • ${ch1?.subtitle}`,
          imageHeight: '190px',
          imageFit: 'cover',
        },
        {
          id: 'b-img1-polaroid',
          type: 'polaroid-gallery',
          imageUrl: img(0),
          title: ch1?.tag,
          imageUrl2: img(3),
          subtitle: ch2?.tag,
        },
      ],
    },
    5: {
      id: `${config.id}-p5-split1`,
      template: 'image-text-split',
      headerTag: `${ch1?.tag || 'DOSSIER'} • DETAIL`,
      title: ch2?.subtitle,
      blocks: [
        {
          id: 'b-split-head',
          type: 'heading-2',
          title: ch2?.subtitle,
          align: 'left',
        },
        {
          id: 'b-split-body',
          type: 'image-text-split',
          title: ch2?.title,
          imageUrl: img(3),
          paragraph1: ch2?.paragraph1,
        },
        {
          id: 'b-split-callout',
          type: 'callout-box',
          title: `${config.categoryLabel.toUpperCase()} HIGHLIGHT`,
          paragraph1: ch2?.twoCol1,
        },
      ],
    },
    6: {
      id: `${config.id}-p6-ch2`,
      template: 'chapter-intro',
      headerTag: `${ch2?.tag || 'PART II'}`,
      title: ch2?.title,
      blocks: [
        {
          id: 'b-ch2-head',
          type: 'chapter-header',
          chapterNumber: `PART ${ch2?.number || '02'}`,
          tag: ch2?.tag,
          title: ch2?.title,
        },
        {
          id: 'b-ch2-img',
          type: 'image-block',
          imageUrl: img(4),
          imageCaption: `${ch2?.title} • ${ch2?.subtitle}`,
          imageHeight: '135px',
          imageFit: 'cover',
        },
        {
          id: 'b-ch2-quote',
          type: 'quote-block',
          quoteText: ch2?.quote,
          quoteAuthor: ch2?.quoteAuthor,
          quoteRole: ch2?.quoteRole,
        },
        {
          id: 'b-ch2-p1',
          type: 'dropcap-paragraph',
          paragraph1: ch2?.paragraph2,
        },
      ],
    },
    7: {
      id: `${config.id}-p7-feat`,
      template: 'feature-list',
      headerTag: `${spec1?.title || 'KEY PILLARS'}`,
      title: spec1?.title,
      blocks: [
        {
          id: 'b-feat-head',
          type: 'heading-2',
          title: spec1?.title,
          align: 'left',
        },
        {
          id: 'b-feat-sub',
          type: 'subtitle',
          subtitle: spec1?.subtitle,
        },
        {
          id: 'b-feat-cards',
          type: 'feature-cards',
          items: spec1?.items || [],
        },
      ],
    },
    8: {
      id: `${config.id}-p8-grid`,
      template: 'key-points-grid',
      headerTag: `${spec2?.title || 'KEY METRICS'}`,
      title: spec2?.title,
      blocks: [
        {
          id: 'b-grid-head',
          type: 'heading-2',
          title: spec2?.title,
          align: 'left',
        },
        {
          id: 'b-grid-sub',
          type: 'subtitle',
          subtitle: spec2?.subtitle,
        },
        {
          id: 'b-grid-items',
          type: 'grid-cards',
          items: spec2?.items || [],
        },
      ],
    },
    9: {
      id: `${config.id}-p9-ch3`,
      template: 'chapter-intro',
      headerTag: `${ch3?.tag || 'PART III'}`,
      title: ch3?.title,
      blocks: [
        {
          id: 'b-ch3-head',
          type: 'chapter-header',
          chapterNumber: `PART ${ch3?.number || '03'}`,
          tag: ch3?.tag,
          title: ch3?.title,
        },
        {
          id: 'b-ch3-img',
          type: 'image-block',
          imageUrl: img(5),
          imageCaption: `${ch3?.title} — ${ch3?.subtitle}`,
          imageHeight: '135px',
          imageFit: 'cover',
        },
        {
          id: 'b-ch3-quote',
          type: 'quote-block',
          quoteText: ch3?.quote,
          quoteAuthor: ch3?.quoteAuthor,
          quoteRole: ch3?.quoteRole,
        },
        {
          id: 'b-ch3-p1',
          type: 'dropcap-paragraph',
          paragraph1: ch3?.paragraph1,
        },
      ],
    },
    10: {
      id: `${config.id}-p10-essay`,
      template: 'story-article',
      headerTag: config.essay?.headerTag || `${ch3?.tag} • DEEP DIVE`,
      title: config.essay?.title || ch3?.subtitle,
      blocks: [
        {
          id: 'b-essay-head',
          type: 'heading-2',
          title: config.essay?.title || ch3?.subtitle,
          align: 'left',
        },
        {
          id: 'b-essay-split',
          type: 'image-text-split',
          title: ch3?.title,
          imageUrl: img(6),
          paragraph1: config.essay?.paragraph1 || ch3?.paragraph2,
        },
        {
          id: 'b-essay-twocol',
          type: 'two-column-text',
          paragraph1: ch3?.twoCol1,
          paragraph2: ch3?.twoCol2,
        },
        {
          id: 'b-essay-callout',
          type: 'callout-box',
          title: config.essay?.calloutTitle || `${ch3?.tag} NOTE`,
          paragraph1: config.essay?.calloutText || ch2?.twoCol2,
        },
      ],
    },
    11: {
      id: `${config.id}-p11-fullbleed`,
      template: 'image-showcase',
      headerTag: `${config.categoryLabel.toUpperCase()} • PLATE II`,
      title: `${ch3?.title} — Visual Portfolio`,
      blocks: [
        {
          id: 'b-full-head',
          type: 'heading-2',
          title: `${ch3?.title} — Visual Plate`,
          align: 'left',
        },
        {
          id: 'b-full-img',
          type: 'image-block',
          imageUrl: img(7),
          imageCaption: `${config.title} • ${ch3?.subtitle}`,
          imageHeight: '200px',
          imageFit: 'cover',
        },
        {
          id: 'b-full-note',
          type: 'paragraph',
          paragraph1: ch3?.paragraph2,
        },
      ],
    },
    12: {
      id: `${config.id}-p12-split2`,
      template: 'image-text-split',
      headerTag: config.specifications?.headerTag || `${config.categoryLabel.toUpperCase()} SPECS`,
      title: config.specifications?.title || `${config.title} — Reference Dossier`,
      blocks: [
        {
          id: 'b-spec-head',
          type: 'heading-2',
          title: config.specifications?.title || `${ch2?.title} — Reference Matrix`,
          align: 'left',
        },
        {
          id: 'b-spec-body',
          type: 'image-text-split',
          title: config.specifications?.sectionTitle || ch2?.subtitle,
          imageUrl: config.specifications?.imageUrl || img(4),
          paragraph1: config.specifications?.paragraph1 || ch2?.twoCol1,
        },
        {
          id: 'b-spec-table',
          type: 'table-specs',
          title: config.specifications?.sectionTitle || `${config.categoryLabel} Specifications`,
          items: config.specifications?.items || (spec2?.items || []).map((it, idx) => ({
            id: `sp-${idx}`,
            title: it.title,
            description: it.highlight || it.description,
          })),
        },
      ],
    },
    13: {
      id: `${config.id}-p13-quote`,
      template: 'quote-highlight',
      headerTag: config.philosophy?.headerTag || `${config.categoryLabel.toUpperCase()} ETHOS`,
      title: config.philosophy?.title || ch1?.title,
      blocks: [
        {
          id: 'b-qhi-head',
          type: 'heading-2',
          title: config.philosophy?.title || `${config.title} — Guiding Ethos`,
          align: 'center',
        },
        {
          id: 'b-qhi-poem',
          type: 'poetry-calligraphy',
          title: ch1?.subtitle,
          paragraph1: config.philosophy?.quoteText || `${ch1?.quote}\n${ch2?.quote}`,
          authorName: config.philosophy?.quoteAuthor || ch1?.quoteAuthor,
        },
        {
          id: 'b-qhi-pol',
          type: 'polaroid-gallery',
          imageUrl: img(1),
          title: ch1?.title,
          imageUrl2: img(5),
          subtitle: ch3?.title,
        },
      ],
    },
    14: {
      id: `${config.id}-p14-techspec`,
      template: 'feature-list',
      headerTag: config.technicalMatrix?.headerTag || `${spec1?.title || 'STANDARDS'}`,
      title: config.technicalMatrix?.title || spec1?.title,
      blocks: [
        {
          id: 'b-tmat-head',
          type: 'heading-2',
          title: config.technicalMatrix?.title || `${config.categoryLabel} Standards`,
          align: 'left',
        },
        {
          id: 'b-tmat-stat',
          type: 'stat-gauge-matrix',
          title: spec2?.title || 'Key Indicators',
          tag: config.year,
          items: (spec2?.items || []).map((it, i) => ({
            id: `st-${i}`,
            title: it.tag || it.title,
            highlight: it.highlight || it.title,
            badge: 'VERIFIED',
            progress: 88 + (i * 3) % 12,
          })),
        },
        {
          id: 'b-tmat-cards',
          type: 'feature-cards',
          items: (config.technicalMatrix?.items || spec1?.items || []).slice(0, 2),
        },
      ],
    },
    15: {
      id: `${config.id}-p15-cases`,
      template: 'key-points-grid',
      headerTag: config.caseStudies?.headerTag || `${config.categoryLabel.toUpperCase()} ARCHIVE`,
      title: config.caseStudies?.title || spec2?.title,
      blocks: [
        {
          id: 'b-case-head',
          type: 'heading-2',
          title: config.caseStudies?.title || `${config.title} — Featured Highlights`,
          align: 'left',
        },
        {
          id: 'b-case-img',
          type: 'image-block',
          imageUrl: img(6),
          imageCaption: `${config.title} — ${config.edition}`,
          imageHeight: '125px',
          imageFit: 'cover',
        },
        {
          id: 'b-case-cards',
          type: 'grid-cards',
          items: config.caseStudies?.items || spec2?.items || [],
        },
      ],
    },
    16: {
      id: `${config.id}-p16-retro`,
      template: 'story-article',
      headerTag: config.retrospective?.headerTag || 'CLOSING CHRONICLE',
      title: config.retrospective?.title || ch3?.title,
      blocks: [
        {
          id: 'b-retro-head',
          type: 'heading-2',
          title: config.retrospective?.title || `${ch3?.title} — Epilogue`,
          align: 'left',
        },
        {
          id: 'b-retro-split',
          type: 'image-text-split',
          title: ch3?.subtitle,
          imageUrl: img(2),
          paragraph1: config.retrospective?.paragraph1 || ch3?.twoCol1,
        },
        {
          id: 'b-retro-callout',
          type: 'callout-box',
          title: config.retrospective?.noteTitle || `${config.publisher.toUpperCase()} NOTE`,
          paragraph1: config.retrospective?.noteText || ch3?.twoCol2,
        },
      ],
    },
    17: {
      id: `${config.id}-p17-author`,
      template: 'author-bio',
      headerTag: 'CREATOR & CURATION',
      blocks: [
        {
          id: 'b-auth-head',
          type: 'heading-2',
          title: `About ${config.authorBio.name}`,
          align: 'left',
        },
        {
          id: 'b-auth-card',
          type: 'author-card',
          authorName: config.authorBio.name || config.author,
          authorBio: config.authorBio.bio,
          authorAvatarUrl: config.authorBio.avatar,
          authorSocials: config.authorBio.socials,
          authorSignature: config.authorBio.signature,
        },
        {
          id: 'b-auth-colophon',
          type: 'table-specs',
          title: `${config.categoryLabel} Edition Details`,
          items: config.authorBio.colophonItems || [
            { id: 'cl1', title: 'Publication', description: config.title },
            { id: 'cl2', title: 'Edition', description: config.edition },
            { id: 'cl3', title: 'Publisher', description: config.publisher },
            { id: 'cl4', title: 'Catalog / ISBN', description: config.isbn },
          ],
        },
      ],
    },
    18: {
      id: `${config.id}-p18-colophon`,
      template: 'feature-list',
      headerTag: config.archivalColophon?.headerTag || 'PUBLICATION IMPRINT',
      title: config.archivalColophon?.title || `${config.publisher} Imprint`,
      subtitle: config.archivalColophon?.subtitle || `${config.edition} • ${config.year}`,
      blocks: [
        {
          id: 'b-col-head',
          type: 'heading-2',
          title: config.archivalColophon?.title || `${config.publisher} Imprint`,
          align: 'left',
        },
        {
          id: 'b-col-cards',
          type: 'feature-cards',
          items: config.archivalColophon?.items || [
            { id: 'cp1', icon: 'Award', title: config.edition, description: `Published by ${config.publisher} (${config.year}). Curated by ${config.author}.` },
            { id: 'cp2', icon: 'Globe', title: config.categoryLabel, description: `${config.subtitle}` },
            { id: 'cp3', icon: 'Shield', title: 'Catalog & Pricing', description: `${config.isbn} • ${config.priceTag}` },
          ],
        },
        {
          id: 'b-col-barcode',
          type: 'barcode-imprint',
          isbn: config.isbn,
          publisherName: config.publisher,
        },
      ],
    },
  };

  // Override with custom interior pages if defined on config
  if (config.customInteriorPages?.pages) {
    for (const customPage of config.customInteriorPages.pages) {
      if (customPage.pageIndex >= 2 && customPage.pageIndex <= 18) {
        defaultPagesMap[customPage.pageIndex] = {
          id: `${config.id}-p${customPage.pageIndex}-custom`,
          template: 'story-article',
          headerTag: customPage.headerTag,
          title: customPage.title,
          subtitle: customPage.subtitle,
          blocks: customPage.blocks,
        };
      }
    }
  }

  const shorthandPages: [number, PageBlock[] | undefined, string][] = [
    [4, config.customInteriorPages?.page4, `${config.headerTag} • FEATURE SPREAD`],
    [8, config.customInteriorPages?.page8, `${config.headerTag} • CURATED SHOWCASE`],
    [13, config.customInteriorPages?.page13, `${config.headerTag} • TECHNICAL ARCHIVE`],
    [17, config.customInteriorPages?.page17, `${config.headerTag} • SPECIAL DOSSIER`],
  ];
  for (const [pIdx, blocks, tag] of shorthandPages) {
    if (blocks && blocks.length > 0) {
      defaultPagesMap[pIdx] = {
        id: `${config.id}-p${pIdx}-custom`,
        template: 'story-article',
        headerTag: tag,
        blocks,
      };
    }
  }

  for (let pIdx = 2; pIdx <= 18; pIdx++) {
    pages.push(defaultPagesMap[pIdx]);
  }

  // Page 19: Back Cover
  pages.push({
    id: `${config.id}-p19-back`,
    template: 'cover-back',
    title: config.title,
    subtitle: config.subtitle,
    paragraph1:
      config.backCover?.quote ||
      `“${ch1?.quote || 'An extraordinary work of enduring craftsmanship and visual authority.'}”`,
    authorName:
      config.backCover?.quoteAuthor || `— ${ch1?.quoteAuthor || config.author}, ${config.publisher}`,
    publisherName: config.publisher,
    isbn: config.isbn,
    barcodeNumber: config.isbn.replace(/[^0-9]/g, '').slice(0, 13) || '9780201896831',
    priceTag: config.priceTag,
    footerNote: `${config.edition} • ${config.publisher} • All Rights Reserved`,
  });

  return {
    id: config.id,
    title: config.title,
    subtitle: config.subtitle,
    author: config.author,
    edition: config.edition,
    year: config.year,
    publisher: config.publisher,
    themeId: config.themeId,
    soundEnabled: true,
    pageTurnSpeed: 'normal',
    pages,
  };
}
