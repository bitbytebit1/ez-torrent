<script setup>
const { data, refresh } = await useFetch('/api/gettorrents')
function formatBytes(bytes, decimals = 1) {
  if (!+bytes)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'Kbs', 'Mbs', 'Gbs', 'Tbs', 'Pbs', 'Ebs', 'Zbs', 'Ybs']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
setInterval(() => {
  refresh()
}, 1000)

function onClick() {
  const path = useRuntimeConfig().public.transmission.webui
  window.location.href = path
}
</script>

<template>
  <div @click="onClick">
    <span text-green>{{ formatBytes(data?.downloadSpeed) }}</span> / <span text-red>{{ formatBytes(data?.uploadSpeed) }}</span> / <span text-yellow>{{ data?.activeTorrentCount }}</span>
  </div>
</template>
