/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_CONTACT_PHONE: string
  readonly VITE_CONTACT_WEBSITE: string
  readonly VITE_SOCIAL_INSTAGRAM: string
  readonly VITE_SOCIAL_TIKTOK: string
  readonly VITE_SOCIAL_LINKEDIN: string
  readonly VITE_SHOW_NEWSLETTER: string
  readonly VITE_SHOW_CONTACT: string
  readonly VITE_APP_STORE_LINK: string
  readonly VITE_PLAY_STORE_LINK: string
  readonly VITE_APPLE_WATCH_LINK: string
  readonly VITE_ANDROID_WATCH_LINK: string
  readonly VITE_DASHBOARD_LINK: string
  readonly VITE_SHARE_ON_X: string
  readonly VITE_SHARE_ON_LINKEDIN: string
  readonly VITE_SHARE_ON_REDDIT: string
  readonly VITE_SHARE_NATIVE: string
  readonly VITE_LAUNCH_OFFER_ECO_MASTER: string
  readonly VITE_EMAIL_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
