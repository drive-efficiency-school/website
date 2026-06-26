export const config = {
  // "Last updated" dates for the legal/help pages. Single source of
  // truth — bump the relevant entry when that page's CONTENT changes
  // (these are content-change dates, not build/deploy dates).
  lastUpdated: {
    help: 'June 23, 2026',
    privacy: 'June 26, 2026',
    terms: 'May 27, 2026'
  },
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'contact@efficiver.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '', // Default to empty to hide
    website: import.meta.env.VITE_CONTACT_WEBSITE || 'https://www.efficiver.com'
  },
  socials: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || '',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK || '',
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || ''
  },
  features: {
    newsletter: import.meta.env.VITE_SHOW_NEWSLETTER !== 'false', // Default to true
    contact: import.meta.env.VITE_SHOW_CONTACT !== 'false' // Default to true
  },
  app: {
    ios: import.meta.env.VITE_APP_STORE_LINK || 'https://apps.apple.com/app/efficiver/id6754255974',
    android: import.meta.env.VITE_PLAY_STORE_LINK || '',
    watch: {
      apple: import.meta.env.VITE_APPLE_WATCH_LINK || '',
      android: import.meta.env.VITE_ANDROID_WATCH_LINK || ''
    },
    dashboard: import.meta.env.VITE_DASHBOARD_LINK || ''
  },
  api: {
    baseUrl: import.meta.env.VITE_EMAIL_API_BASE_URL || 'https://email.efficiency.school/api/v1'
  },
  share: {
    x: import.meta.env.VITE_SHARE_ON_X !== 'false',
    linkedin: import.meta.env.VITE_SHARE_ON_LINKEDIN !== 'false',
    reddit: import.meta.env.VITE_SHARE_ON_REDDIT !== 'false',
    native: import.meta.env.VITE_SHARE_NATIVE !== 'false'
  },
  pricing: {
    launchOffer: import.meta.env.VITE_LAUNCH_OFFER_ECO_MASTER !== 'false' // Default to true
  }
}
