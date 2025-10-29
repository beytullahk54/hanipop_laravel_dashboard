<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const { url } = usePage()
  const toast = useToast()

  const open = ref(false)

  const links = [
    [
      {
        label: 'Anasayfa',
        icon: 'i-lucide-house',
        to: '/dashboard',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Menü',
        icon: 'i-lucide-grid-3x3',
        to: '/menu',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Destek',
        icon: 'i-lucide-headphones',
        to: '/destek',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Müşteri Geri Bildirimleri',
        icon: 'i-lucide-message-circle',
        to: '/musteri-geri-bildirimleri',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'İş Başvuruları',
        icon: 'i-lucide-clipboard-list',
        to: '/is-basvurulari',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Bizden Kareler',
        icon: 'i-lucide-grid-3x3',
        to: '/bizden-kareler',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Şubeler',
        icon: 'i-lucide-building',
        to: '/subeler',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Referanslar',
        icon: 'i-lucide-star',
        to: '/referanslar',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Reklam Banner Yönetimi',
        icon: 'i-lucide-image',
        to: '/reklam-banner-yonetimi',
        onSelect: () => {
          open.value = false
        },
      },
    ],
  ] satisfies NavigationMenuItem[][]

  const cookie = useStorage('cookie-consent', 'pending')
  if (cookie.value !== 'accepted') {
    toast.add({
      title: 'Web sitemizde deneyiminizi geliştirmek için bilgilendirme topluyoruz.',
      duration: 0,
      close: false,
      actions: [
        {
          label: 'Kabul Et',
          color: 'neutral',
          variant: 'outline',
          onClick: () => {
            cookie.value = 'accepted'
          },
        },
        {
          label: 'Reddet',
          color: 'neutral',
          variant: 'ghost',
        },
      ],
    })
  }
</script>

<template>
  <Suspense>
    <UApp>
      <UDashboardGroup unit="rem" storage="local">
        <UDashboardSidebar
          id="default"
          v-model:open="open"
          collapsible
          resizable
          class="bg-elevated/25"
          :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
          <template #header="{ collapsed }">
            <TeamsMenu :collapsed="collapsed" />
          </template>

          <template #default="{ collapsed }">
            <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
          </template>

          <template #footer="{ collapsed }">
            <UserMenu :collapsed="collapsed" />
          </template>
        </UDashboardSidebar>

        <slot />

        <NotificationsSlideover />
      </UDashboardGroup>
    </UApp>
  </Suspense>
</template>
