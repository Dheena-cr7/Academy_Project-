/**
 * Analytics and Marketing Attribution Utility
 * Captures UTM parameters from URL, persists across session,
 * and tracks conversion events for Google Analytics / Meta Pixel.
 */

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

const UTM_STORAGE_KEY = 'kalaivani_utm_params';

/**
 * Capture UTM parameters from current URL and save to sessionStorage
 */
export function captureUtmParameters(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || undefined;
    const utmMedium = urlParams.get('utm_medium') || undefined;
    const utmCampaign = urlParams.get('utm_campaign') || undefined;
    const utmTerm = urlParams.get('utm_term') || undefined;
    const utmContent = urlParams.get('utm_content') || undefined;

    if (utmSource || utmMedium || utmCampaign) {
      const params: UtmParams = {
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
      return params;
    }

    // Return previously saved UTMs from session if available
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch {
    // Graceful fallback if storage is restricted
  }

  return {};
}

/**
 * Retrieve saved UTM parameters to append to form submissions
 */
export function getStoredUtmParameters(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch {
    // Ignore
  }

  return {};
}

/**
 * Track custom conversion events safely
 */
export function trackEvent(eventName: string, eventParams: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    event: eventName,
    ...eventParams,
    timestamp: new Date().toISOString(),
  };

  // Google Tag Manager / GA4 dataLayer
  const win = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push(payload);
  }

  // Google Analytics gtag
  if (typeof win.gtag === 'function') {
    win.gtag('event', eventName, eventParams);
  }

  // Meta Pixel fbq
  if (typeof win.fbq === 'function') {
    win.fbq('trackCustom', eventName, eventParams);
  }

  // Log in development for auditability
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event: ${eventName}]`, payload);
  }
}
