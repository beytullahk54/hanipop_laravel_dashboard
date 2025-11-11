import { ref } from 'vue'

interface QrCodeResponse {
  qr_code_svg: string
  url: string
  firma_adi: string
}

const qrCodeSvg = ref<string | null>(null)
const qrCodeUrl = ref<string | null>(null)
const firmaAdi = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useQrCode = () => {
  async function generateQrCode(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      })

      if (!response.ok) {
        throw new Error('QR kod üretilirken bir hata oluştu.')
      }

      const data: QrCodeResponse = await response.json()
      qrCodeSvg.value = data.qr_code_svg
      qrCodeUrl.value = data.url
      firmaAdi.value = data.firma_adi
      
      // Debug
      console.log('QR Code SVG length:', qrCodeSvg.value?.length)
      console.log('QR Code URL:', qrCodeUrl.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'QR kod üretilirken bir hata oluştu.'
      qrCodeSvg.value = null
      qrCodeUrl.value = null
      firmaAdi.value = null
    } finally {
      loading.value = false
    }
  }

  async function downloadQrCode(): Promise<void> {
    if (!qrCodeSvg.value) {
      error.value = 'QR kod henüz oluşturulmadı.'
      return
    }

    try {
      // SVG'yi PNG'ye çevir
      const svgBlob = new Blob([qrCodeSvg.value], { type: 'image/svg+xml' })
      const svgUrl = URL.createObjectURL(svgBlob)

      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          canvas.width = 400
          canvas.height = 400
          ctx?.drawImage(img, 0, 0, 400, 400)
          resolve()
        }
        img.onerror = reject
        img.src = svgUrl
      })

      canvas.toBlob((blob) => {
        if (!blob) {
          error.value = 'PNG oluşturulamadı.'
          return
        }

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${firmaAdi.value ? firmaAdi.value.replace(/\s+/g, '-').toLowerCase() : 'qr-code'}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        window.URL.revokeObjectURL(svgUrl)
        document.body.removeChild(a)
      }, 'image/png')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'QR kod indirilirken bir hata oluştu.'
    }
  }

  function clearQrCode(): void {
    qrCodeSvg.value = null
    qrCodeUrl.value = null
    firmaAdi.value = null
    error.value = null
  }

  return {
    qrCodeSvg,
    qrCodeUrl,
    firmaAdi,
    loading,
    error,
    generateQrCode,
    downloadQrCode,
    clearQrCode,
  }
}

