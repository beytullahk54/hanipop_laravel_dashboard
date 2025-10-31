<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
  import { computed, onMounted, ref } from 'vue'

  defineOptions({ layout: Layout })

  interface MusteriBildirim {
    id: number
    bildirim_baslik: string
    bildirim_aciklama: string
    bildirim_telefon: string | null
    masa_no: string | null
    firma_id: string | null
    durum: string | null
    created_at: string
    updated_at: string
    firma?: {
      id: number
      firma_adi: string
    }
  }

  interface Props {
    bildirimler?: {
      data: MusteriBildirim[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }

  const props = defineProps<Props>()

  const toast = useToast()
  const bildirimler = ref<MusteriBildirim[]>(props.bildirimler?.data || [])
  const selectedBildirim = ref<MusteriBildirim | null>(null)
  const loading = ref(false)

  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('lg')

  const isBildirimPanelOpen = computed({
    get() {
      return !!selectedBildirim.value
    },
    set(value: boolean) {
      if (!value) {
        selectedBildirim.value = null
      }
    },
  })

  const durumColors: Record<string, 'warning' | 'info' | 'success' | 'neutral' | 'error' | 'primary'> = {
    beklemede: 'warning',
    inceleniyor: 'info',
    cozuldu: 'success',
    kapatildi: 'neutral',
    iptal: 'error',
  }

  const durumLabels: Record<string, string> = {
    beklemede: 'Beklemede',
    inceleniyor: 'İnceleniyor',
    cozuldu: 'Çözüldü',
    kapatildi: 'Kapatıldı',
    iptal: 'İptal',
  }

  async function loadBildirimler() {
    loading.value = true
    try {
      const response = await fetch('/api/musteri-bildirimleri', {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      })
      const result = await response.json()
      if (result.bildirimler) {
        bildirimler.value = result.bildirimler.data || []
      }
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error)
      toast.add({ 
        title: 'Hata', 
        description: 'Bildirimler yüklenirken bir hata oluştu', 
        color: 'error' 
      })
    } finally {
      loading.value = false
    }
  }

  function selectBildirim(bildirim: MusteriBildirim) {
    selectedBildirim.value = bildirim
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
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  onMounted(() => {
    loadBildirimler()
  })
</script>

<template>
  <UDashboardPanel id="musteri-bildirimleri" :default-size="25" :min-size="20" :max-size="30" resizable>
    <template #header>
      <UDashboardNavbar title="Müşteri Bildirimleri">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto divide-y divide-border">
          <div 
            v-if="bildirimler.length === 0 && !loading"
            class="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <UIcon name="i-lucide-bell" class="size-16 text-dimmed mb-4" />
            <p class="text-dimmed">Henüz müşteri bildirimi bulunmuyor</p>
          </div>
          
          <button
            v-for="bildirim in bildirimler"
            :key="bildirim.id"
            :class="[
              'w-full p-4 text-left hover:bg-muted/50 transition-colors',
              selectedBildirim?.id === bildirim.id && 'bg-muted'
            ]"
            @click="selectBildirim(bildirim)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold truncate">{{ bildirim.bildirim_baslik }}</h3>
                  <UBadge 
                    v-if="bildirim.durum"
                    :color="durumColors[bildirim.durum] || 'neutral'"
                    :label="durumLabels[bildirim.durum] || bildirim.durum"
                    variant="subtle"
                    size="xs"
                  />
                </div>
                <p class="text-sm text-dimmed line-clamp-2 mb-2">
                  {{ bildirim.bildirim_aciklama }}
                </p>
                <div class="flex items-center gap-2 text-xs text-dimmed flex-wrap">
                  <span>{{ formatDate(bildirim.created_at) }}</span>
                  <span v-if="bildirim.masa_no">•</span>
                  <span v-if="bildirim.masa_no">Masa: {{ bildirim.masa_no }}</span>
                  <span v-if="bildirim.bildirim_telefon">•</span>
                  <span v-if="bildirim.bildirim_telefon">{{ bildirim.bildirim_telefon }}</span>
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

  <!-- Detail Panel -->
  <UDashboardPanel v-if="selectedBildirim" id="bildirim-detail" class="flex-1">
    <template #header>
      <UDashboardNavbar :title="selectedBildirim.bildirim_baslik">
        <template #trailing>
          <UBadge 
            v-if="selectedBildirim.durum"
            :color="durumColors[selectedBildirim.durum] || 'neutral'"
            :label="durumLabels[selectedBildirim.durum] || selectedBildirim.durum"
            variant="subtle"
          />
        </template>
        <template #right>
          <UButton 
            icon="i-lucide-x" 
            color="neutral" 
            variant="ghost" 
            size="xs"
            @click="selectedBildirim = null"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div class="space-y-4">
            <!-- Bildirim İçeriği -->
            <div class="bg-muted rounded-lg p-4">
              <p class="text-sm whitespace-pre-wrap">{{ selectedBildirim.bildirim_aciklama }}</p>
            </div>
          </div>
        </div>

        <!-- Bildirim Bilgileri -->
        <div class="border-t p-4 space-y-3">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-dimmed">Durum:</span>
              <div class="mt-1">
                <UBadge 
                  v-if="selectedBildirim.durum"
                  :color="durumColors[selectedBildirim.durum] || 'neutral'"
                  :label="durumLabels[selectedBildirim.durum] || selectedBildirim.durum"
                  variant="subtle"
                />
                <span v-else class="font-medium">-</span>
              </div>
            </div>
            <div>
              <span class="text-dimmed">Oluşturulma:</span>
              <p class="mt-1 font-medium">{{ new Date(selectedBildirim.created_at).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}</p>
            </div>
            <div v-if="selectedBildirim.masa_no">
              <span class="text-dimmed">Masa No:</span>
              <p class="mt-1 font-medium">{{ selectedBildirim.masa_no }}</p>
            </div>
            <div v-if="selectedBildirim.bildirim_telefon">
              <span class="text-dimmed">Telefon:</span>
              <p class="mt-1 font-medium">{{ selectedBildirim.bildirim_telefon }}</p>
            </div>
            <div v-if="selectedBildirim.firma">
              <span class="text-dimmed">Firma:</span>
              <p class="mt-1 font-medium">{{ selectedBildirim.firma.firma_adi }}</p>
            </div>
            <div v-if="selectedBildirim.firma_id && !selectedBildirim.firma">
              <span class="text-dimmed">Firma ID:</span>
              <p class="mt-1 font-medium">{{ selectedBildirim.firma_id }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <div v-else class="hidden flex-1 items-center justify-center lg:flex">
    <div class="text-center">
      <UIcon name="i-lucide-bell" class="size-32 text-dimmed mb-4" />
      <p class="text-dimmed">Bir bildirim seçin</p>
    </div>
  </div>

  <USlideover v-if="isMobile" v-model:open="isBildirimPanelOpen">
    <template #content>
      <UDashboardPanel v-if="selectedBildirim" id="bildirim-detail-mobile">
        <template #header>
          <UDashboardNavbar :title="selectedBildirim.bildirim_baslik">
            <template #trailing>
              <UBadge 
                v-if="selectedBildirim.durum"
                :color="durumColors[selectedBildirim.durum] || 'neutral'"
                :label="durumLabels[selectedBildirim.durum] || selectedBildirim.durum"
                variant="subtle"
              />
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <div class="flex flex-col h-full">
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <div class="bg-muted rounded-lg p-4">
                <p class="text-sm whitespace-pre-wrap">{{ selectedBildirim.bildirim_aciklama }}</p>
              </div>
            </div>

            <div class="border-t p-4 space-y-3">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-dimmed">Durum:</span>
                  <div class="mt-1">
                    <UBadge 
                      v-if="selectedBildirim.durum"
                      :color="durumColors[selectedBildirim.durum] || 'neutral'"
                      :label="durumLabels[selectedBildirim.durum] || selectedBildirim.durum"
                      variant="subtle"
                    />
                    <span v-else class="font-medium">-</span>
                  </div>
                </div>
                <div>
                  <span class="text-dimmed">Oluşturulma:</span>
                  <p class="mt-1 font-medium">{{ new Date(selectedBildirim.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) }}</p>
                </div>
                <div v-if="selectedBildirim.masa_no">
                  <span class="text-dimmed">Masa No:</span>
                  <p class="mt-1 font-medium">{{ selectedBildirim.masa_no }}</p>
                </div>
                <div v-if="selectedBildirim.bildirim_telefon">
                  <span class="text-dimmed">Telefon:</span>
                  <p class="mt-1 font-medium">{{ selectedBildirim.bildirim_telefon }}</p>
                </div>
                <div v-if="selectedBildirim.firma">
                  <span class="text-dimmed">Firma:</span>
                  <p class="mt-1 font-medium">{{ selectedBildirim.firma.firma_adi }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UDashboardPanel>
    </template>
  </USlideover>
</template>
