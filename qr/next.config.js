/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    },
    reactStrictMode: true,

    i18n: {
        defaultLocale: 'tr',
        locales: ['tr'],
    },

    images: {
        domains: ['static.wixstatic.com'],
    }
}

module.exports = nextConfig
