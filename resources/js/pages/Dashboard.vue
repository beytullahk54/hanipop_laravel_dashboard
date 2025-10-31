<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'
  defineOptions({ layout: Layout })
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Hoş geldiniz" />
    </template>

    <template #body>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UCard>
          <template #header>Ürün Sayınız</template>
          <div class="text-3xl font-semibold">{{ $page.props.productCount ?? 0 }}</div>
        </UCard>
        <UCard>
          <template #header>Kategori Sayınız</template>
          <div class="text-3xl font-semibold">{{ $page.props.categoryCount ?? 0 }}</div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
