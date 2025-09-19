<script setup>
const { data, refresh } = useLazyFetch('/api/gettorrents', {
  server: false,
})

const { webui } = useRuntimeConfig().public.transmission

function formatBytes (bytes, decimals = 1) {
  if (!+bytes) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

onMounted(() => {
  const interval = setInterval(() => {
    refresh()
  }, 1000)
})
</script>

<template>
  <div class="py-4">
    <NuxtLink
      :to="webui"
    >
      <span class="text-success">{{ formatBytes(data?.downloadSpeed) }}</span> / <span class="text-error">{{ formatBytes(data?.uploadSpeed) }}</span> / <span class="text-warning">{{ data?.activeTorrentCount }}</span>
    </NuxtLink>
  </div>
</template>
