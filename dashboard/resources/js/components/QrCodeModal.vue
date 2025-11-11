<script setup lang="ts">
  import { watch, computed } from 'vue'
  import { useQrCode } from '@/composables/useQrCode'

  const props = defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const { qrCodeSvg, qrCodeUrl, firmaAdi, loading, error, generateQrCode, downloadQrCode, clearQrCode } = useQrCode()

  // SVG'yi data URI'ye çevir
  const qrCodeDataUri = computed(() => {
    if (!qrCodeSvg.value) return null
    
    try {
      const svgString = qrCodeSvg.value.trim()
      // Base64 encoding
      const base64 = btoa(unescape(encodeURIComponent(svgString)))
      return `data:image/svg+xml;base64,${base64}`
    } catch (err) {
      console.error('SVG encoding error:', err)
      return null
    }
  })

  // Model value computed
  const modalOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
  })

  watch(() => props.open, (newValue) => {
    if (newValue) {
      // Modal açıldığında QR kod üret
      if (!qrCodeSvg.value) {
        generateQrCode()
      }
    } else {
      // Modal kapandığında temizle
      clearQrCode()
    }
  })

  function handleClose() {
    modalOpen.value = false
  }

  function handleDownload() {
    downloadQrCode()
  }
</script>

<template>
  <UModal 
    v-model:open="modalOpen"
    title="QR Kod Çıktısı"
    description="Firmanızın menü QR kodunu görüntüleyin ve indirin"
    :ui="{ content: 'sm:max-w-lg' }"
  >
    <template #body>
      <div class="flex flex-col items-center justify-center space-y-6 py-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-3">
          <div class="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p class="text-sm text-dimmed">QR kod üretiliyor...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="w-full rounded-lg bg-error/10 p-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="size-5 text-error" />
            <p class="text-sm text-error">{{ error }}</p>
          </div>
        </div>

        <!-- QR Code Display -->
        <template v-else-if="qrCodeSvg && qrCodeUrl">
          <div class="flex flex-col items-center space-y-4 w-full">
            <!-- QR Code Container - img ile göster -->
            <div 
              v-if="qrCodeDataUri"
              class="rounded-lg border-2 border-default bg-white dark:bg-gray-900 p-6 flex items-center justify-center shadow-lg"
            >
              <img
                :src="qrCodeDataUri"
                alt="QR Code"
                class="w-full h-full"
                style="width: 400px; height: 400px; max-width: 100%;"
                @error="(e) => console.error('Image load error:', e)"
              />
            </div>

            <!-- Fallback: innerHTML ile SVG göster -->
            <div 
              v-else
              class="rounded-lg border-2 border-default bg-white dark:bg-gray-900 p-6 flex items-center justify-center shadow-lg"
              style="width: 400px; height: 400px; max-width: 100%;"
            >
              <div
                v-html="qrCodeSvg"
                class="w-full h-full flex items-center justify-center"
              />
            </div>

            <!-- Firma Bilgisi -->
            <div class="w-full space-y-2 text-center">
              <p v-if="firmaAdi" class="text-base font-semibold">{{ firmaAdi }}</p>
              <a
                :href="qrCodeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-primary hover:underline break-all inline-block"
              >
                {{ qrCodeUrl }}
              </a>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else class="w-full text-center py-12">
          <p class="text-sm text-dimmed">QR kod hazırlanıyor...</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <UButton
          label="Kapat"
          color="neutral"
          variant="ghost"
          @click="handleClose"
        />
        <UButton
          v-if="qrCodeSvg && !loading && !error"
          label="İndir"
          icon="i-lucide-download"
          color="primary"
          @click="handleDownload"
        />
      </div>
    </template>
  </UModal>
</template>
