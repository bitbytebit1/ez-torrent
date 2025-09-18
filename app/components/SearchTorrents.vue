<script setup lang="ts">
// Table
const columns = [{ accessorKey: 'title', header: '' }, { accessorKey: 'seeds', header: '' }, { id: 'action' }]

// Input
const query = ref('')
const categories = ref(['All', 'Audio', 'Video', 'Applications', 'Games', 'Porn', 'Other', 'Top100'])

const category = ref('All')

const { data, refresh, pending } = useLazyFetch('/api/searchtorrents', {
  method: 'POST',
  body: { query, category },
  immediate: true,
  watch: false,
})

async function addTorrent ($event, torrent) {
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
    class="flex flex-col items-center justify-center"
  >
    <!-- Input -->
    <div
      class="flex items-center justify-center py-2 mt-5 gap-3"
    >
      <UInput
        v-model="query"
        class="w-full"
        placeholder="Search"
        icon="i-heroicons-magnifying-glass-20-solid"
        @keydown.enter="refresh"
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
    >
      <template #title-cell="{ row }">
        <div
          class="whitespace-break-spaces text-left dark:text-white text-black"
          style="word-break: break-word;"
        >
          {{ row.original.title }}
        </div>
        <div
          class="text-grey text-left flex items-center gap-1"
        >
          <span>{{ row.original.size }}</span> | <span>{{ row.original.time }}</span> |

          <UIcon
            v-if="row.original.status === 'trusted'"
            name="i-codicon-workspace-trusted"
            color="green"
            class="size-3 text-green"
          />

          <!-- VIP icon -->
          <UIcon
            v-if="row.original.status === 'vip'"
            name="i-mdi-crown"
            color="yellow"
            class="size-3 text-yellow"
          />
        </div>
      </template>
      <template #seeds-cell="{ row }">
        <span class="text-primary">{{ row.original.seeds }}</span> / <span class="text-left text-error">{{ row.original.peers }}</span>
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
  </div>
</template>
