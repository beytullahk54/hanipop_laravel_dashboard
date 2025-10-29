<script setup lang="ts">
  import { logout } from '@/routes'
  import { router } from '@inertiajs/vue3'
  import type { DropdownMenuItem } from '@nuxt/ui'
  import { useColorMode } from '@vueuse/core'

  defineProps<{
    collapsed?: boolean
  }>()

  const colorMode = useColorMode()
  const auth = useAuth()
  const { getInitials } = useInitials()

  const user = computed(() => ({
    name: auth.value.user.name,
    avatar: {
      text: getInitials(auth.value.user.name),
    },
  }))

  const items = computed<DropdownMenuItem[][]>(() => [
    [
      {
        type: 'label',
        label: user.value.name,
        avatar: user.value.avatar,
      },
    ],
    [
      {
        label: 'Profilim',
        icon: 'i-lucide-user',
        to: '/settings/profile',
      },
      {
        label: 'Firma',
        icon: 'i-lucide-building',
        to: '/menu',
      },
    ],
    [
      {
        label: 'Dark mod',
        icon: colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun',
        type: 'checkbox',
        checked: colorMode.value === 'dark',
        onUpdateChecked(checked: boolean) {
          colorMode.value = checked ? 'dark' : 'light'
        },
      },
    ],
    [
      {
        label: 'Çıkış yap',
        icon: 'i-lucide-log-out',
        onSelect: () => handleLogout(),
      },
    ],
  ])

  function handleLogout() {
    router.post(logout().url)
  }
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : auth.user.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />

    <template #chip-leading="{ item }">
      <span
        :style="{
          '--chip-light': `var(--color-${(item as any).chip}-500)`,
          '--chip-dark': `var(--color-${(item as any).chip}-400)`,
        }"
        class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
      />
    </template>
  </UDropdownMenu>
</template>
