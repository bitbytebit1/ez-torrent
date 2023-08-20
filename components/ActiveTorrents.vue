<script setup>
const { data, refresh } = await useFetch('/api/gettorrents')

const { webui } = useRuntimeConfig().public.transmission

function formatBytes(bytes, decimals = 1) {
  if (!+bytes)
    return '0 Bytes'

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
  <NuxtLink :to="webui">
    <span text-green>{{ formatBytes(data?.downloadSpeed) }}</span> / <span text-red>{{ formatBytes(data?.uploadSpeed) }}</span> / <span text-yellow>{{ data?.activeTorrentCount }}</span>
  </NuxtLink>
</template>
