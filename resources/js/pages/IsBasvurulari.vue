<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'

  defineOptions({ layout: Layout })
</script>

<template>
  <UDashboardPanel id="is-basvurulari">
    <template #header>
      <UDashboardNavbar title="İş Başvuruları" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">İş Başvuruları</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center mb-4">
              <UIcon name="i-lucide-mail" class="w-6 h-6 text-blue-600 mr-3" />
              <h3 class="text-lg font-semibold">Yeni İş Başvuruları</h3>
            </div>
            <p class="text-gray-600">Henüz görüntülenmemiş iş başvuruları</p>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center mb-4">
              <UIcon name="i-lucide-eye" class="w-6 h-6 text-green-600 mr-3" />
              <h3 class="text-lg font-semibold">Görüntülenmiş İş Başvuruları</h3>
            </div>
            <p class="text-gray-600">Daha önce görüntülenmiş iş başvuruları</p>
          </div>
        </div>
        
        <div class="mt-6 text-right">
          <span class="text-sm text-gray-500">Toplam Talep: 0</span>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
