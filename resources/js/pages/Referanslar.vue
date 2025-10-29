<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'

  defineOptions({ layout: Layout })
</script>

<template>
  <UDashboardPanel id="referanslar">
    <template #header>
      <UDashboardNavbar title="Referanslar" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Referanslar</h1>
        <p class="text-gray-600">Referans bilgilerinizi buradan yönetebilirsiniz.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>
