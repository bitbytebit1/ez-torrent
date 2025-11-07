<script setup lang="ts">
// Table
const columns = [{ accessorKey: 'title', header: '' }, { accessorKey: 'seeds', header: '' }, { id: 'action' }]

// Input
const query = ref('')
const selectedItem = ref('')

const categories = ref(['All', 'Audio', 'Video', 'Applications', 'Games', 'Porn', 'Other', 'Top100'])

const category = ref('All')

const { data, refresh, pending } = useLazyFetch('/api/searchtorrents', {
  method: 'POST',
  body: { query: selectedItem, category },
  immediate: true,
  watch: false,
  server: false,
})

async function addTorrent ($event, torrent) {
  $event.target.style.color = 'blue'
  $fetch('/api/addtorrent', {
    method: 'POST',
    body: { torrent: torrent.original },
  }).then((resp) => {
    $event.target.style.color = resp ? 'green' : 'red'
  })
}

const { data: searchBoxData } = useFetch('/api/searchBox', {
  method: 'POST',
  body: { query },
  transform: (data) => {
    const items = query.value ? [query.value] : []
    data?.description?.forEach((item) => {
      items.push(item['#TITLE'])
    })
    return items
  },
  lazy: true,
})

function onItemSelect (item) {
  selectedItem.value = item
  refresh()
}
</script>

<template>
  <!-- Input -->
  <div
    class="flex items-center justify-center gap-3"
  >
    <USelectMenu
      v-model="selectedItem"
      v-model:search-term="query"
      :reset-search-term-on-blur="false"
      :reset-search-term-on-select="false"
      :items="searchBoxData"
      class="w-full"
      placeholder="Search"
      ignore-filter
      icon="i-heroicons-magnifying-glass-20-solid"
      @update:model-value="onItemSelect"
    />
    <USelect
      v-model="category"
      class="w-48"
      :items="categories"
      @update:model-value="refresh"
    />
  </div>
  <!-- Table -->
  <UTable
    :data="data"
    :loading="pending"
    class="max-w-screen"
    :columns="columns"
    :ui="{
      td: 'p-2 md:p-4',
    }"
  >
    <template #title-cell="{ row }">
      <div
        class="whitespace-break-spaces text-left dark:text-white text-black"
        style="word-break: break-word;"
      >
        {{ row.original.title }}
      </div>
      <div class="pt-1 text-grey text-left flex items-center divide-x divide-gray-500/40 [&>*]:h-5 ">
        <span class="pr-2">{{ row.original.size }}</span>
        <span class="px-2">{{ row.original.time }}</span>

        <!-- game-icons-pirate-flag -->
        <template v-if="row.original.id">
          <a
            :href="`https://thepiratebay10.info/torrent/${row.original.id}/`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center h-full px-2"
          >
            <UIcon
              name="i-game-icons-pirate-flag"
              class="size-3 "
            />
          </a>
        </template>
        <template v-if="['trusted', 'vip'].includes(row.original.status)">
          <span class="px-2 flex items-center h-full">
            <UIcon
              :name="row.original.status === 'trusted' ? 'i-codicon-workspace-trusted' : 'i-mdi-crown'"
              class="size-3 text-green"
            />
          </span>
        </template>
        <template v-if="row.original.imdb">
          <a
            :href="`https://www.imdb.com/title/${row.original.imdb}/`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center h-full px-2"
          >
            <UIcon
              name="bx-bxl-imdb"
              class="size-3 text-yellow"
            />
          </a>
        </template>
      </div>
    </template>
    <template #seeds-cell="{ row }">
      <div class="text-primary">
        {{ row.original.seeds }}
      </div>
      <div class="text-left text-error">
        {{ row.original.peers }}
      </div>
    </template>
    <template #action-cell="{ row }">
      <UButton
        color="grey"
        variant="ghost"
        icon="i-carbon-download"
        @click="addTorrent($event, row)"
      />
    </template>
  </UTable>
</template>
