<script setup lang="ts">
  import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController'
  import TextLink from '@/components/TextLink.vue'
  import AuthBase from '@/layouts/AuthLayout.vue'
  import { register } from '@/routes'
  import { request } from '@/routes/password'
  import { Form, Head } from '@inertiajs/vue3'

  defineProps<{
    status?: string
    canResetPassword: boolean
  }>()
</script>

<template>
  <AuthBase title="Hesabınıza giriş yapın" description="Giriş yapmak için e-posta adresinizi ve şifrenizi aşağıya girin">
    <Head title="Giriş Yap" />

    <div v-if="status" class="mb-4 text-center text-sm font-medium text-green-600">
      {{ status }}
    </div>

    <Form
      v-bind="AuthenticatedSessionController.store.form()"
      :reset-on-success="['password']"
      v-slot="{ errors, processing }"
      class="flex flex-col gap-6"
    >
      <div class="grid gap-6">
        <UFormField name="text" :error="errors.email" label="Kullanıcı Adı">
          <UInput type="text" class="w-full"  placeholder="username" autofocus />
        </UFormField>

        <UFormField name="password" :error="errors.password" label="Şifre">
          <UInput type="password" class="w-full" autocomplete="current-password" placeholder="Şifre" required />
          <template #hint>
            <TextLink v-if="canResetPassword" :href="request()" class="text-sm text-primary" :tabindex="5"> Şifrenizi mi unuttunuz? </TextLink>
          </template>
        </UFormField>

        <UFormField name="remember" :error="errors.password">
          <UCheckbox label="Beni hatırla" />
        </UFormField>

        <UButton :loading="processing" type="submit" block class="mt-4">Giriş Yap</UButton>
      </div>

      <div class="text-center text-sm text-muted">
        Hesabınız yok mu?
        <TextLink :href="register()" :tabindex="5" class="text-primary">Kaydolun</TextLink>
      </div>
    </Form>
  </AuthBase>
</template>
