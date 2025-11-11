<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'

  defineOptions({ layout: Layout })
</script>

<template>
  <UDashboardPanel id="subeler">
    <template #header>
      <UDashboardNavbar title="Şubeler" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Şubeler</h1>
        <p class="text-gray-600">Şube bilgilerinizi buradan yönetebilirsiniz.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>
