<script setup lang="ts">
  import Layout from '@/layouts/Default.vue'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import { reactive, ref, computed } from 'vue'
  import * as z from 'zod'
  import { router } from '@inertiajs/vue3'
  import { useSortable } from '@vueuse/integrations/useSortable'

  defineOptions({ layout: Layout })

  // Props from controller
  const props = defineProps<{
    firma: any
    kategoriler: any[]
    urunler: any[]
    selectedKategori: any
    currentLanguage: string
    availableLanguages: Array<{code: string, name: string}>
  }>()


  // Reactive data
  const selectedCategory = ref(props.selectedKategori)
  const products = ref(props.urunler)
  const selectedProduct = ref<any>(null)
  const isEditModalOpen = ref(false)
  const isLoading = ref(false)
  const currentLanguage = ref(props.currentLanguage)
  
  // Kategori yönetimi
  const isAddCategoryModalOpen = ref(false)
  const isEditCategoryModalOpen = ref(false)
  const selectedCategoryForEdit = ref<any>(null)
  
  // Kategori form state
  const categoryState = reactive({
    kategori_adi: '',
  })

  // JSON parse fonksiyonu
  function parseJsonField(field: any, language: string): string {
    if (!field) return ''
    
    // Eğer zaten obje ise direkt kullan
    if (typeof field === 'object') {
      return field[language] || field.tr || field.en || ''
    }
    
    // String ise JSON parse et
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field)
        return parsed[language] || parsed.tr || parsed.en || field
      } catch {
        return field
      }
    }
    
    return ''
  }

  // HTML etiketlerini temizleme fonksiyonu
  function stripHtmlTags(html: string): string {
    if (!html) return ''
    
    // HTML etiketlerini kaldır
    const stripped = html.replace(/<[^>]*>/g, '')
    
    // HTML entity'lerini decode et
    const decoded = stripped
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
    
    return decoded.trim()
  }

  // Dil değiştirme
  function changeLanguage(lang: string | Event) {
    const language = typeof lang === 'string' ? lang : (lang.target as HTMLSelectElement).value
    currentLanguage.value = language
    // Sayfayı yeniden yükle
    window.location.href = `/menu?lang=${language}`
  }

  // Dil dropdown items
  const languageItems = computed(() => [
    props.availableLanguages.map(lang => ({
      label: lang.name,
      onSelect: () => changeLanguage(lang.code)
    }))
  ])

  // Mevcut dil adını getir
  function getCurrentLanguageName() {
    const currentLang = props.availableLanguages.find(lang => lang.code === currentLanguage.value)
    return currentLang?.name || 'Türkçe'
  }

  // Form şeması
  const schema = z.object({
    urun_adi: z.string().min(2, 'Ürün adı en az 2 karakter olmalı'),
    urun_aciklama: z.string().min(1, 'Açıklama gerekli'),
    urun_fiyati: z.string().optional(),
    paket_urun_fiyati: z.string().optional(),
  })

  type Schema = z.output<typeof schema>

  const state = reactive<Partial<Schema>>({
    urun_adi: undefined,
    urun_aciklama: undefined,
    urun_fiyati: undefined,
    paket_urun_fiyati: undefined,
  })

  const toast = useToast()

  // Kategori seçimi
  async function selectCategory(category: any) {
    if (selectedCategory.value?.id === category.id) return
    
    selectedCategory.value = category
    isLoading.value = true
    
    try {
      const response = await fetch(`/api/menu/products-by-category?kategori_id=${category.id}`, {
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      const data = await response.json()
      products.value = data.urunler
    } catch (error) {
      toast.add({
        title: 'Hata',
        description: 'Ürünler yüklenirken bir hata oluştu.',
        color: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Ürün düzenleme
  function editProduct(product: any) {
    selectedProduct.value = product
    
    // JSON formatını düzelt ve HTML etiketlerini temizle
    const productName = parseJsonField(product.urun_adi, currentLanguage.value)
    const productDescription = stripHtmlTags(parseJsonField(product.urun_aciklama, currentLanguage.value))
    
    state.urun_adi = productName
    state.urun_aciklama = productDescription
    state.urun_fiyati = product.urun_fiyati
    state.paket_urun_fiyati = product.paket_urun_fiyati
    isEditModalOpen.value = true
  }

  // CSRF token al
  function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
  }

  // Form gönderimi
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (!selectedProduct.value) return

    try {
      const csrfToken = getCsrfToken()
      console.log('CSRF Token:', csrfToken) // Debug için
      
      const response = await fetch(`/api/menu/product/${selectedProduct.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(event.data)
      })

      if (response.ok) {
        const data = await response.json()
        
        // Local state'i güncelle
        const productIndex = products.value.findIndex(p => p.id === selectedProduct.value!.id)
        if (productIndex !== -1) {
          products.value[productIndex] = data.urun
        }

        toast.add({ 
          title: 'Başarılı', 
          description: data.message, 
          color: 'success' 
        })
        
        isEditModalOpen.value = false
        selectedProduct.value = null
        resetForm()
      } else {
        throw new Error('Güncelleme başarısız')
      }
    } catch (error) {
      toast.add({
        title: 'Hata',
        description: 'Ürün güncellenirken bir hata oluştu.',
        color: 'error'
      })
    }
  }

  // Modal kapatma
  function closeModal() {
    isEditModalOpen.value = false
    selectedProduct.value = null
    resetForm()
  }

  // Form sıfırlama
  function resetForm() {
    state.urun_adi = undefined
    state.urun_aciklama = undefined
    state.urun_fiyati = undefined
    state.paket_urun_fiyati = undefined
  }

  // Fiyat formatı
  function formatPrice(price: string | null) {
    if (!price) return 'Fiyat belirtilmemiş'
    return `₺${price}`
  }

  // Kategori yönetimi fonksiyonları
  function openAddCategoryModal() {
    categoryState.kategori_adi = ''
    isAddCategoryModalOpen.value = true
  }

  function openEditCategoryModal(kategori: any) {
    selectedCategoryForEdit.value = kategori
    categoryState.kategori_adi = parseJsonField(kategori.kategori_adi, currentLanguage.value)
    isEditCategoryModalOpen.value = true
  }

  async function onSubmitCategory() {
    try {
      const url = selectedCategoryForEdit.value 
        ? `/api/menu/category/${selectedCategoryForEdit.value.id}`
        : '/api/menu/category'
      
      const method = selectedCategoryForEdit.value ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(categoryState)
      })

      if (response.ok) {
        const data = await response.json()
        toast.add({ 
          title: 'Başarılı', 
          description: data.message, 
          color: 'success' 
        })
        
        // Sayfayı yeniden yükle
        window.location.reload()
      } else {
        throw new Error('İşlem başarısız')
      }
    } catch (error) {
      toast.add({
        title: 'Hata',
        description: 'Kategori işlemi sırasında bir hata oluştu.',
        color: 'error'
      })
    }
  }

  function closeCategoryModals() {
    isAddCategoryModalOpen.value = false
    isEditCategoryModalOpen.value = false
    selectedCategoryForEdit.value = null
    categoryState.kategori_adi = ''
  }

  // Drag & Drop fonksiyonları
  const draggedIndex = ref<number | null>(null)

  function handleDragStart(event: DragEvent, index: number) {
    draggedIndex.value = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/html', '')
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  function handleDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault()
    
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
      return
    }

    // Ürünleri yeniden sırala
    const draggedProduct = products.value[draggedIndex.value]
    products.value.splice(draggedIndex.value, 1)
    products.value.splice(dropIndex, 0, draggedProduct)

    // Sunucuya sıralamayı gönder
    updateProductOrder()
    
    draggedIndex.value = null
  }

  // Kategori Drag & Drop fonksiyonları
  const draggedCategoryIndex = ref<number | null>(null)

  function handleCategoryDragStart(event: DragEvent, index: number) {
    draggedCategoryIndex.value = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/html', '')
    }
  }

  function handleCategoryDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  function handleCategoryDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault()
    
    if (draggedCategoryIndex.value === null || draggedCategoryIndex.value === dropIndex) {
      return
    }

    // Kategorileri yeniden sırala
    const draggedCategory = props.kategoriler[draggedCategoryIndex.value]
    props.kategoriler.splice(draggedCategoryIndex.value, 1)
    props.kategoriler.splice(dropIndex, 0, draggedCategory)

    // Sunucuya sıralamayı gönder
    updateCategoryOrder()
    
    draggedCategoryIndex.value = null
  }

  // Sıralama fonksiyonları
  async function updateProductOrder() {
    try {
      const productsData = products.value.map((product, index) => ({
        id: product.id,
        order: index + 1
      }))

      console.log('Sending product order update:', productsData) // Debug

      const csrfToken = getCsrfToken()
      console.log('CSRF Token:', csrfToken) // Debug

      const response = await fetch('/api/menu/products/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ products: productsData })
      })

      console.log('Response status:', response.status) // Debug

      if (response.ok) {
        const data = await response.json()
        console.log('Success response:', data) // Debug
        toast.add({
          title: 'Başarılı',
          description: 'Ürün sıralaması güncellendi.',
          color: 'success'
        })
      } else {
        const errorData = await response.text()
        console.error('Error response:', errorData) // Debug
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }
    } catch (error) {
      console.error('Update product order error:', error) // Debug
      toast.add({
        title: 'Hata',
        description: 'Sıralama güncellenirken hata oluştu.',
        color: 'error'
      })
    }
  }

  // Kategori sıralama fonksiyonu
  async function updateCategoryOrder() {
    try {
      const categoriesData = props.kategoriler.map((category, index) => ({
        id: category.id,
        order: index + 1
      }))

      console.log('Sending category order update:', categoriesData) // Debug

      const csrfToken = getCsrfToken()
      const response = await fetch('/api/menu/categories/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ categories: categoriesData })
      })

      console.log('Category order response status:', response.status) // Debug

      if (response.ok) {
        const data = await response.json()
        console.log('Category order success response:', data) // Debug
        toast.add({
          title: 'Başarılı',
          description: 'Kategori sıralaması güncellendi.',
          color: 'success'
        })
      } else {
        const errorData = await response.text()
        console.error('Category order error response:', errorData) // Debug
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }
    } catch (error) {
      console.error('Update category order error:', error) // Debug
      toast.add({
        title: 'Hata',
        description: 'Kategori sıralaması güncellenirken hata oluştu.',
        color: 'error'
      })
    }
  }
</script>

<template>
  <UDashboardPanel id="menu">
    <template #header>
      <UDashboardNavbar title="Menü" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse as="button" :disabled="false" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold mb-2">Menü Yönetimi</h1>
              <p class="text-gray-600">Menü öğelerinizi buradan yönetebilirsiniz.</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500">Dil:</span>
              <UDropdownMenu :items="languageItems">
                <UButton 
                  :label="getCurrentLanguageName()" 
                  trailing-icon="i-lucide-chevron-down"
                  variant="outline"
                  class="w-32"
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>

        <!-- Kategori Listesi -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Kategoriler</h2>
            <UButton
              label="Yeni Kategori"
              icon="i-lucide-plus"
              size="sm"
              @click="openAddCategoryModal"
            />
          </div>
          <div v-if="kategoriler.length === 0" class="text-center py-8">
            <UIcon name="i-lucide-folder-x" class="size-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 mb-2">Henüz kategori bulunmuyor.</p>
            <p class="text-sm text-gray-400">Firma ID: {{ firma?.id }}</p>
          </div>
          <div v-else class="flex gap-3 overflow-x-auto pb-2">
            <div
              v-for="(kategori, index) in kategoriler"
              :key="kategori.id"
              class="flex items-center gap-2 shrink-0 cursor-move"
              draggable="true"
              @dragstart="handleCategoryDragStart($event, index)"
              @dragover="handleCategoryDragOver($event)"
              @drop="handleCategoryDrop($event, index)"
            >
              <!-- Drag Handle -->
              <div class="flex-shrink-0 cursor-grab active:cursor-grabbing">
                <UIcon name="i-lucide-grip-vertical" class="size-4 text-gray-400" />
              </div>
              
              <UButton
                :label="parseJsonField(kategori.kategori_adi, currentLanguage)"
                :color="selectedCategory?.id === kategori.id ? 'primary' : 'neutral'"
                :variant="selectedCategory?.id === kategori.id ? 'solid' : 'outline'"
                size="lg"
                :loading="isLoading && selectedCategory?.id === kategori.id"
                @click="selectCategory(kategori)"
              />
              <UButton
                icon="i-lucide-edit"
                size="sm"
                color="neutral"
                variant="ghost"
                @click="openEditCategoryModal(kategori)"
              />
            </div>
          </div>
        </div>

        <!-- Ürün Listesi -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">{{ parseJsonField(selectedCategory?.kategori_adi, currentLanguage) || 'Kategori' }} Ürünleri</h2>
            <UBadge :label="products.length" variant="subtle" />
          </div>

          <div v-if="isLoading" class="text-center py-12">
            <UIcon name="i-lucide-loader-2" class="size-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p class="text-gray-500">Ürünler yükleniyor...</p>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-package" class="size-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(urun, index) in products"
              :key="urun.id"
              class="flex items-center gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-move"
              draggable="true"
              @dragstart="handleDragStart($event, index)"
              @dragover="handleDragOver($event)"
              @drop="handleDrop($event, index)"
            >
              <!-- Drag Handle -->
              <div class="flex-shrink-0 cursor-grab active:cursor-grabbing">
                <UIcon name="i-lucide-grip-vertical" class="size-5 text-gray-400" />
              </div>
              
              <!-- Ürün Bilgileri -->
              <div class="flex-1" @click="editProduct(urun)">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-lg">{{ parseJsonField(urun.urun_adi, currentLanguage) }}</h3>
                  <UBadge :label="formatPrice(urun.urun_fiyati)" color="success" variant="subtle" />
                </div>
                <p class="text-gray-600 text-sm mt-1">{{ stripHtmlTags(parseJsonField(urun.urun_aciklama, currentLanguage)) }}</p>
                <div v-if="urun.paket_urun_fiyati" class="mt-2">
                  <span class="text-xs text-gray-500">Paket Fiyatı: </span>
                  <span class="text-xs font-medium text-green-600">{{ formatPrice(urun.paket_urun_fiyati) }}</span>
                </div>
              </div>
              
              <!-- Düzenle Butonu -->
              <UButton
                icon="i-lucide-edit"
                size="sm"
                color="neutral"
                variant="outline"
                @click.stop="editProduct(urun)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Ürün Düzenleme Modalı -->
  <UModal v-model:open="isEditModalOpen" :title="`Ürün Düzenle (${currentLanguage === 'tr' ? 'Türkçe' : 'English'})`" description="Seçili dilde ürün bilgilerini güncelleyin">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <!-- Ürün Adı -->
        <UFormField label="Ürün Adı" name="urun_adi" required>
          <UInput 
            v-model="state.urun_adi" 
            placeholder="Ürün adını girin"
            size="lg"
            icon="i-lucide-package"
          />
        </UFormField>
        
        <!-- Açıklama -->
        <UFormField label="Açıklama" name="urun_aciklama" required>
          <UTextarea 
            v-model="state.urun_aciklama" 
            placeholder="Ürün açıklamasını girin"
            :rows="4"
            resize
            size="lg"
            icon="i-lucide-file-text"
          />
        </UFormField>

        <!-- Fiyat Alanları -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Fiyat" name="urun_fiyati">
            <UInput 
              v-model="state.urun_fiyati" 
              placeholder="₺0.00"
              size="lg"
              icon="i-lucide-dollar-sign"
              type="number"
              step="0.01"
            />
          </UFormField>
          
          <UFormField label="Paket Fiyatı" name="paket_urun_fiyati">
            <UInput 
              v-model="state.paket_urun_fiyati" 
              placeholder="₺0.00"
              size="lg"
              icon="i-lucide-shopping-cart"
              type="number"
              step="0.01"
            />
          </UFormField>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <UButton 
            label="İptal" 
            color="neutral" 
            variant="outline"
            size="lg"
            @click="closeModal" 
          />
          <UButton 
            label="Güncelle" 
            color="primary" 
            variant="solid"
            size="lg"
            type="submit"
            icon="i-lucide-save"
          />
        </div>
      </UForm>
    </template>
  </UModal>

  <!-- Yeni Kategori Modalı -->
  <UModal v-model:open="isAddCategoryModalOpen" title="Yeni Kategori" description="Yeni kategori oluşturun">
    <template #body>
      <UForm :state="categoryState" class="space-y-4" @submit="onSubmitCategory">
        <UFormField label="Kategori Adı" name="kategori_adi">
          <UInput v-model="categoryState.kategori_adi" placeholder="Kategori adını girin" />
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton 
            label="İptal" 
            color="neutral" 
            variant="subtle" 
            @click="closeCategoryModals" 
          />
          <UButton 
            label="Oluştur" 
            color="primary" 
            variant="solid" 
            type="submit" 
          />
        </div>
      </UForm>
    </template>
  </UModal>

  <!-- Kategori Düzenleme Modalı -->
  <UModal v-model:open="isEditCategoryModalOpen" :title="`Kategori Düzenle (${currentLanguage === 'tr' ? 'Türkçe' : 'English'})`" description="Seçili dilde kategori adını güncelleyin">
    <template #body>
      <UForm :state="categoryState" class="space-y-4" @submit="onSubmitCategory">
        <UFormField label="Kategori Adı" name="kategori_adi">
          <UInput v-model="categoryState.kategori_adi" placeholder="Kategori adını girin" />
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton 
            label="İptal" 
            color="neutral" 
            variant="subtle" 
            @click="closeCategoryModals" 
          />
          <UButton 
            label="Güncelle" 
            color="primary" 
            variant="solid" 
            type="submit" 
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
