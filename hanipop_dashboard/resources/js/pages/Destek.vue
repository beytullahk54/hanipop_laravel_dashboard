<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
  import { computed, onMounted, reactive, ref } from 'vue'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import * as z from 'zod'

  defineOptions({ layout: Layout })

  interface Destek {
    id: number
    talep_baslik: string
    talep_icerik: string
    status: string
    user_id: number
    created_at: string
    updated_at: string
    user?: {
      id: number
      name: string
      email: string
    }
  }

  interface Props {
    destekler?: {
      data: Destek[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }

  const props = defineProps<Props>()

  const schema = z.object({
    talep_baslik: z.string().min(3, 'Başlık en az 3 karakter olmalıdır'),
    talep_icerik: z.string().min(10, 'İçerik en az 10 karakter olmalıdır'),
  })

  type Schema = z.output<typeof schema>

  const state = reactive<Partial<Schema>>({
    talep_baslik: undefined,
    talep_icerik: undefined,
  })

  const toast = useToast()
  const open = ref(false)
  const destekler = ref<Destek[]>(props.destekler?.data || [])
  const selectedDestek = ref<Destek | null>(null)
  const loading = ref(false)

  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('lg')

  const isDestekPanelOpen = computed({
    get() {
      return !!selectedDestek.value
    },
    set(value: boolean) {
      if (!value) {
        selectedDestek.value = null
      }
    },
  })

  const statusColors: Record<string, 'warning' | 'info' | 'success' | 'neutral' | 'error' | 'primary'> = {
    beklemede: 'warning',
    inceleniyor: 'info',
    cozuldu: 'success',
    kapandi: 'neutral',
  }

  const statusLabels: Record<string, string> = {
    beklemede: 'Beklemede',
    inceleniyor: 'İnceleniyor',
    cozuldu: 'Çözüldü',
    kapandi: 'Kapatıldı',
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
      const response = await fetch('/api/destek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(event.data),
      })

      const result = await response.json()
      
      if (response.ok) {
        toast.add({ 
          title: 'Başarılı', 
          description: 'Destek talebi başarıyla oluşturuldu', 
          color: 'success' 
        })
        open.value = false
        state.talep_baslik = undefined
        state.talep_icerik = undefined
        await loadDestekler()
        if (result.destek) {
          selectedDestek.value = result.destek
        }
      } else {
        toast.add({ 
          title: 'Hata', 
          description: result.message || 'Bir hata oluştu', 
          color: 'error' 
        })
      }
    } catch (error) {
      toast.add({ 
        title: 'Hata', 
        description: 'Bir hata oluştu', 
        color: 'error' 
      })
    } finally {
      loading.value = false
    }
  }

  async function loadDestekler() {
    loading.value = true
    try {
      const response = await fetch('/api/destek', {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      })
      const result = await response.json()
      if (result.destekler) {
        destekler.value = result.destekler.data || []
      }
    } catch (error) {
      console.error('Destekler yüklenirken hata:', error)
    } finally {
      loading.value = false
    }
  }

  function selectDestek(destek: Destek) {
    selectedDestek.value = destek
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes} dakika önce`
    if (hours < 24) return `${hours} saat önce`
    if (days < 7) return `${days} gün önce`
    return date.toLocaleDateString('tr-TR')
  }

  onMounted(() => {
    loadDestekler()
  })
</script>

<template>
  <UDashboardPanel id="destek" :default-size="25" :min-size="20" :max-size="30" resizable>
    <template #header>
      <UDashboardNavbar title="Destek Taleplerim">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
        <template #right>
          <UModal v-model:open="open" title="Yeni Destek Talebi" description="Yeni bir destek talebi oluşturun">
            <UButton label="Yeni Talep" icon="i-lucide-plus" color="primary" />
            <template #body>
              <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Talep Başlığı" name="talep_baslik">
                  <UInput 
                    v-model="state.talep_baslik" 
                    placeholder="Talep başlığını girin" 
                    class="w-full" 
                  />
                </UFormField>
                <UFormField label="Talep İçeriği" name="talep_icerik">
                  <UTextarea 
                    v-model="state.talep_icerik" 
                    placeholder="Talep içeriğini detaylı olarak açıklayın" 
                    class="w-full"
                    :rows="6"
                  />
                </UFormField>
                <div class="flex justify-end gap-2">
                  <UButton 
                    label="İptal" 
                    color="neutral" 
                    variant="subtle" 
                    @click="open = false" 
                    :disabled="loading"
                  />
                  <UButton 
                    label="Oluştur" 
                    color="primary" 
                    variant="solid" 
                    type="submit"
                    :loading="loading"
                  />
                </div>
              </UForm>
            </template>
          </UModal>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto divide-y divide-border">
          <div 
            v-if="destekler.length === 0 && !loading"
            class="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <UIcon name="i-lucide-message-circle" class="size-16 text-dimmed mb-4" />
            <p class="text-dimmed">Henüz destek talebiniz bulunmuyor</p>
            <UButton 
              label="İlk Talebi Oluştur" 
              color="primary" 
              variant="subtle" 
              class="mt-4"
              @click="open = true"
            />
          </div>
          
          <button
            v-for="destek in destekler"
            :key="destek.id"
            :class="[
              'w-full p-4 text-left hover:bg-muted/50 transition-colors',
              selectedDestek?.id === destek.id && 'bg-muted'
            ]"
            @click="selectDestek(destek)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold truncate">{{ destek.talep_baslik }}</h3>
                  <UBadge 
                    :color="statusColors[destek.status] || 'neutral'"
                    :label="statusLabels[destek.status] || destek.status"
                    variant="subtle"
                    size="xs"
                  />
                </div>
                <p class="text-sm text-dimmed line-clamp-2 mb-2">
                  {{ destek.talep_icerik }}
                </p>
                <div class="flex items-center gap-2 text-xs text-dimmed">
                  <span>{{ formatDate(destek.created_at) }}</span>
                  <span v-if="destek.user">•</span>
                  <span v-if="destek.user">{{ destek.user.name }}</span>
                </div>
              </div>
            </div>
          </button>
          
          <div v-if="loading" class="p-8 text-center">
            <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-dimmed mx-auto" />
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Chat Panel -->
  <UDashboardPanel v-if="selectedDestek" id="destek-detail" class="flex-1">
    <template #header>
      <UDashboardNavbar :title="selectedDestek.talep_baslik">
        <template #trailing>
          <UBadge 
            :color="statusColors[selectedDestek.status] || 'neutral'"
            :label="statusLabels[selectedDestek.status] || selectedDestek.status"
            variant="subtle"
          />
        </template>
        <template #right>
          <UButton 
            icon="i-lucide-x" 
            color="neutral" 
            variant="ghost" 
            size="xs"
            @click="selectedDestek = null"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <!-- Chat Messages Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div class="space-y-4">
            <!-- Initial Message (Talep İçeriği) -->
            <div class="flex gap-3">
              <UAvatar 
                :src="selectedDestek.user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${selectedDestek.user.email}` : undefined"
                :alt="selectedDestek.user?.name || 'Kullanıcı'"
                size="sm"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-sm">{{ selectedDestek.user?.name || 'Kullanıcı' }}</span>
                  <span class="text-xs text-dimmed">{{ formatDate(selectedDestek.created_at) }}</span>
                </div>
                <div class="bg-muted rounded-lg p-4">
                  <p class="text-sm whitespace-pre-wrap">{{ selectedDestek.talep_icerik }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Info -->
        <div class="border-t p-4 space-y-3">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-dimmed">Durum:</span>
              <div class="mt-1">
                <UBadge 
                  :color="statusColors[selectedDestek.status] || 'neutral'"
                  :label="statusLabels[selectedDestek.status] || selectedDestek.status"
                  variant="subtle"
                />
              </div>
            </div>
            <div>
              <span class="text-dimmed">Oluşturulma:</span>
              <p class="mt-1 font-medium">{{ new Date(selectedDestek.created_at).toLocaleDateString('tr-TR') }}</p>
            </div>
            <div>
              <span class="text-dimmed">Kullanıcı:</span>
              <p class="mt-1 font-medium">{{ selectedDestek.user?.name || 'Bilinmeyen' }}</p>
            </div>
            <div>
              <span class="text-dimmed">E-posta:</span>
              <p class="mt-1 font-medium">{{ selectedDestek.user?.email || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <div v-else class="hidden flex-1 items-center justify-center lg:flex">
    <div class="text-center">
      <UIcon name="i-lucide-message-circle" class="size-32 text-dimmed mb-4" />
      <p class="text-dimmed">Bir destek talebi seçin</p>
    </div>
  </div>

  <USlideover v-if="isMobile" v-model:open="isDestekPanelOpen">
    <template #content>
      <UDashboardPanel v-if="selectedDestek" id="destek-detail-mobile">
        <template #header>
          <UDashboardNavbar :title="selectedDestek.talep_baslik">
            <template #trailing>
              <UBadge 
                :color="statusColors[selectedDestek.status] || 'neutral'"
                :label="statusLabels[selectedDestek.status] || selectedDestek.status"
                variant="subtle"
              />
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <div class="flex flex-col h-full">
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <div class="flex gap-3">
                <UAvatar 
                  :src="selectedDestek.user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${selectedDestek.user.email}` : undefined"
                  :alt="selectedDestek.user?.name || 'Kullanıcı'"
                  size="sm"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-sm">{{ selectedDestek.user?.name || 'Kullanıcı' }}</span>
                    <span class="text-xs text-dimmed">{{ formatDate(selectedDestek.created_at) }}</span>
                  </div>
                  <div class="bg-muted rounded-lg p-4">
                    <p class="text-sm whitespace-pre-wrap">{{ selectedDestek.talep_icerik }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t p-4 space-y-3">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-dimmed">Durum:</span>
                  <div class="mt-1">
                    <UBadge 
                      :color="statusColors[selectedDestek.status] || 'neutral'"
                      :label="statusLabels[selectedDestek.status] || selectedDestek.status"
                      variant="subtle"
                    />
                  </div>
                </div>
                <div>
                  <span class="text-dimmed">Oluşturulma:</span>
                  <p class="mt-1 font-medium">{{ new Date(selectedDestek.created_at).toLocaleDateString('tr-TR') }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UDashboardPanel>
    </template>
  </USlideover>
</template>
