// SaaS Plan & License Key Manager
// Handles Free vs Pro Lifetime (AppSumo) feature gating with 0 server costs.

export type PlanTier = 'free' | 'pro';

export interface LicenseInfo {
  tier: PlanTier;
  key?: string;
  activatedAt?: string;
  planName: string;
  source?: 'appsumo' | 'direct' | 'promo';
}

export interface PlanLimits {
  maxBooks: number;
  maxPdfPages: number;
  maxPdfImports: number;
  maxExports: number;
  hasWatermark: boolean;
  whitelabelExport: boolean;
  highResExport: boolean;
  allTemplates: boolean;
}

const STORAGE_KEY = 'flipbook_saas_license_v1';
const FREE_USAGE_KEY = 'flipbook_free_usage_tracker_v1';
const LICENSE_EVENT = 'flipbook_license_updated';
const USAGE_EVENT = 'flipbook_usage_updated';

export interface FreeUsageStats {
  pdfImportsCount: number;
  exportsCount: number;
  maxFreePdfImports: number;
  maxFreeExports: number;
}

/**
 * Get current free tier usage statistics
 */
export function getFreeUsageStats(): FreeUsageStats {
  const defaultStats: FreeUsageStats = {
    pdfImportsCount: 0,
    exportsCount: 0,
    maxFreePdfImports: 1,
    maxFreeExports: 1,
  };

  if (typeof window === 'undefined') return defaultStats;

  try {
    const raw = localStorage.getItem(FREE_USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultStats,
        pdfImportsCount: typeof parsed.pdfImportsCount === 'number' ? parsed.pdfImportsCount : 0,
        exportsCount: typeof parsed.exportsCount === 'number' ? parsed.exportsCount : 0,
      };
    }
  } catch (e) {
    // fallback
  }

  return defaultStats;
}

/**
 * Checks if PDF import is allowed under the current plan
 */
export function canImportPdf(): { allowed: boolean; count: number; max: number; reason?: string } {
  const license = getLicenseInfo();
  if (license.tier === 'pro') {
    return { allowed: true, count: 0, max: 9999 };
  }
  const stats = getFreeUsageStats();
  if (stats.pdfImportsCount >= stats.maxFreePdfImports) {
    return {
      allowed: false,
      count: stats.pdfImportsCount,
      max: stats.maxFreePdfImports,
      reason: 'Free Starter plan limit reached: You have used your 1 free PDF import. Upgrade to Pro for unlimited PDF conversions.',
    };
  }
  return { allowed: true, count: stats.pdfImportsCount, max: stats.maxFreePdfImports };
}

/**
 * Records a successful PDF import for free tier tracking
 */
export function recordPdfImport(): void {
  const license = getLicenseInfo();
  if (license.tier === 'pro') return;
  const stats = getFreeUsageStats();
  stats.pdfImportsCount += 1;
  try {
    localStorage.setItem(FREE_USAGE_KEY, JSON.stringify(stats));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(USAGE_EVENT, { detail: stats }));
    }
  } catch (e) {}
}

/**
 * Checks if HTML export is allowed under the current plan
 */
export function canExportHtml(): { allowed: boolean; count: number; max: number; reason?: string } {
  const license = getLicenseInfo();
  if (license.tier === 'pro') {
    return { allowed: true, count: 0, max: 9999 };
  }
  const stats = getFreeUsageStats();
  if (stats.exportsCount >= stats.maxFreeExports) {
    return {
      allowed: false,
      count: stats.exportsCount,
      max: stats.maxFreeExports,
      reason: 'Free Starter plan limit reached: You have already used your 1 free export. Upgrade to Pro for unlimited white-label exports.',
    };
  }
  return { allowed: true, count: stats.exportsCount, max: stats.maxFreeExports };
}

/**
 * Records an HTML export for free tier tracking
 */
export function recordExportHtml(): void {
  const license = getLicenseInfo();
  if (license.tier === 'pro') return;
  const stats = getFreeUsageStats();
  stats.exportsCount += 1;
  try {
    localStorage.setItem(FREE_USAGE_KEY, JSON.stringify(stats));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(USAGE_EVENT, { detail: stats }));
    }
  } catch (e) {}
}

/**
 * Subscribe to free usage stats updates
 */
export function onUsageChange(callback: (stats: FreeUsageStats) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: any) => {
    callback(e.detail || getFreeUsageStats());
  };

  window.addEventListener(USAGE_EVENT, handler);
  return () => window.removeEventListener(USAGE_EVENT, handler);
}

// Known lifetime VIP / Promo codes
const RECOGNIZED_VIP_CODES = [
  'PRO-LIFETIME-2026',
  'APPSUMO-LIFETIME',
  'SUMO-VIP-2026',
  'FLIPBOOK-PRO-LTD',
  'VIP-LIFETIME',
  'EARLY-ADOPTER',
];

/**
 * Validates whether a key looks like a valid AppSumo or Pro License code
 * Examples:
 * - AS-8924-KLA2-901B
 * - AS-XXXX-XXXX
 * - FLIP-7821-MB82-9901
 * - Known VIP promo codes
 */
export function validateLicenseFormat(rawKey: string): { isValid: boolean; source: 'appsumo' | 'direct' | 'promo'; cleanKey: string } {
  const cleanKey = rawKey.trim().toUpperCase();

  if (!cleanKey) {
    return { isValid: false, source: 'direct', cleanKey };
  }

  // 1. Check known VIP Promo codes
  if (RECOGNIZED_VIP_CODES.includes(cleanKey)) {
    return { isValid: true, source: 'promo', cleanKey };
  }

  // 2. Check Gumroad prefix or standard Gumroad license key formats (UUID or 4-part / 5-part keys)
  if (cleanKey.startsWith('GUM-') || cleanKey.startsWith('PRO-')) {
    return { isValid: true, source: 'direct', cleanKey };
  }

  // Standard UUID license format (e.g., A1B2C3D4-E5F6-7890-ABCD-1234567890EF)
  const uuidPattern = /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/;
  if (uuidPattern.test(cleanKey)) {
    return { isValid: true, source: 'direct', cleanKey };
  }

  // 3. Check AppSumo Prefix code (AS-XXXX-XXXX or AS-XXXX-XXXX-XXXX)
  if (cleanKey.startsWith('AS-') && cleanKey.length >= 8) {
    return { isValid: true, source: 'appsumo', cleanKey };
  }

  // 4. Check Standard Flipbook Pro Key (FLIP-XXXX-XXXX or 10+ chars alphanumeric with hyphens)
  if (cleanKey.startsWith('FLIP-') && cleanKey.length >= 10) {
    return { isValid: true, source: 'direct', cleanKey };
  }

  // 5. Check general multi-segment code patterns (e.g. XXXX-XXXX-XXXX or XXXX-XXXX-XXXX-XXXX)
  const codePattern = /^[A-Z0-9]{3,8}(-[A-Z0-9]{3,8}){1,4}$/;
  if (codePattern.test(cleanKey)) {
    return { isValid: true, source: 'direct', cleanKey };
  }

  // Fallback: any valid alphanumeric key at least 10 chars long
  if (/^[A-Z0-9]{10,36}$/.test(cleanKey)) {
    return { isValid: true, source: 'direct', cleanKey };
  }

  return { isValid: false, source: 'direct', cleanKey };
}

/**
 * Get current active license status from local storage
 */
export function getLicenseInfo(): LicenseInfo {
  if (typeof window === 'undefined') {
    return { tier: 'free', planName: 'Free Starter' };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { tier: 'free', planName: 'Free Starter' };
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.tier === 'pro') {
      return {
        tier: 'pro',
        key: parsed.key,
        activatedAt: parsed.activatedAt,
        planName: parsed.source === 'appsumo' ? 'AppSumo Pro Lifetime' : 'Pro Lifetime License',
        source: parsed.source || 'appsumo',
      };
    }
  } catch (e) {
    // Fallback to free if corrupted
  }

  return { tier: 'free', planName: 'Free Starter' };
}

/**
 * Validates and activates a license key
 */
export function activateLicense(rawKey: string): { success: boolean; message: string; info?: LicenseInfo } {
  const check = validateLicenseFormat(rawKey);

  if (!check.isValid) {
    return {
      success: false,
      message: 'Invalid code format. Please check your AppSumo voucher or lifetime license code.',
    };
  }

  const info: LicenseInfo = {
    tier: 'pro',
    key: check.cleanKey,
    activatedAt: new Date().toISOString(),
    planName: check.source === 'appsumo' ? 'AppSumo Pro Lifetime' : 'Pro Lifetime License',
    source: check.source,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    // Dispatch event for instant reactive UI updates
    window.dispatchEvent(new CustomEvent(LICENSE_EVENT, { detail: info }));
    return {
      success: true,
      message: `Congratulations! ${info.planName} successfully activated.`,
      info,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Could not save license locally. Please check browser storage settings.',
    };
  }
}

/**
 * Deactivates license and returns to Free tier
 */
export function deactivateLicense(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent(LICENSE_EVENT, {
      detail: { tier: 'free', planName: 'Free Starter' },
    })
  );
}

/**
 * Plan Feature Limits
 */
export function getPlanLimits(tier?: PlanTier): PlanLimits {
  const currentTier = tier || getLicenseInfo().tier;

  if (currentTier === 'pro') {
    return {
      maxBooks: 9999,
      maxPdfPages: 150, // Optimal for browser canvas memory
      maxPdfImports: 9999, // Unlimited
      maxExports: 9999, // Unlimited
      hasWatermark: false,
      whitelabelExport: true,
      highResExport: true,
      allTemplates: true,
    };
  }

  return {
    maxBooks: 3,
    maxPdfPages: 15, // Free tier limit to protect memory and drive conversions
    maxPdfImports: 1, // Only 1 free PDF import
    maxExports: 1, // Only 1 free HTML export
    hasWatermark: true,
    whitelabelExport: false,
    highResExport: false,
    allTemplates: true,
  };
}

/**
 * Subscribe to license updates
 */
export function onLicenseChange(callback: (info: LicenseInfo) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: any) => {
    callback(e.detail || getLicenseInfo());
  };

  window.addEventListener(LICENSE_EVENT, handler);
  return () => window.removeEventListener(LICENSE_EVENT, handler);
}
