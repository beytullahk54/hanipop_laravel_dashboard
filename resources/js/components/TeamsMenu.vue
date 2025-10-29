<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui'
  import { computed, ref } from 'vue'

  defineProps<{
    collapsed?: boolean
  }>()

  const teams = ref([
    {
      label: 'Hanipop',
      avatar: {
        src: 'https://github.com/vuejs.png',
        alt: 'Hanipop',
      },
    },
  ])
  const selectedTeam = ref(teams.value[0])

  const items = computed<DropdownMenuItem[][]>(() => {
    return [
      teams.value.map((team) => ({
        ...team,
        onSelect() {
          selectedTeam.value = team
        },
      })),
    ]
  })
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
