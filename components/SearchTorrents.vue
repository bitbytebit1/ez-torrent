<script setup lang="ts">
// Table
const columns = [{ key: 'title', label: '' }, { key: 'seeds', label: '' }, { key: 'action', label: '' }]

// Input
const query = ref('')

const { data, refresh, pending } = await useFetch('/api/searchtorrents', {
  method: 'POST',
  body: { query },
  immediate: true,
  watch: false,
})

function go() {
  if (query.value)
    refresh()
}

async function addTorrent($event, torrent) {
  $event.target.style.color = 'blue'
  $fetch('/api/addtorrent', {
    method: 'POST',
    body: { torrent },
  }).then((resp) => {
    $event.target.style.color = resp ? 'green' : 'red'
  })
}
</script>

<template>
  <div
    flex flex-col items-center
    justify-center
  >
    <!-- Input -->
    <div
      flex items-center justify-center
      p="y-2" m="t-5"
    >
      <UInput
        v-model="query" placeholder="Search" icon="i-heroicons-magnifying-glass-20-solid"
        @keydown.enter="go"
      />
    </div>
    <!-- {{ Object.keys(data?.[0]) }} -->
    <UTable :columns="columns" :loading="pending" max-w-screen :rows="data">
      <template #title-data="{ row }">
        <div whitespace-break-spaces text-left text-white style="word-break: break-word;">
          {{ row.title }}
        </div>
        <div text-grey text-left>
          <span>{{ row.provider }}</span> | <span>{{ row.size }}</span>
        </div>
      </template>
      <template #seeds-data="{ row }">
        <span text-green>{{ row.seeds }}</span>{{ row.peers ? ' / ' : '' }}<span text-left text-red>{{ row.peers }}</span>
      </template>
      <template #action-data="{ row }">
        <button i-carbon-download @click="addTorrent($event, row)">
          was
        </button>
      </template>
    </UTable>
  </div>
</template>
