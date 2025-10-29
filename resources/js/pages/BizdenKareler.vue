<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'

  defineOptions({ layout: Layout })
</script>

<template>
  <UDashboardPanel id="bizden-kareler">
    <template #header>
      <UDashboardNavbar title="Bizden Kareler" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Bizden Kareler</h1>
        <p class="text-gray-600">Şirketinizden fotoğrafları ve anları buradan yönetebilirsiniz.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>
