<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import XIcon from '@/icons/XIcon.vue'
  import LinkedInIcon from '@/icons/LinkedInIcon.vue'
  import RedditIcon from '@/icons/RedditIcon.vue'
  import { config } from '@/lib/config'
  import { MoreHorizontal } from 'lucide-vue-next'

  interface ShareButtonsProps {
    title?: string
    text?: string
    url?: string
  }

  const props = withDefaults(defineProps<ShareButtonsProps>(), {
    title: 'Efficiver - Free Driving Coach',
    // No first-person OUTCOME claim: the site must not put a savings result in
    // the sharer's mouth for something the product does not measure.
    text: 'Efficiver — a driving coach that runs on your phone, no OBD hardware. 🚗',
    url: config.contact.website
  })

  function shareOnTwitter() {
    const tweetText = encodeURIComponent(props.text)
    const tweetUrl = encodeURIComponent(props.url)
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  function shareOnLinkedIn() {
    const linkedInUrl = encodeURIComponent(props.url)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  function shareOnReddit() {
    const redditTitle = encodeURIComponent(props.title)
    const redditUrl = encodeURIComponent(props.url)
    window.open(
      `https://www.reddit.com/submit?url=${redditUrl}&title=${redditTitle}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: props.title,
        text: props.text,
        url: props.url
      })
    }
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const showNativeShare = config.share.native !== false // Default to true if not set
  const hasAnyShare =
    config.share.x || config.share.linkedin || config.share.reddit || (canShare && showNativeShare)
</script>

<template>
  <div v-if="hasAnyShare" class="flex items-center gap-2">
    <span class="text-sm text-muted-foreground mr-2">Share:</span>
    <Button
      v-if="config.share.x"
      variant="outline"
      size="icon"
      class="h-8 w-8 rounded-full"
      aria-label="Share on X (Twitter)"
      @click="shareOnTwitter"
    >
      <XIcon class="h-4 w-4" />
    </Button>
    <Button
      v-if="config.share.linkedin"
      variant="outline"
      size="icon"
      class="h-8 w-8 rounded-full"
      aria-label="Share on LinkedIn"
      @click="shareOnLinkedIn"
    >
      <LinkedInIcon class="h-4 w-4" />
    </Button>
    <Button
      v-if="config.share.reddit"
      variant="outline"
      size="icon"
      class="h-8 w-8 rounded-full"
      aria-label="Share on Reddit"
      @click="shareOnReddit"
    >
      <RedditIcon class="h-4 w-4" />
    </Button>
    <Button
      v-if="canShare && showNativeShare"
      variant="outline"
      size="icon"
      class="h-8 w-8 rounded-full"
      aria-label="Share via native share"
      @click="shareNative"
    >
      <MoreHorizontal class="h-4 w-4" />
    </Button>
  </div>
</template>
