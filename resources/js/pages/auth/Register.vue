<script setup lang="ts">
  import { store } from '@/actions/App/Http/Controllers/Auth/RegisteredUserController'
  import Layout from '@/layouts/AuthBasic.vue'
  import { Head, router } from '@inertiajs/vue3'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import * as z from 'zod'

  defineOptions({ layout: Layout })

  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const fields = [
    {
      name: 'name',
      type: 'text' as const,
      label: 'Ad Soyad',
      placeholder: 'Adınız Soyadınız',
    },
    {
      name: 'email',
      type: 'text' as const,
      label: 'E-posta',
      placeholder: 'e-posta@örnek.com',
    },
    {
      name: 'password',
      label: 'Şifre',
      type: 'password' as const,
      placeholder: 'Şifre',
    },
  ]

  const schema = z.object({
    name: z.string('Ad Soyad gereklidir').min(1),
    email: z.email('Geçersiz e-posta'),
    password: z.string('Şifre gereklidir').min(8, 'En az 8 karakter olmalıdır'),
  })

  type Schema = z.output<typeof schema>
  const authForm = useTemplateRef('authForm')

  router.on('error', (errors) => {
    authForm.value!.formRef!.setErrors(getErrors(errors.detail.errors))
  })

  function onSubmit(payload: FormSubmitEvent<Schema>) {
    form.defaults(payload.data).reset()
    form.password_confirmation = payload.data.password
    form.submit(store())
    form.reset('password', 'password_confirmation')
  }
</script>

<template>
  <div>
    <Head title="Kayıt Ol" />

    <UAuthForm
      ref="authForm"
      :fields="fields"
      :schema="schema"
      title="Hesap oluştur"
      :submit="{ label: 'Hesap oluştur' }"
      :loading="form.processing"
      @submit="onSubmit"
    >
      <template #description> Zaten bir hesabınız var mı? <ULink to="/login" class="font-medium text-primary">Giriş yapın</ULink>. </template>

      <template #footer> Kaydolarak, <ULink to="/" class="font-medium text-primary">Hizmet Şartlarımızı</ULink> kabul etmiş olursunuz. </template>
    </UAuthForm>
  </div>
</template>
