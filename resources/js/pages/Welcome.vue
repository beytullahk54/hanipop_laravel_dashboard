<script setup lang="ts">
  import { dashboard, login } from '@/routes'
  import { Head, Link, useForm } from '@inertiajs/vue3'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import { reactive } from 'vue'
  import * as z from 'zod'
  
  const props = defineProps<{ productCount?: number, categoryCount?: number }>()
  
  const form = useForm({
    first_name: '',
    last_name: '',
    restoran_adi: '',
    email: '',
    password: '',
  })
  
  const state = reactive({
    first_name: '',
    last_name: '',
    restoran_adi: '',
    email: '',
    password: '',
  })
  
  const schema = z.object({
    first_name: z.string('Ad gereklidir').min(1, 'Ad gereklidir'),
    last_name: z.string('Soyad gereklidir').min(1, 'Soyad gereklidir'),
    restoran_adi: z.string('Restoran adı gereklidir').min(1, 'Restoran adı gereklidir'),
    email: z.string('E-posta gereklidir').email('Geçersiz e-posta'),
    password: z.string('Şifre gereklidir').min(8, 'En az 8 karakter olmalıdır'),
  })
  
  type Schema = z.output<typeof schema>
  
  function onSubmit(event: FormSubmitEvent<Schema>) {
    form.first_name = event.data.first_name
    form.last_name = event.data.last_name
    form.restoran_adi = event.data.restoran_adi
    form.email = event.data.email
    form.password = event.data.password
    form.post('/register-with-menu', {
      onSuccess: () => {
        // Başarılı kayıt sonrası dashboard'a yönlendirilecek
      }
    })
  }
</script>

<template>
  <Head title="Welcome">
    <link rel="preconnect" href="https://rsms.me/" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  </Head>
  <div class="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
    <header class="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
      <nav class="flex items-center justify-end gap-4">
        <Link
          v-if="$page.props.auth.user"
          :href="dashboard()"
          class="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
        >
          Dashboard
        </Link>
        <template v-else>
          <Link
            :href="login()"
            class="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
          >
            Panele giriş yap
          </Link>
        </template>
      </nav>
    </header>
    <div class="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
      <main class="flex w-full max-w-[335px] overflow-hidden rounded-lg lg:max-w-4xl">
        <div
          class="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"
        >
          <h1 class="mb-1 font-medium">Hoşgeldiniz</h1>
          <p class="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
            QR menü oluşturmak için hesabınızı oluşturun.
          </p>
          
          <!-- Kayıt Formu -->
          <div v-if="!$page.props.auth?.user" class="mb-6 mt-6 ">
            <h2 class="mb-4 text-lg font-medium">Hesap Oluştur ve Menü Oluştur</h2>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
              <UFormField name="restoran_adi" label="Restoran Adı" :error="form.errors.restoran_adi">
                <UInput v-model="state.restoran_adi" placeholder="Restoran adınız" class="w-full" />
              </UFormField>
              <div class="grid grid-cols-2 gap-4">
                <UFormField name="first_name" label="Ad" :error="form.errors.first_name">
                  <UInput v-model="state.first_name" placeholder="Adınız" class="w-full" />
                </UFormField>
                <UFormField name="last_name" label="Soyad" :error="form.errors.last_name">
                  <UInput v-model="state.last_name" placeholder="Soyadınız" class="w-full" />
                </UFormField>
              </div>
              <UFormField name="email" label="E-posta" :error="form.errors.email">
                <UInput v-model="state.email" type="email" placeholder="e-posta@örnek.com" class="w-full" />
              </UFormField>
              <UFormField name="password" label="Şifre" :error="form.errors.password">
                <UInput v-model="state.password" type="password" placeholder="Şifre (min. 8 karakter)" class="w-full" />
              </UFormField>
              <UButton 
                type="submit" 
                :loading="form.processing" 
                class="w-full bg-[#1b1b18] text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
              >
                Menü Oluştur
              </UButton>
            </UForm>
          </div>
          <div v-if="$page.props.auth?.user" class="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-md border border-[#e3e3e0] p-3 dark:border-[#3E3E3A]">
              <div class="text-[#706f6c] dark:text-[#A1A09A]">Ürün Sayınız</div>
              <div class="mt-1 text-lg font-semibold">{{ props.productCount ?? 0 }}</div>
            </div>
            <div class="rounded-md border border-[#e3e3e0] p-3 dark:border-[#3E3E3A]">
              <div class="text-[#706f6c] dark:text-[#A1A09A]">Kategori Sayınız</div>
              <div class="mt-1 text-lg font-semibold">{{ props.categoryCount ?? 0 }}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div class="hidden h-14.5 lg:block"></div>
  </div>
</template>
